import assert from 'node:assert/strict';
import test from 'node:test';
import * as current from '../src/engine/index.js';
import * as fanV3 from '../src/engine/fan-v3.js';
import * as scheduleV1 from '../src/engine/schedule-v1.js';
import type { GameState } from '../src/shared/types.js';

function fixture(track:GameState['track'],ids:string[],positions:number[]):GameState {
  const s=current.createGame(ids.map((_,i)=>({id:`p${i}`,name:`玩家${i}`,seat:i,color:'#000',ready:true,connected:true,score:0,hand:[],used:[],selection:[]})),456);
  s.config={version:'room-config-v1',characterPacks:{original:true,'second-wind':true,'extra-mile':true,'leaf-fan':true},optionalRules:[]};
  s.phase='race';s.track=track;s.round=1;s.currentRacerId='r0';
  s.racers=ids.map((characterId,i)=>({id:`r${i}`,identityPlayerId:`p${i}`,playerId:`p${i}`,characterId,position:positions[i]!,finished:false,eliminated:false,tripped:false,flags:{}}));
  s.baseTurnOrder=s.racers.map(r=>r.id);
  s.scoreLedger=s.players.map(p=>({playerId:p.id,placement:0,map:0,skill:0,event:0,total:0}));
  return s;
}
function begin(s:GameState,engine:Pick<typeof current,'resolveTasks'>=current){s.queue.push({kind:'beginTurn',racerId:'r0'});engine.resolveTasks(s);}
function roll(s:GameState,face:number){s.flags.testDice=[face];current.applyGameAction(s,'p0',{type:'roll'});}
function choose(s:GameState,id:string){assert(s.pending);current.applyGameAction(s,s.pending.playerId,{type:'choose',choiceId:s.pending.id,optionId:id});}
function move(s:GameState,index:number,distance:number){current.enqueueMove(s,`r${index}`,distance);current.resolveTasks(s);}

test('Boardwalk Dark Horse doubles from the actual last lane, not the largest node ID',()=>{
  const s=fixture('boardwalks',['leaf-dark-horse','alchemist','rocket-scientist'],[31,12,14]);
  begin(s);roll(s,3);assert.equal(s.racers[0]!.position,13);
  const tied=fixture('boardwalks',['leaf-dark-horse','alchemist','rocket-scientist'],[31,7,14]);
  begin(tied);roll(tied,3);assert.equal(tied.racers[0]!.position,34,'equal progress on another lane is tied last');
});

test('Boardwalk Revolutionary warps to the real leader node and offers tied lanes after restore',()=>{
  const single=fixture('boardwalks',['leaf-revolutionary','alchemist','rocket-scientist'],[31,12,40]);
  begin(single);assert.equal(single.racers[0]!.position,40);assert.equal(single.pending,undefined);
  let tied=fixture('boardwalks',['leaf-revolutionary','alchemist','rocket-scientist'],[31,14,40]);
  begin(tied);assert.equal(tied.pending?.kind,'leaf-revolutionary');
  assert.deepEqual(tied.pending!.options.map(option=>option.id),['r1','r2']);
  tied=JSON.parse(JSON.stringify(tied));choose(tied,'r2');
  assert.equal(tied.racers[0]!.position,40);assert.equal(tied.pending,undefined);assert.equal(tied.flags.awaitRoll,true);
});

test('Bridges Lonely Wolf receives the shared-space bonus across bridge layers',()=>{
  const s=fixture('bridges',['leaf-lonely-wolf','alchemist','rocket-scientist'],[3,8,25]);
  begin(s);roll(s,1);assert.equal(s.racers[0]!.position,6);
});

test('Bridges Crash Dummy trips both racers when its main move stops above an occupied lower layer',()=>{
  const s=fixture('bridges',['leaf-crash-dummy','alchemist','rocket-scientist'],[0,8,25]);
  begin(s);roll(s,1);assert.equal(s.racers[0]!.position,3);
  assert.equal(s.racers[0]!.tripped,true);assert.equal(s.racers[1]!.tripped,true);
});

test('Bridges Loan Shark collects the lower-layer token once and records the actual score',()=>{
  const s=fixture('bridges',['leaf-loan-shark','alchemist','rocket-scientist'],[3,7,25]);
  s.queue.push({kind:'beforeRace',racerId:'r0'});current.resolveTasks(s);
  move(s,1,1);assert.equal(s.players[0]!.score,1);assert.equal(s.scoreLedger![0]!.skill,1);
  assert.deepEqual(s.racers[1]!.flags.leafLoanTokens,{});
  move(s,1,-1);move(s,1,1);assert.equal(s.players[0]!.score,1);
});

test('Boardwalk Kangaroo reacts to a stop on the next branch node and retains its route choice',()=>{
  const s=fixture('boardwalks',['leaf-kangaroo','alchemist','rocket-scientist'],[8,14,25]);
  current.enqueueWarp(s,'r1',31);current.resolveTasks(s);
  assert.equal(s.pending?.kind,'track-branch');assert.equal(s.pending?.playerId,'p0');
  choose(s,'9');assert.equal(s.racers[0]!.position,10);
});

test('Boardwalk Catfish reacts when a forward pass exits the detour to a lower node ID',()=>{
  const s=fixture('boardwalks',['alchemist','leaf-catfish','rocket-scientist'],[35,36,20]);
  move(s,0,2);assert.equal(s.racers[0]!.position,13);assert.equal(s.racers[1]!.position,13);
});

test('Boardwalk Catfish does not react when a detour crosses its lane from an already leading space',()=>{
  const s=fixture('boardwalks',['alchemist','leaf-catfish','rocket-scientist'],[8,31,20]);
  move(s,0,3);choose(s,'31');assert.equal(s.racers[0]!.position,33);
  assert.equal(s.racers[1]!.position,31);
  assert(!s.logs.some(event=>event.type==='move'&&event.cause==='leaf-catfish'));
});

test('Boardwalk Sore Loser uses distance to finish and the race result ledger includes its award',()=>{
  const s=fixture('boardwalks',['leaf-sore-loser','alchemist','genius','leaf-toucan'],[31,10,29,28]);
  move(s,2,1);move(s,3,2);assert.equal(s.phase,'results');assert.equal(s.players[0]!.score,3);
  assert.deepEqual(s.results[0]!.scores?.find(entry=>entry.playerId==='p0'),{playerId:'p0',placement:0,map:0,skill:3,event:0,total:3});
});

for(const [version,engine] of [['current',current],['fan-v3',fanV3],['schedule-v1',scheduleV1]] as const){
  test(`${version} retains automatic Revolutionary movement to tied leaders on the same classic space`,()=>{
    const s=fixture('mild',['leaf-revolutionary','alchemist','rocket-scientist'],[2,20,20]);
    begin(s,engine);assert.equal(s.racers[0]!.position,20);assert.equal(s.pending,undefined);assert.equal(s.flags.awaitRoll,true);
  });
}
