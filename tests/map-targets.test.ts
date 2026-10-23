import assert from 'node:assert/strict';
import test from 'node:test';
import { applyGameAction, createGame, enqueueMove, resolveTasks } from '../src/engine/index.js';
import type { GameState } from '../src/shared/types.js';

function fixture(track:GameState['track'],characterId:string,positions:number[]):GameState {
  const s=createGame(positions.map((_,i)=>({id:`p${i}`,name:`玩家${i}`,seat:i,color:'#000',ready:true,connected:true,score:0,hand:[],used:[],selection:[]})),456);
  s.phase='race';s.track=track;s.round=1;s.currentRacerId='r0';
  s.racers=[characterId,'alchemist','rocket-scientist'].map((id,i)=>({id:`r${i}`,identityPlayerId:`p${i}`,playerId:`p${i}`,characterId:id,position:positions[i]!,finished:false,eliminated:false,tripped:false,flags:{}}));
  s.baseTurnOrder=s.racers.map(r=>r.id);s.scoreLedger=s.players.map(p=>({playerId:p.id,placement:0,map:0,skill:0,event:0,total:0}));return s;
}
function choose(s:GameState,id:string){assert(s.pending);applyGameAction(s,s.pending.playerId,{type:'choose',choiceId:s.pending.id,optionId:id});}
function begin(s:GameState){s.queue.push({kind:'beginTurn',racerId:'r0'});resolveTasks(s);}
function roll(s:GameState,face:number){s.flags.testDice=[face];applyGameAction(s,'p0',{type:'roll'});}
function mark(s:GameState,position:number){s.queue.push({kind:'beforeRace',racerId:'r0'});resolveTasks(s);choose(s,String(position));}
function move(s:GameState,index:number,distance:number){enqueueMove(s,`r${index}`,distance);resolveTasks(s);}

test('Bridges Toll Troll collects a marked-space point for an arrival on either layer',()=>{
  for(const [marked,arrival] of [[3,8],[8,3]]){
    const s=fixture('bridges','extra-mile-toll-troll',[1,arrival!-1,25]);mark(s,marked!);move(s,1,1);
    assert.equal(s.players[0]!.score,1);assert.equal(s.scoreLedger![0]!.skill,1);assert.equal(s.scoreLedger![0]!.total,1);
  }
});

test('Bridges Honey Pot offers the opposite-layer recipient a real die and accounts for its payment',()=>{
  const s=fixture('bridges','extra-mile-honey-pot',[1,7,25]);mark(s,3);move(s,1,1);
  assert.equal(s.pending?.kind,'em-honey-roll');assert.equal(s.pending?.playerId,'p1');s.flags.testDice=[6];choose(s,'roll');
  assert.equal(s.players[1]!.score,1);assert.equal(s.scoreLedger![1]!.skill,1);assert.equal(s.flags.honeyPot,0);assert.equal(s.racers[0]!.position,2);
});

test('Boardwalk Lazy Bones may choose either tied leading lane and still receives exactly one extra turn',()=>{
  let s=fixture('boardwalks','extra-mile-lazy-bones',[0,14,40]);begin(s);roll(s,6);
  assert.equal(s.pending?.kind,'em-lazy-lead');assert.deepEqual(s.pending!.options.map(option=>option.id),['r1','r2']);
  s=JSON.parse(JSON.stringify(s));choose(s,'r2');assert.equal(s.racers[0]!.position,40);
  assert.equal(s.currentRacerId,'r0');assert.equal(s.flags.needsBegin,true);assert.equal(s.randomLog.length,1);
});

test('Boardwalk Tail may target either nearest tied lane and warps one connected step behind it',()=>{
  let s=fixture('boardwalks','tail',[7,14,40]);begin(s);
  assert.equal(s.pending?.kind,'tail');assert.deepEqual(s.pending!.options.map(option=>option.id),['r1','r2','skip']);
  s=JSON.parse(JSON.stringify(s));choose(s,'r2');assert.equal(s.racers[0]!.position,39);assert.equal(s.flags.awaitRoll,true);assert.equal(s.randomLog.length,0);
});

test('Boardwalk Pitfall Harry can choose the nearest opponent on another lane instead of a main die',()=>{
  let s=fixture('boardwalks','wurstii-pitfall-harry',[7,14,40]);begin(s);
  assert.equal(s.pending?.kind,'wurstii-pitfall-harry');assert.deepEqual(s.pending!.options.map(option=>option.id),['r1','r2','skip']);
  s=JSON.parse(JSON.stringify(s));choose(s,'r2');assert.equal(s.racers[0]!.position,40);assert.equal(s.randomLog.length,0);assert.equal(s.flags.awaitRoll,false);
  const skip=fixture('boardwalks','wurstii-pitfall-harry',[7,14,40]);begin(skip);choose(skip,'skip');assert.equal(skip.flags.awaitRoll,true);
});

test('Boardwalk Lizzie chooses a nearest tied lane after its die without rerolling',()=>{
  let s=fixture('boardwalks','wurstii-lizzie',[7,14,40]);begin(s);roll(s,2);
  assert.equal(s.pending?.kind,'wurstii-lizzie');assert.deepEqual(s.pending!.options.map(option=>option.id),['r1','r2']);
  s=JSON.parse(JSON.stringify(s));choose(s,'r2');assert.equal(s.racers[0]!.position,40);assert.equal(s.randomLog.length,1);
});
