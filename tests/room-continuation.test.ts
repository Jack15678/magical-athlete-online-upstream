import test from 'node:test';
import assert from 'node:assert/strict';
import { Rooms } from '../src/server/rooms.js';
import { Store } from '../src/server/store.js';
import { ROOM_OWNER_AWAY_MS } from '../src/shared/room-lifecycle.js';
import { CONTINUE_VOTE_MS,CONTINUE_RESULTS_MS } from '../src/shared/room-continuation.js';
import { immediateRoomAction } from '../src/shared/automation.js';
import { createGame,resolveTasks } from '../src/engine/index.js';
import type { GameAction } from '../src/shared/types.js';

function fixture(count=3){
  const clock={now:Date.now()},store=new Store(':memory:'),rooms=new Rooms(store,0,()=>clock.now);
  const host=rooms.create('房主',count,0).identity,peers=[host];
  for(let i=1;i<count;i++)peers.push(rooms.join(host.roomCode,`朋友${i}`).identity);
  for(const p of peers)rooms.presence(host.roomCode,p.playerId,true);
  const room=rooms.get(host.roomCode),game=createGame(room.game.players,42);game.phase='race';game.round=2;game.track='mild';
  game.racers=peers.map((p,i)=>({id:`r${i}`,playerId:p.playerId,characterId:'coach',position:20-i*3,tripped:false,finished:false,eliminated:false,flags:{}}));
  game.currentRacerId='r0';game.baseTurnOrder=game.racers.map(r=>r.id);game.flags.awaitRoll=true;room.game=game;store.save(room);
  const act=(i:number,action:GameAction,version=rooms.get(room.code).version,actionId=crypto.randomUUID())=>rooms.act(room.code,peers[i]!.playerId,{actionId,expectedVersion:version,action});
  const expire=()=>{rooms.presence(room.code,host.playerId,false);clock.now+=ROOM_OWNER_AWAY_MS;rooms.tick();return rooms.get(room.code);};
  return{clock,store,rooms,peers,room,act,expire};
}
for(const count of [2,3,8])test(`${count} players: expiry pauses race; concurrent, repeated votes agree once and spectators cannot vote`,()=>{
  const e=fixture(count);try{
    const viewer=e.rooms.join(e.room.code,'观众','spectator').identity;e.rooms.presence(e.room.code,viewer.playerId,true);
    const game=structuredClone(e.room.game),room=e.expire(),c=room.continuation!;assert.equal(c.stage,'voting');assert.equal(c.round,2);assert.equal(c.voters.length,count-1);assert.deepEqual(room.game.racers,game.racers);
    assert.equal(immediateRoomAction(room,e.clock.now+5000),undefined);assert.equal(e.act(1,{type:'roll'}).ok,false);
    const vote:GameAction={type:'continue-vote',continuationId:c.id,continue:true};const version=room.version;
    assert.equal(e.rooms.act(room.code,viewer.playerId,{actionId:crypto.randomUUID(),expectedVersion:version,action:vote}).ok,false);
    for(let i=1;i<count;i++){const id=crypto.randomUUID();assert(e.act(i,vote,version,id).ok);const after=e.rooms.get(room.code).version;assert(e.act(i,vote,version,id).duplicate);assert.equal(e.rooms.get(room.code).version,after);}
    const resumed=e.rooms.get(room.code);assert.equal(resumed.continuation!.stage,'playing');assert.equal(e.act(1,{...vote,continuationId:'old-vote'}).ok,false);
    const bot=immediateRoomAction(resumed,e.clock.now+1500)!;assert.equal(bot.playerId,e.peers[0]!.playerId);assert.equal(bot.action.type,'roll');
    assert.equal(e.act(1,{type:'next'}).ok,false);assert.equal(e.act(1,{type:'rematch'}).ok,false);
  }finally{e.store.close();}
});
test('refusal or missing vote closes, and owner presence before expiry cancels the original deadline',()=>{
  for(const refuse of [true,false]){const e=fixture();try{const c=e.expire().continuation!;
    if(refuse)assert(e.act(1,{type:'continue-vote',continuationId:c.id,continue:false}).ok);
    else{assert(e.act(1,{type:'continue-vote',continuationId:c.id,continue:true}).ok);e.clock.now+=CONTINUE_VOTE_MS;e.rooms.tick();}
    assert.equal(e.rooms.closed(e.room.code)?.reason,'host-away');assert.equal(e.store.load().length,0);
  }finally{e.store.close();}}
  const e=fixture();try{e.rooms.presence(e.room.code,e.peers[0]!.playerId,false);e.clock.now+=ROOM_OWNER_AWAY_MS-1;e.rooms.presence(e.room.code,e.peers[0]!.playerId,true);e.clock.now+=5;e.rooms.tick();assert.equal(e.rooms.get(e.room.code).continuation,undefined);}finally{e.store.close();}
});
test('the current race completes with real scoring and stays for result acknowledgements, never starts race 3',()=>{
  const e=fixture();try{
    const c=e.expire().continuation!;for(const i of [1,2])assert(e.act(i,{type:'continue-vote',continuationId:c.id,continue:true}).ok);
    const room=e.rooms.get(e.room.code);room.game.flags.awaitRoll=false;room.game.queue=[{kind:'move',racerId:'r1',distance:20},{kind:'move',racerId:'r2',distance:20}];resolveTasks(room.game);assert.equal(room.game.phase,'results');
    e.rooms.tick();const result=e.rooms.get(room.code);assert.equal(result.continuation!.stage,'results');assert.equal(result.game.round,2);assert.equal(result.game.results[0]!.round,2);assert(result.game.players.some(p=>p.score>0));
    assert.equal(e.act(1,{type:'next'}).ok,false);assert.equal(e.act(1,{type:'rematch'}).ok,false);
    const v=result.version;assert(e.act(1,{type:'results-seen',continuationId:c.id},v).ok);assert(e.rooms.rooms.has(room.code));
    assert(e.act(2,{type:'results-seen',continuationId:c.id},v).ok);assert.equal(e.rooms.closed(room.code)?.reason,'host-away');
  }finally{e.store.close();}
});
test('continuation and votes survive a restart; refreshing the last player allows reconnect; result timeout closes idle clients',()=>{
  const e=fixture(2);try{
    const c=e.expire().continuation!;assert(e.act(1,{type:'continue-vote',continuationId:c.id,continue:true}).ok);
    const restored=new Rooms(e.store,0,()=>e.clock.now);restored.tick();e.clock.now+=1000;restored.presence(e.room.code,e.peers[1]!.playerId,true);restored.tick();
    const room=restored.get(e.room.code);assert.equal(room.continuation!.stage,'playing');assert.equal(room.continuation!.emptySince,undefined);
    room.game.phase='results';room.game.results.push({round:2,placements:[]});restored.tick();e.clock.now+=CONTINUE_RESULTS_MS-1;restored.tick();assert(restored.rooms.has(room.code));e.clock.now++;restored.tick();assert(restored.closed(room.code));
  }finally{e.store.close();}
});
