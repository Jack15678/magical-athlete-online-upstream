import assert from 'node:assert/strict';
import test from 'node:test';
import { applyGameAction, createGame, effectivePowers, enqueueMove, enqueueWarp, resolveTasks } from '../src/engine/index.js';
import { enabledCharacterIds, legacyRoomConfig } from '../src/shared/room-config.js';
import { createMatchPlan, presetCompetition } from '../src/shared/competition.js';
import { progress } from '../src/shared/race-track.js';
import { roomRules } from '../src/engine/runtime.js';
import { SCHEDULE_RULES_VERSION } from '../src/shared/rules-versions.js';
import type { GameState } from '../src/shared/types.js';
import { TRACKS, type TrackId } from '../src/shared/tracks.js';

function fixture(track:TrackId,ids=['banana','rocket-scientist','legs'],positions=[0,15,25]):GameState {
  const s=createGame(ids.map((_,i)=>({id:`p${i}`,name:`玩家${i}`,seat:i,color:'#000',ready:true,connected:true,score:0,hand:[],used:[],selection:[]})),137);
  s.phase='race';s.track=track;s.round=1;s.currentRacerId='r0';
  s.racers=ids.map((characterId,i)=>({id:`r${i}`,playerId:`p${i}`,identityPlayerId:`p${i}`,characterId,position:positions[i]!,tripped:false,finished:false,eliminated:false,flags:{}}));
  s.baseTurnOrder=s.racers.map(r=>r.id);s.scoreLedger=s.players.map(p=>({playerId:p.id,placement:0,map:0,skill:0,event:0,total:0}));
  return s;
}
function move(s:GameState,distance:number,index=0){enqueueMove(s,`r${index}`,distance);resolveTasks(s);}
function choose(s:GameState,id:string){assert(s.pending);applyGameAction(s,s.pending.playerId,{type:'choose',choiceId:s.pending.id,optionId:id});}
function begin(s:GameState){s.queue.push({kind:'beginTurn',racerId:'r0'});resolveTasks(s);}

test('Whirly draft implements every confirmed pair in both directions without bouncing back',()=>{
  for(const [a,b] of [[3,5],[7,12],[10,15],[20,23]])for(const [from,to] of [[a!,b!],[b!,a!]]){
    const s=fixture('whirly-world',['legs','coach','banana'],[from-1,20,25]);
    move(s,1);assert.equal(s.racers[0]!.position,to);
    assert.equal(s.logs.filter(e=>e.cause==='track-whirl').length,1);
    assert.notEqual(s.phase,'paused');
  }
});

test('Whirly pass-through does not trigger, but a later independent landing does',()=>{
  const s=fixture('whirly-world',['legs','coach','banana'],[2,20,25]);
  move(s,4);assert.equal(s.racers[0]!.position,6);assert(!s.logs.some(e=>e.cause==='track-whirl'));
  move(s,-1);assert.equal(s.racers[0]!.position,3);
  move(s,2);assert.equal(s.racers[0]!.position,3);
  assert.equal(s.logs.filter(e=>e.cause==='track-whirl').length,2);
});

test('Whirly accepts ability warps, preserves tripping, and does not count as passing a Banana',()=>{
  const s=fixture('whirly-world',['legs','banana','coach'],[1,4,25]);
  enqueueWarp(s,'r0',3);resolveTasks(s);assert.equal(s.racers[0]!.position,5);assert(!s.racers[0]!.tripped);
  s.racers[0]!.tripped=true;enqueueWarp(s,'r0',7);resolveTasks(s);
  assert.equal(s.racers[0]!.position,12);assert(s.racers[0]!.tripped);
});

test('Whirly destination abilities still resolve once',()=>{
  const s=fixture('whirly-world',['legs','hotel','coach'],[2,5,25]);s.players[0]!.score=2;
  move(s,1);assert.equal(s.racers[0]!.position,5);
  assert.equal(s.players[0]!.score,1);assert.equal(s.players[1]!.score,1);
});

test('Whirly pending warp retains its pair guard across JSON restoration',()=>{
  const s=fixture('whirly-world',['legs','coach','banana'],[3,20,25]);
  s.queue.push({kind:'warp',racerId:'r0',position:5,cause:'track-whirl',whirlPair:'3:5'});
  const restored=JSON.parse(JSON.stringify(s)) as GameState;resolveTasks(restored);
  assert.equal(restored.racers[0]!.position,5);assert.equal(restored.logs.filter(e=>e.cause==='track-whirl').length,1);
});

test('Whirly draft does not invent hidden pairs or open an unfinished competition',()=>{
  assert.deepEqual(Object.keys(TRACKS['whirly-world'].specials).map(Number),[3,5,7,10,12,15,20,23]);
  assert.equal(TRACKS['whirly-world'].verified,false);
  assert.throws(()=>createMatchPlan({competition:{...presetCompetition(),preset:'custom',rotation:['whirly-world']}}),/尚未开放地图/);
});

test('Boardwalk branch is a real route, survives JSON restore, and cannot be chosen twice',()=>{
  let s=fixture('boardwalks');s.racers[0]!.position=8;move(s,3);assert.equal(s.pending?.kind,'track-branch');
  assert.deepEqual(s.pending!.options.map(o=>o.id),['9','31']);const action={type:'choose' as const,choiceId:s.pending!.id,optionId:'31'};
  const random=s.randomLog.length;s=JSON.parse(JSON.stringify(s));applyGameAction(s,'p0',action);
  assert.equal(s.racers[0]!.position,33);assert.equal(s.racers[0]!.finished,false);assert.equal(s.randomLog.length,random);
  assert.deepEqual(s.logs.find(e=>e.type==='move')?.paths,[[8,31,32,33]]);
  const before=JSON.stringify(s);assert.throws(()=>applyGameAction(s,'p0',action),/过期/);assert.equal(JSON.stringify(s),before);
});
test('Boardwalk backward fork belongs to the opponent who caused the movement',()=>{
  const s=fixture('boardwalks');s.racers[0]!.position=13;s.queue.push({kind:'move',racerId:'r0',distance:-2,cause:'centaur',controllerId:'p1'});resolveTasks(s);
  assert.equal(s.pending?.playerId,'p1');assert.deepEqual(s.pending!.options.map(o=>o.id),['12','36']);choose(s,'36');assert.equal(s.racers[0]!.position,35);
});
test('Boardwalk main-route finish and a high-ID detour never share finish semantics',()=>{
  const s=fixture('boardwalks');s.racers[0]!.position=58;move(s,1);assert.equal(s.racers[0]!.position,26);assert(!s.racers[0]!.finished);
  move(s,4);assert(s.racers[0]!.finished);assert.equal(s.players[0]!.score,3);
});
test('Boardwalk lead uses the author distance diagram; tied lanes are not a shared space',()=>{
  const s=fixture('boardwalks',['copycat','coach','legs'],[2,35,12]);assert.deepEqual(effectivePowers(s,s.racers[0]!),['legs']);
  assert.equal(progress(s,35),11);assert.equal(progress(s,12),12);
  const tied=fixture('boardwalks',['hare','coach','legs'],[7,31,2]);begin(tied);assert.equal(tied.flags.awaitRoll,true);tied.flags.testDice=[2];applyGameAction(tied,'p0',{type:'roll'});
  assert.equal(tied.lastRoll?.distance,4,'other-lane Coach does not add a shared-space bonus');
});
test('Boardwalk Huge Baby asks before placing an occupant backwards through a merge',()=>{
  const s=fixture('boardwalks',['huge-baby','banana','legs'],[12,13,28]);move(s,1);
  assert.equal(s.pending?.kind,'track-place');const choice=s.pending!.id;const recovered=JSON.parse(JSON.stringify(s)) as GameState;
  applyGameAction(recovered,'p0',{type:'choose',choiceId:choice,optionId:'36'});assert.equal(recovered.racers[1]!.position,36);assert(recovered.racers[0]!.tripped);
  assert.equal(recovered.logs.filter(e=>e.type==='move').length,1,'resuming placement must not replay the main motion');
});
test('Squiggle signed stars clamp at zero and ledger records actual changes',()=>{
  const s=fixture('squiggle');s.players[0]!.score=2;enqueueWarp(s,'r0',23);resolveTasks(s);assert.equal(s.players[0]!.score,0);assert.equal(s.scoreLedger![0]!.map,-2);
  enqueueWarp(s,'r0',29);resolveTasks(s);assert.equal(s.players[0]!.score,2);assert.equal(s.scoreLedger![0]!.map,0);assert.equal(s.scoreLedger![0]!.total,0);
});
test('Bridges upper pass sees the lower Banana even when still numerically behind',()=>{
  const s=fixture('bridges',['legs','banana','coach'],[2,8,25]);move(s,2);assert.equal(s.racers[0]!.position,4);assert(s.racers[0]!.tripped);
  const under=fixture('bridges',['legs','banana','coach'],[7,3,25]);move(under,2);assert.equal(under.racers[0]!.position,9);assert(!under.racers[0]!.tripped);
});
test('Bridges Centaur upper pass pushes a numerically farther lower racer backwards',()=>{
  const s=fixture('bridges',['centaur','legs','coach'],[2,8,25]);move(s,2);assert.equal(s.racers[1]!.position,6);
});
test('Bridges Leaptoad skips a bridge cell occupied on its other layer',()=>{
  const s=fixture('bridges',['leaptoad','legs','coach'],[2,8,25]);move(s,1);assert.equal(s.racers[0]!.position,4);
});
test('Bridges Suckerfish cannot follow a racer on the opposite layer',()=>{
  const s=fixture('bridges',['legs','suckerfish','coach'],[8,3,25]);move(s,1);assert.equal(s.pending,undefined);assert.equal(s.racers[1]!.position,3);
});
test('Bridges Third Wheel may pick either numerical cell of an opposite-layer pair',()=>{
  const s=fixture('bridges',['third-wheel','legs','coach'],[1,3,8]);begin(s);assert.deepEqual(s.pending?.options.map(o=>o.id),['3','8','skip']);choose(s,'8');assert.equal(s.racers[0]!.position,8);
});
test('Bridges Huge Baby displaces both layers along their own numerical route',()=>{
  const s=fixture('bridges',['huge-baby','banana','legs','coach'],[2,8,3,25]);move(s,1);
  assert.equal(s.racers[1]!.position,7);assert.equal(s.racers[2]!.position,2);assert(!s.racers[0]!.tripped,'opposite-layer replacement is not an extra Banana pass');
});
test('Bridges same-space Baba Yaga reaches the opposite layer',()=>{
  const s=fixture('bridges',['baba-yaga','legs','coach'],[2,8,25]);move(s,1);assert(s.racers[1]!.tripped);
});
test('Maps without corner rulings exclude dependent characters from drafting and ability draws',()=>{
  const config=legacyRoomConfig('all');config.characterPacks['leaf-fan']=true;config.competition={...presetCompetition(),preset:'custom',rotation:['boardwalks']};
  const allowed=enabledCharacterIds(config);for(const id of ['blimp','gloth','nepo-baby'])assert(!allowed.includes(id));
  assert(allowed.includes('leaf-nepo-baby'),'same translated name, unrelated ability');
  assert.equal(createMatchPlan(config).races[0]!.map,'boardwalks');
});

test('Boardwalk Whisper selects a nearest empty connected lane and retains its path on restore',()=>{
  let s=fixture('boardwalks',['extra-mile-whisper','legs','coach'],[8,7,25]);
  move(s,1,1);
  assert.equal(s.pending?.kind,'em-whisper');assert.deepEqual(s.pending!.options.map(o=>o.id),['9','31']);
  s=JSON.parse(JSON.stringify(s));choose(s,'31');
  assert.equal(s.racers[0]!.position,31);assert.deepEqual(s.logs.findLast(e=>e.cause==='extra-mile-whisper'&&e.type==='move')?.paths,[[8,31]]);
});

test('Bridges Hotel charges a real opposite-layer arrival once',()=>{
  const s=fixture('bridges',['legs','hotel','coach'],[2,8,25]);s.players[0]!.score=2;
  move(s,1);assert.equal(s.players[0]!.score,1);assert.equal(s.players[1]!.score,1);
  assert.equal(s.scoreLedger![0]!.skill,-1);assert.equal(s.scoreLedger![1]!.skill,1);
});

test('Boardwalk Scout forward warp chooses a route without rolling a second die',()=>{
  const s=fixture('boardwalks',['extra-mile-scout','legs','coach'],[8,20,25]);begin(s);s.flags.testDice=[2];applyGameAction(s,'p0',{type:'roll'});
  assert.equal(s.pending?.kind,'em-scout');choose(s,'forward');assert.equal(s.pending?.kind,'track-branch');choose(s,'31');
  assert.equal(s.racers[0]!.position,33);assert.equal(s.randomLog.length,1);
});
test('Current Penguin recovers after one doubled main move; frozen schedule-v1 keeps its saved rules',()=>{
  for(const old of [false,true]){
    const s=fixture('mild',['penguin','legs','coach'],[2,20,25]);s.racers[0]!.tripped=true;if(old)s.rulesVersion=SCHEDULE_RULES_VERSION;
    s.flags.needsBegin=true;roomRules(s).applyGameAction(s,'p0',{type:'next'});s.flags.testDice=[2];roomRules(s).applyGameAction(s,'p0',{type:'roll'});
    assert.equal(s.racers[0]!.position,6);assert.equal(s.racers[0]!.tripped,old);
  }
});
