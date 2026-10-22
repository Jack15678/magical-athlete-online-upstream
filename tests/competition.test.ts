import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatchPlan, expandedSchedule, matchRaceCount, presetCompetition, validateCompetition, type RaceCount } from '../src/shared/competition.js';
import { characterResources, legacyRoomConfig, validateRoomConfigForPlayers } from '../src/shared/room-config.js';
import { applyGameAction, automaticAction, createGame, startGame } from '../src/engine/index.js';
import { roomRules } from '../src/engine/runtime.js';
import { FAN_V3_RULES_VERSION } from '../src/shared/rules-versions.js';
import { Store } from '../src/server/store.js';
import { Rooms } from '../src/server/rooms.js';
import type { Player } from '../src/shared/types.js';
import { projectRoom } from '../src/shared/room-core.js';
import { decideAI } from '../src/engine/ai.js';
import { mkdirSync, writeFileSync } from 'node:fs';

const players=(n:number):Player[]=>Array.from({length:n},(_,i)=>({id:`p${i}`,name:`玩家${i}`,seat:i,color:'blue',isAI:true,ready:true,connected:true,score:0,hand:[],used:[],selection:[]}));
function config(rounds:RaceCount=4){return {...legacyRoomConfig('mixed'),competition:{...presetCompetition(),preset:'custom' as const,raceCount:rounds}};}

test('exact presets, repeated rotations and complete reward sets',()=>{
  assert.deepEqual(expandedSchedule(presetCompetition()),['mild','wild','mild','wild']);
  assert.deepEqual(expandedSchedule(presetCompetition('official')),['mild','wild','twisty-twirl','whirly-world']);
  assert.deepEqual(expandedSchedule(presetCompetition('extended')),['mild','wild','twisty-twirl','whirly-world','squiggle','boardwalks','bridges','wild']);
  for(const rotation of [['wild'],['mild','wild'],['mild','wild','mild'],['mild','mild','wild','wild']] as const){
    const c=config(6);c.competition.rotation=[...rotation];assert.deepEqual(createMatchPlan(c).races.map(r=>r.map),Array.from({length:6},(_,i)=>rotation[i%rotation.length]));
  }
  assert.deepEqual(createMatchPlan(config(6)).races.map(r=>r.rewards),[[3,1],[4,2],[4,2],[5,3],[5,3],[6,4]]);
  assert.deepEqual(createMatchPlan(config(8)).races.map(r=>r.rewards),[[3,1],[3,1],[4,2],[4,2],[5,3],[5,3],[6,4],[6,4]]);
});
test('invalid and unavailable combinations fail closed without altering the input',()=>{
  for(const patch of [{rotation:[]},{raceCount:5},{rotation:Array(5).fill('mild')},{rotation:['boardwalks']},{mode:'tournament'},{thrillingThirds:{enabled:true,rounds:[3]}},{thrillingThirds:{enabled:false,rounds:[3]}},{unexpected:true}]){
    const c={...presetCompetition(),preset:'custom',...patch},before=JSON.stringify(c);assert.throws(()=>validateCompetition(c));assert.equal(JSON.stringify(c),before);
  }
  assert.throws(()=>validateCompetition({...presetCompetition(),rotation:['wild']}),/自定义/);
  assert.throws(()=>validateCompetition(presetCompetition('official')),/Twisty Twirl.*Whirly World/);
  assert.throws(()=>validateCompetition(presetCompetition('extended')),/Squiggle.*Boardwalks.*Bridges/);
  const scarce=config(8);scarce.characterPacks['second-wind']=false;assert.throws(()=>validateRoomConfigForPlayers(scarce,5),/缺.*减少场数/);
  const leaf=config(8);leaf.characterPacks['leaf-fan']=true;assert.throws(()=>validateRoomConfigForPlayers(leaf,3),/返场跑者/);
  assert.equal(characterResources(legacyRoomConfig(),8).reserve,3);
  const restored=legacyRoomConfig();assert.equal(createMatchPlan(restored).raceCount,4);
});
for(const rounds of [4,6,8] as const)for(const n of [2,3,8])test(`${n} players finish ${rounds} races: complete snake, roster, saved maps, scores, no extra final`,()=>{
  const s=createGame(players(n),12000+n*100+rounds);s.config=config(rounds);s.config.competition!.rotation=['wild','mild','mild'];s.config.competition!.preset='custom';startGame(s);
  let version=1;
  function next(){
    const system=s.phase==='race'&&!s.pending&&(s.flags.needsBegin||s.flags.continuation)?automaticAction(s):undefined;
    if(system)return system;
    const playerId=s.pending?.playerId??(s.phase==='draft'?s.draft!.order[s.draft!.cursor]!:s.phase==='selection'?s.players.find(p=>!p.selection.length)!.id:s.phase==='results'?'p0':s.racers.find(r=>r.id===s.currentRacerId)?.playerId??'p0');
    const action=decideAI(projectRoom({code:'ABC234',hostId:'p0',version:version++,createdAt:1,updatedAt:1,maxPlayers:n,timeoutSeconds:0,deadline:null,game:s},playerId,{authorityId:'p0',authorityOnline:true}));
    return action?{playerId,action}:undefined;
  }
  const batches:{first:string;order:string[];market:number}[]=[];
  while(s.phase==='draft'){
    if(s.draft!.cursor===0)batches.push({first:s.draft!.order[0]!,order:[...s.draft!.order],market:s.draft!.market.length});
    const a=next()!;applyGameAction(s,a.playerId,a.action);
  }
  const k=n===2?2:1,classicDuo=rounds===4&&n===2;
  assert.equal(batches.length,classicDuo?2:rounds*k/2);
  for(const [i,batch] of batches.entries()){
    assert.equal(batch.market,classicDuo?8:n*2);
    const first=s.players.findIndex(p=>p.id===batches[0]!.first);assert.equal(batch.first,s.players[(first+i)%n]!.id);
    const forward=Array.from({length:n},(_,j)=>s.players[(first+i+j)%n]!.id);assert.deepEqual(batch.order,classicDuo?[...forward,...forward.toReversed(),...forward,...forward.toReversed()]:[...forward,...forward.toReversed()]);
  }
  const selected=s.players.flatMap(p=>p.hand);assert.equal(new Set(selected).size,n*rounds*k);assert(s.players.every(p=>p.hand.length===rounds*k));
  const plan=structuredClone(s.matchPlan);let steps=0;
  while((s.phase as string)!=='finished'){
    assert(++steps<15000,`budget at round ${s.round}, phase ${s.phase}`);
    assert.equal(s.track,plan!.races[s.round-1]!.map);
    const a=next();
    if(!a){mkdirSync('.local',{recursive:true});writeFileSync(`.local/competition-${n}-${rounds}-failure.json`,JSON.stringify(s));}
    assert(a,`no continuation ${s.phase}`);applyGameAction(s,a.playerId,a.action);
  }
  assert.equal(s.round,rounds);assert.equal(s.results.length,rounds);assert.deepEqual(s.matchPlan,plan);
  assert(s.players.every(p=>p.hand.length===0&&p.used.length===rounds*k));
  for(const result of s.results){for(const place of result.placements)assert.equal(place.points,plan!.races[result.round-1]!.rewards[place.rank-1]);for(const entry of result.scores!)assert.equal(entry.total,entry.placement+entry.map+entry.skill+entry.event);}
  for(const p of s.players)assert.equal(p.score,s.results.reduce((sum,r)=>sum+r.scores!.find(e=>e.playerId===p.id)!.total,0));
  const before=JSON.stringify(s.results);assert.throws(()=>applyGameAction(s,s.players[0]!.id,{type:'next'}));assert.equal(JSON.stringify(s.results),before);
});
test('practice 8-card selection, frozen plan restore, unknown plan refusal and old four-round engine',()=>{
  const s=createGame(players(1),123,'practice');s.config=config(8);startGame(s);
  const a=automaticAction(s)!;assert.equal(a.action.type,'practice-team');if(a.action.type==='practice-team')assert.equal(a.action.characterIds.length,8);
  applyGameAction(s,a.playerId,a.action);const restored=JSON.parse(JSON.stringify(s));assert.deepEqual(roomRules(restored),roomRules(s));
  let steps=0;
  while(s.phase!=='finished'){
    assert(++steps<4000);const next=automaticAction(s);assert(next,`practice stalled: ${s.phase}/${s.pending?.kind}`);applyGameAction(s,next.playerId,next.action);
  }
  assert.equal(s.results.length,8);assert.equal(s.players[0]!.used.length,8);
  restored.matchPlan.trackVersion='future';assert.throws(()=>roomRules(restored),/不兼容/);
  const old=createGame(players(3),121);old.rulesVersion=FAN_V3_RULES_VERSION;roomRules(old).startGame(old);assert.equal(old.matchPlan,undefined);
  old.phase='finished';old.config=config(8);assert.equal(matchRaceCount(old),4);
});
test('Node config freeze, stale requests, private listing and rematch back to editable lobby',()=>{
  const store=new Store(':memory:'),rooms=new Rooms(store,0);
  try{
    const h=rooms.create('同名',2,0,'multiplayer',0,'mixed',{...config(6),visibility:'private'}),code=h.identity.roomCode;
    assert.equal(rooms.list().length,0);assert.equal(rooms.capacity().used,1);
    const g=rooms.join(code,'同名');rooms.presence(code,h.identity.playerId,true);rooms.presence(code,g.identity.playerId,true);
    const send=(id:string,action:any,version=rooms.get(code).version)=>rooms.act(code,id,{actionId:crypto.randomUUID(),expectedVersion:version,action});
    send(h.identity.playerId,{type:'ready',ready:true});send(g.identity.playerId,{type:'ready',ready:true});
    assert(send(h.identity.playerId,{type:'configure',config:config(8)}).ok);assert(rooms.get(code).game.players.every(p=>!p.ready));
    send(h.identity.playerId,{type:'ready',ready:true});send(g.identity.playerId,{type:'ready',ready:true});const stale=rooms.get(code).version;
    assert(send(h.identity.playerId,{type:'start'}).ok);assert.equal(send(h.identity.playerId,{type:'configure',config:config(4)},stale).ok,false);
    assert.equal(send(h.identity.playerId,{type:'configure',config:config(4)}).ok,false);assert.equal(rooms.get(code).game.matchPlan!.raceCount,8);
    const game=rooms.get(code).game;game.phase='finished';
    assert(send(h.identity.playerId,{type:'rematch'}).ok);assert.equal(rooms.get(code).game.phase,'lobby');assert.equal(rooms.get(code).game.matchPlan,undefined);assert.equal(rooms.get(code).configFrozen,false);
  }finally{store.close();}
});
