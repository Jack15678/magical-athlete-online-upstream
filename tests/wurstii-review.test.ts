import assert from 'node:assert/strict';
import test from 'node:test';
import { applyGameAction, createGame, enqueueMove, resolveTasks } from '../src/engine/index.js';
import { Rooms } from '../src/server/rooms.js';
import { Store } from '../src/server/store.js';
import type { ActionEnvelope, Room } from '../src/shared/types.js';
import type { GameState, Player } from '../src/shared/types.js';

const fox='extra-mile-mr-fox';
function fixture(id:string,foxes=1){
  const ids=[`wurstii-${id}`,...Array(foxes).fill(fox),'magikarp'];
  const players:Player[]=ids.map((_,i)=>({id:`p${i}`,name:`玩家${i}`,seat:i,color:'#123456',ready:true,connected:true,score:0,hand:[],used:[],selection:[]}));
  const s=createGame(players,456,'multiplayer','all');s.phase='race';s.round=1;s.currentRacerId='r0';
  s.racers=ids.map((characterId,i)=>({id:`r${i}`,playerId:`p${i}`,characterId,position:i?20+i:5,tripped:false,finished:false,eliminated:false,flags:{}}));
  s.baseTurnOrder=s.racers.map(r=>r.id);s.racers[0]!.flags.turnsTaken=1;
  return s;
}
function end(s:GameState){s.queue=[{kind:'endTurn',racerId:'r0'}];resolveTasks(s);}
function answer(s:GameState,optionId:string){assert.equal(s.pending?.kind,'em-fox');const c=s.pending!;applyGameAction(s,c.playerId,{type:'choose',choiceId:c.id,optionId});}

for(const id of ['knuckles','simon-belmont'])for(const response of ['allow','block'])test(`${id}: one persisted Fox response, ${response} applies exactly once`,()=>{
  let s=fixture(id);end(s);assert.equal(s.pending?.kind,'em-fox');
  assert.equal(Number(s.racers[0]!.flags.wurstiiExtraTurns??0),0);
  s=JSON.parse(JSON.stringify(s));answer(s,response);
  assert.equal(s.pending,undefined,'same activation must not reopen a second Fox window');
  assert.equal(s.currentRacerId,response==='allow'?'r0':'r1');
  assert.equal(Number(s.racers[1]!.flags.foxUsed??0),response==='block'?1:0);
  assert.equal(Number(s.racers[0]!.flags.wurstiiExtraTurns??0),response==='allow'&&id==='knuckles'?1:0);
  assert.equal(s.logs.filter(e=>e.type==='power'&&e.cause===`wurstii-${id}`).length,response==='allow'?1:0);
  if(id==='knuckles')assert.equal(s.racers[0]!.flags.knucklesUsed,true,'declared once-per-race use is spent even if blocked');
});
for(const id of ['knuckles','simon-belmont'])test(`${id}: second Fox can block after first allows; no recursion or remaining window`,()=>{
  const s=fixture(id,3);end(s);assert.equal(s.pending?.playerId,'p1');answer(s,'allow');
  assert.equal(s.pending?.playerId,'p2');answer(s,'block');
  assert.equal(s.pending,undefined);assert.equal(s.currentRacerId,'r1');
  assert.deepEqual(s.racers.slice(1,4).map(r=>Number(r.flags.foxUsed??0)),[0,1,0]);
  assert.equal(Number(s.racers[0]!.flags.wurstiiExtraTurns??0),0);
});
test('Lizzie blocked replacement retains the final ordinary die movement, as Scout does',()=>{
  const s=fixture('lizzie');s.flags.awaitRoll=true;s.flags.testDice=[2];
  applyGameAction(s,'p0',{type:'roll'});answer(s,'block');
  assert.equal(s.racers[0]!.position,7);assert.equal(s.randomLog.length,1);assert.equal(s.lastRoll?.face,2);
});
for(const id of ['knuckles','simon-belmont'])test(`${id}: saved server response, duplicate and stale action cannot replay extras or charges`,()=>{
  const s=fixture(id);end(s);const store=new Store(':memory:');
  try{
    const room:Room={code:'ABC234',hostId:'p0',createdAt:1,updatedAt:1,version:1,maxPlayers:3,timeoutSeconds:0,deadline:null,game:s};
    store.save(room);const rooms=new Rooms(store,0,()=>2);
    const envelope:ActionEnvelope={actionId:`fox-${id}`,expectedVersion:1,action:{type:'choose',choiceId:s.pending!.id,optionId:'block'}};
    assert.equal(rooms.act(room.code,'p1',envelope).ok,true);
    const before=JSON.stringify(rooms.get(room.code).game);
    const restored=new Rooms(store,0,()=>3);assert.equal(restored.act(room.code,'p1',envelope).duplicate,true);
    assert.equal(restored.act(room.code,'p1',{...envelope,actionId:'stale'}).ok,false);
    assert.equal(JSON.stringify(restored.get(room.code).game),before);
    assert.equal(restored.get(room.code).game.racers[1]!.flags.foxUsed,1);
  }finally{store.close();}
});
for(const id of ['knuckles','simon-belmont'])for(const kind of ['wurstiiEnd','activate'])test(`${id}: pre-fix ${kind} save converts to one deferred effect`,()=>{
  const s=fixture(id);end(s);const task=s.pending!.context.task as any;
  task.kind=kind;task.effects=[];task.targetId='r0';
  if(kind==='activate'){if(id==='knuckles')s.racers[0]!.flags.wurstiiExtraTurns=2;else s.racers[0]!.flags.extraTurn=true;}
  answer(s,'block');assert.equal(s.currentRacerId,'r1');assert.equal(s.pending,undefined);
  assert.equal(Number(s.racers[0]!.flags.wurstiiExtraTurns??0),0);assert(!s.racers[0]!.flags.extraTurn);
});
for(const id of ['knuckles','simon-belmont'])test(`${id}: next-actor override preserves remaining extra turns through recovery`,()=>{
  const s=fixture(id,0);s.flags.nextOverride=['r1'];end(s);
  assert.equal(s.currentRacerId,'r1');assert.equal(s.racers[0]!.flags.wurstiiExtraTurns,id==='knuckles'?2:1);
  s.queue=[{kind:'endTurn',racerId:'r1'}];resolveTasks(s);assert.equal(s.currentRacerId,'r0');
  s.racers[0]!.position=6;s.racers[0]!.tripped=true;applyGameAction(s,'p0',{type:'next'});
  assert.equal(s.racers[0]!.tripped,false);assert.equal(s.racers[0]!.flags.turnsTaken,2);
  assert.equal(s.currentRacerId,'r0');assert.equal(s.racers[0]!.flags.wurstiiExtraTurns,id==='knuckles'?1:0);
});
for(const response of ['allow','block'])test(`Wily eliminated owner: ${response} reward at race end only once`,()=>{
  const s=fixture('dr-wily',2);const w=s.racers[0]!;w.eliminated=true;w.flags.wilyPrediction='r3';
  s.racers[1]!.finished=true;s.racers[1]!.rank=1;s.flags.placements=[{racerId:'r1',playerId:'p1',characterId:fox,rank:1,points:3}];
  s.racers[3]!.position=29;enqueueMove(s,'r3',1);resolveTasks(s);
  assert.equal(s.pending?.playerId,'p2');assert.equal(s.players[0]!.score,0);
  answer(s,response);assert.equal(s.phase,'results');assert.equal(s.players[0]!.score,response==='allow'?3:0);
  assert.equal(w.flags.wilyPaid,true);assert.equal(s.results.length,1);resolveTasks(s);assert.equal(s.results.length,1);
});

function reactionLoop(){
  const s=fixture('mr-game-and-watch',0);s.track='wild';s.racers[0]!.position=12;s.racers[1]!.position=12;s.racers[1]!.characterId='scoocher';
  const reaction={kind:'ability',racerId:'r1',power:'scoocher',effects:[{kind:'move',racerId:'r1',distance:1,cause:'scoocher'}]};
  return {s,reaction};
}
test('original Game & Watch / Scoocher wild loop keeps one lap and one star each, including after restoration',()=>{
  let {s,reaction}=reactionLoop();s.queue=[reaction];s=JSON.parse(JSON.stringify(s));resolveTasks(s);
  assert.equal(s.phase,'race');assert.deepEqual(s.racers.map(r=>r.position),[12,12]);assert.deepEqual(s.players.map(p=>p.score),[1,1]);
  assert.equal(s.queue.length,0);assert.equal(s.logs.filter(e=>e.type==='loop').length,1);assert.equal(s.rngState,456);
});
test('independent reaction rings still each earn a lap; tail effects are not discarded',()=>{
  const {s,reaction}=reactionLoop();s.queue=[structuredClone(reaction),structuredClone(reaction),{kind:'gain',racerId:'r0',amount:3}];resolveTasks(s);
  assert.deepEqual(s.players.map(p=>p.score),[5,2]);assert.equal(s.logs.filter(e=>e.type==='loop').length,2);assert.equal(s.queue.length,0);
});
test('finite work yields, another room can resolve, and persisted loop checkpoints resume normally',()=>{
  let {s,reaction}=reactionLoop();s.queue=[...Array.from({length:3001},()=>({kind:'gain',racerId:'r0',amount:1})),reaction];resolveTasks(s);
  assert.equal(s.flags.continuation,true);assert.equal(s.players[0]!.score,3000);assert.equal(s.phase,'race');
  const other=fixture('magikarp',0);other.queue=[{kind:'gain',racerId:'r0',amount:1}];resolveTasks(other);assert.equal(other.players[0]!.score,1);
  s=JSON.parse(JSON.stringify(s));applyGameAction(s,'p0',{type:'next'});
  assert.deepEqual(s.players.map(p=>p.score),[3002,1]);assert.equal(s.queue.length,0);assert.equal(s.phase,'race');
});
test('Huge Baby arrow with declined Suckerfish retains true-cycle checkpoints, accepted follow remains a choice',()=>{
  for(const response of ['skip','use']){
    const s=fixture('magikarp',1);s.track='wild';s.racers[0]!.position=11;s.racers[1]!.characterId='huge-baby';s.racers[1]!.position=12;s.racers[2]!.characterId='suckerfish';s.racers[2]!.position=11;
    s.queue=[{kind:'move',racerId:'r0',distance:1,cause:'track-arrow'}];resolveTasks(s);assert.equal(s.pending?.kind,'suckerfish');
    const first=s.pending!;applyGameAction(s,first.playerId,{type:'choose',choiceId:first.id,optionId:response});
    if(response==='use')assert(s.logs.some(e=>e.type==='move'&&e.targets?.includes('r2')),'accepted follow really moves the fish');
    let choices=0;while(s.pending){assert(++choices<10);const c=s.pending;applyGameAction(s,c.playerId,{type:'choose',choiceId:c.id,optionId:'skip'});}
    assert.equal(s.phase,'race');assert.equal(s.queue.length,0);assert(s.logs.some(e=>e.type==='loop'));assert.equal(s.players[0]!.score,0);
  }
});
