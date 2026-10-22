import test from 'node:test';
import assert from 'node:assert/strict';
import { applyGameAction, createGame, enqueueMove, resolveTasks } from '../src/engine/index.js';
import { automaticRoomAction, roomRules, systemRoomAction } from '../src/engine/runtime.js';
import { decideAI } from '../src/engine/ai.js';
import { createMatchPlan, presetCompetition, type RaceCount } from '../src/shared/competition.js';
import { legacyRoomConfig, validateRoomConfigForPlayers } from '../src/shared/room-config.js';
import { createBrowserRoom, projectRoom, reconcileRoster, reduceRoomAction } from '../src/shared/room-core.js';
import { immediateRoomAction } from '../src/shared/automation.js';
import { FAN_V3_RULES_VERSION } from '../src/shared/rules-versions.js';
import type { GameState, Player, Room } from '../src/shared/types.js';
import type { RelayMetadata } from '../src/shared/relay.js';
import { Store } from '../src/server/store.js';
import { Rooms } from '../src/server/rooms.js';

const players=(n:number):Player[]=>Array.from({length:n},(_,seat)=>({id:`p${seat}`,name:`玩家${seat}`,seat,color:'blue',ready:true,connected:true,score:0,hand:[],used:[],selection:[]}));
const config=(raceCount:RaceCount)=>({...legacyRoomConfig('mixed'),competition:{...presetCompetition(),preset:'custom' as const,raceCount}});
function room(n=3):Room{return {code:'ABC234',hostId:'p0',ownerId:'p0',createdAt:1,updatedAt:1,version:1,maxPlayers:n,timeoutSeconds:0,deadline:null,game:createGame(players(n),71)};}
function meta(r:Room):RelayMetadata{return {code:r.code,authorityId:r.hostId,adminHostId:r.hostId,ownerId:r.ownerId,maxPlayers:r.maxPlayers,timeoutSeconds:0,phase:r.game.phase,createdAt:r.createdAt,members:r.game.players.map(p=>({id:p.id,name:p.name,seat:p.seat,connected:true})),config:r.game.config};}

for(const rounds of [4,6,8] as const)for(const n of [2,3,8])test(`review ${n} players / ${rounds} races: every last draft card persists exactly once`,()=>{
  let current=room(n);current.game.config=config(rounds);
  current=reduceRoomAction(current,'p0',{type:'start'},{now:2,rematchSeed:0});
  let batches=0;
  while(current.game.phase==='draft'){
    while(current.game.draft!.market.length>1){
      assert.equal(immediateRoomAction(current,current.updatedAt),undefined);
      const pick=automaticRoomAction(current.game)!;
      current=reduceRoomAction(current,pick.playerId,pick.action,{now:current.updatedAt+1,rematchSeed:0});
    }
    const card=current.game.draft!.market[0]!,recipient=current.game.draft!.order[current.game.draft!.cursor]!;
    const auto=immediateRoomAction(current,current.updatedAt)!;
    assert.equal(auto.reason,'system');assert.deepEqual(auto.action,{type:'draft',characterId:card});
    const store=new Store(':memory:');
    try{
      store.save(current);let saved=new Rooms(store,0,()=>current.updatedAt+1);
      const envelope={actionId:`last-${rounds}-${n}-${batches}`,expectedVersion:current.version,action:auto.action};
      assert.equal(saved.act(current.code,recipient,envelope).ok,true);
      saved=new Rooms(store,0,()=>current.updatedAt+2);
      const before=JSON.stringify(saved.get(current.code).game);
      assert.equal(saved.act(current.code,recipient,envelope).duplicate,true);
      assert.equal(saved.act(current.code,recipient,{...envelope,actionId:'late-pick'}).ok,false);
      assert.equal(JSON.stringify(saved.get(current.code).game),before);
      current=saved.get(current.code);
      assert.equal(current.game.players.flatMap(p=>p.hand).filter(id=>id===card).length,1);
      for(const p of current.game.players)p.connected=true;
    }finally{store.close();}
    batches++;
  }
  const cards=rounds*(n===2?2:1),hands=current.game.players.flatMap(p=>p.hand);
  assert.equal(batches,n===2&&rounds===4?2:cards/2);
  assert(current.game.players.every(p=>p.hand.length===cards));
  assert.equal(new Set(hands).size,cards*n);assert.equal(current.game.phase,'selection');
});

function leafOnly(){const c=legacyRoomConfig();c.characterPacks.original=false;c.characterPacks['leaf-fan']=true;return c;}
test('review frozen fan-v3 Leaf-only save reconnects without applying new-game reserve requirements',()=>{
  const old=room(4);old.game.rulesVersion=FAN_V3_RULES_VERSION;old.game.config=leafOnly();
  roomRules(old.game).startGame(old.game);
  const frozen=JSON.parse(JSON.stringify(old)) as Room;
  assert.throws(()=>validateRoomConfigForPlayers(leafOnly(),4),/技能抽牌预留/);
  const restored=reconcileRoster(frozen,meta(frozen),3).room;
  assert.deepEqual(restored.game,frozen.game);
  const pick=automaticRoomAction(restored.game)!;
  const next=reduceRoomAction(restored,pick.playerId,pick.action,{now:4,rematchSeed:0});
  assert.equal(next.game.rulesVersion,FAN_V3_RULES_VERSION);
  assert.equal(next.game.players.find(p=>p.id===pick.playerId)!.hand.length,1);
  const newMeta=meta(room(4));newMeta.config=leafOnly();
  assert.throws(()=>createBrowserRoom(newMeta,71,3),/技能抽牌预留/,'new rooms still require sufficient reserves');
});

test('review frozen fan-v3 lobby starts under its saved rules; rematch requires the new rules',()=>{
  const old=room(4);old.game.rulesVersion=FAN_V3_RULES_VERSION;old.game.config=leafOnly();
  const started=reduceRoomAction(old,'p0',{type:'start'},{now:2,rematchSeed:0});
  assert.equal(started.game.rulesVersion,FAN_V3_RULES_VERSION);assert.equal(started.game.matchPlan,undefined);
  started.game.phase='finished';
  let next=reduceRoomAction(started,'p0',{type:'rematch'},{now:3,rematchSeed:71});
  for(const p of next.game.players)p.ready=true;
  assert.throws(()=>reduceRoomAction(next,'p0',{type:'start'},{now:4,rematchSeed:0}),/技能抽牌预留/);
  next=reduceRoomAction(next,'p0',{type:'configure',config:config(6)},{now:5,rematchSeed:0});
  for(const p of next.game.players)p.ready=true;
  next=reduceRoomAction(next,'p0',{type:'start'},{now:6,rematchSeed:0});
  assert.equal(next.game.matchPlan!.raceCount,6);
});

for(const {n,seed,expected} of [{n:2,seed:12204,expected:'finished'},{n:3,seed:12305,expected:'finished'},{n:8,seed:12804,expected:'finished'},{n:3,seed:12304,expected:'paused'}])test(`review frozen fan-v3 ${n}-player seed ${seed} restores and retains ${expected} outcome`,()=>{
  const saved=room(n);saved.game=createGame(players(n),seed);saved.game.config=config(4);saved.game.rulesVersion=FAN_V3_RULES_VERSION;
  roomRules(saved.game).startGame(saved.game);
  let steps=0,lastRound=0;
  while(saved.game.phase!=='finished'&&saved.game.phase!=='paused'){
    assert(++steps<15000,`stalled at ${saved.game.phase}/${saved.game.round}`);
    if(saved.game.round!==lastRound){saved.game=JSON.parse(JSON.stringify(saved.game));lastRound=saved.game.round;}
    const s=saved.game,system=systemRoomAction(s);
    const actor=system?.playerId??s.pending?.playerId??(s.phase==='draft'?s.draft!.order[s.draft!.cursor]!:s.phase==='selection'?s.players.find(p=>!p.selection.length)!.id:s.phase==='results'?'p0':s.racers.find(r=>r.id===s.currentRacerId)!.playerId);
    const action=system?.action??decideAI(projectRoom(saved,actor,{authorityId:'p0',authorityOnline:true}));
    assert(action,JSON.stringify({phase:s.phase,round:s.round,hold:s.flags.ruleHold,racers:s.racers.map(r=>({card:r.characterId,position:r.position}))}));roomRules(s).applyGameAction(s,actor,action);saved.version++;
  }
  assert.equal(saved.game.phase,expected);
  if(expected==='paused'){
    assert.equal(saved.game.round,2);assert.equal((saved.game.flags.ruleHold as {kind:string}).kind,'forced-cycle');
    assert.equal(saved.game.results.length,1);return;
  }
  assert.equal(saved.game.results.length,4);assert.equal(saved.game.round,4);assert.equal(saved.game.matchPlan,undefined);
  assert(saved.game.players.every(p=>p.hand.length===0&&p.used.length===(n===2?8:4)));
  assert(saved.game.results.every(r=>r.scores===undefined));
});

// Enter through real selection so before-race income is included in the ledger.
function race(ids:string[],round=1,rounds:RaceCount=8,initial:number[]=ids.map(()=>0)){
  const s=createGame(players(ids.length),456);s.config=config(rounds);s.matchPlan=createMatchPlan(s.config);s.round=round;s.phase='selection';s.flags.firstPlayer='p0';
  for(const [i,p] of s.players.entries()){p.hand=[ids[i]!];p.score=initial[i]!;}
  for(const [i,id] of ids.entries())applyGameAction(s,`p${i}`,{type:'select',characterIds:[id]});
  return s;
}
function balanced(s:GameState){
  const initial=s.flags.roundStartScores as Record<string,number>;
  for(const p of s.players){const e=s.scoreLedger!.find(e=>e.playerId===p.id)!;assert.equal(e.total,e.placement+e.map+e.skill+e.event);assert.equal(e.total,p.score-initial[p.id]!);}
  if(s.results.at(-1)?.round===s.round)assert.deepEqual(s.results.at(-1)!.scores,s.scoreLedger);
}
function answer(s:GameState,optionId:string){const c=s.pending!;applyGameAction(s,c.playerId,{type:'choose',choiceId:c.id,optionId});balanced(s);}
function move(s:GameState,index:number,distance:number){s.flags.awaitRoll=false;enqueueMove(s,s.racers[index]!.id,distance);resolveTasks(s);balanced(s);}
function clean(s:GameState){assert.equal(s.pending,undefined);s.queue=[];s.flags.awaitRoll=false;s.flags.needsBegin=false;}

test('review ledger records before-race income, zero-floor losses, map income and long-schedule placement rewards',()=>{
  const s=race(['sisyphus','legs','blimp'],8,8);balanced(s);assert.equal(s.scoreLedger![0]!.skill,4);clean(s);
  s.queue=[{kind:'gain',racerId:s.racers[0]!.id,amount:-9}];resolveTasks(s);balanced(s);assert.equal(s.scoreLedger![0]!.skill,0);
  s.racers[1]!.position=12;move(s,1,1);assert.equal(s.scoreLedger![1]!.map,1);
  s.racers[1]!.position=29;move(s,1,1);s.racers[2]!.position=29;move(s,2,1);
  assert.equal(s.phase,'finished');assert.deepEqual(s.results[0]!.placements.map(p=>p.points),[6,4]);
  assert.deepEqual(s.players.map(p=>p.score),[0,7,4]);
});

test('review ledger records Hotel payments and Robin Hood transfers for both players',()=>{
  const s=race(['hotel','extra-mile-robin-hood','legs'],6,6,[0,1,3]);clean(s);
  s.racers.forEach((r,i)=>r.position=[5,0,4][i]!);move(s,2,1);
  assert.deepEqual(s.players.map(p=>p.score),[1,1,2]);
  s.racers.forEach((r,i)=>r.position=[2,8,9][i]!);move(s,1,1);
  assert.deepEqual(s.players.map(p=>p.score),[2,1,1]);
  assert.deepEqual(s.scoreLedger!.map(e=>e.skill),[2,0,-2]);
});

test('review ledger captures Thief race-end transfer and saved final totals',()=>{
  let s=race(['extra-mile-thief','legs','blimp'],8,8);
  assert.equal(s.pending?.kind,'em-thief');answer(s,s.racers[1]!.id);clean(s);
  s.racers[1]!.position=29;move(s,1,1);s=JSON.parse(JSON.stringify(s));
  s.racers[2]!.position=29;move(s,2,1);
  assert.equal(s.phase,'finished');assert.deepEqual(s.players.map(p=>p.score),[6,0,4]);
  assert.deepEqual(s.scoreLedger!.map(e=>[e.placement,e.skill,e.total]),[[0,6,6],[6,-6,0],[4,0,4]]);
});

for(const response of ['allow','block'])test(`review ledger waits for Wily's persisted Fox ${response} before final snapshot`,()=>{
  let s=race(['wurstii-dr-wily','extra-mile-mr-fox','legs','blimp'],8,8);
  assert.equal(s.pending?.kind,'em-fox');answer(s,'allow');
  assert.equal(s.pending?.kind,'wurstii-dr-wily');answer(s,s.racers[3]!.id);clean(s);
  s.racers[0]!.eliminated=true;s.racers[2]!.position=29;move(s,2,1);s.racers[3]!.position=29;move(s,3,1);
  assert.equal(s.pending?.kind,'em-fox');assert.equal(s.results.length,0);s=JSON.parse(JSON.stringify(s));answer(s,response);
  assert.equal(s.phase,'finished');assert.equal(s.results.length,1);assert.equal(s.scoreLedger![0]!.skill,response==='allow'?3:0);
  const before=JSON.stringify(s.results);resolveTasks(s);assert.equal(JSON.stringify(s.results),before);balanced(s);
});

test('review ledger preserves finite reaction-ring income and tail effects after restoration',()=>{
  let s=race(['wurstii-mr-game-and-watch','scoocher','magikarp'],8,8);clean(s);
  s.racers[0]!.position=12;s.racers[1]!.position=12;s.racers[2]!.position=25;
  s.queue=[{kind:'ability',racerId:s.racers[1]!.id,power:'scoocher',effects:[{kind:'move',racerId:s.racers[1]!.id,distance:1,cause:'scoocher'}]},{kind:'gain',racerId:s.racers[0]!.id,amount:3}];
  s=JSON.parse(JSON.stringify(s));resolveTasks(s);balanced(s);
  assert.deepEqual(s.players.map(p=>p.score),[4,1,0]);assert.deepEqual(s.scoreLedger!.map(e=>[e.map,e.skill]),[[1,3],[1,0],[0,0]]);
  assert.equal(s.queue.length,0);assert.equal(s.phase,'race');assert.equal(s.logs.filter(e=>e.type==='loop').length,1);
});
