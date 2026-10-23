import assert from 'node:assert/strict';
import test from 'node:test';
import { installTwists, TWIST_CARDS, type TwistCardId, type TwistContext, type TwistState } from '../src/engine/twist-cards.js';
import type { GameState, Racer, Task } from '../src/shared/types.js';

function fixture(ids=['coach','legs','blimp'],positions=[2,8,16]){
  const s:GameState={phase:'race',round:1,players:ids.map((_,i)=>({id:`p${i}`,name:`P${i}`,seat:i,color:'#000',ready:true,connected:true,score:0,hand:[],used:[],selection:[]})),deck:['banana','alchemist','hare'],discard:[],racers:ids.map((id,i)=>({id:`r${i}`,playerId:`p${i}`,characterId:id,position:positions[i]!,finished:false,eliminated:false,tripped:false,flags:{}})),baseTurnOrder:ids.map((_,i)=>`r${i}`),turn:0,turnCount:1,currentRacerId:'r0',queue:[],logs:[],results:[],rngState:1,randomLog:[],track:'twisty-twirl' as GameState['track'],flags:{}};
  s.scoreLedger=s.players.map(p=>({playerId:p.id,placement:0,map:0,skill:0,event:0,total:0}));
  const dice=[2,3,4,5,6,1],live=(r:Racer)=>!r.finished&&!r.eliminated;
  const ctx:TwistContext={
    name:r=>r.characterId,live,racer:(s,id)=>s.racers.find(r=>r.id===id),active:s=>s.racers.filter(live),owner:(s,r)=>s.players.find(p=>p.id===r.playerId)!,order:(s,rs)=>[...(rs??s.racers.filter(live))],hasPower:(_s,r,p)=>r.characterId===p||((r.flags.acquiredPowers??[]) as string[]).includes(p),effectivePowers:(_s,r)=>[r.characterId,...((r.flags.acquiredPowers??[]) as string[])],
    ask:(s,r,kind,title,options,context,optional=false)=>{s.pending={id:`c${s.logs.length}:${s.queue.length}:${r.id}`,racerId:r.id,playerId:r.playerId,kind,title,options,context,optional};},push:(s,...tasks)=>s.queue.unshift(...tasks),log:(s,type,text,detail={})=>s.logs.push({id:s.logs.length+1,type,text,...detail}),
    points:(s,r,delta)=>{s.players.find(p=>p.id===r.playerId)!.score+=delta;const entry=s.scoreLedger!.find(e=>e.playerId===r.playerId)!;entry.map+=delta;entry.total+=delta;},shuffle:(_s,ids)=>[...ids],drawUnchosen:(s,count)=>s.deck.splice(0,count),
    rawDie:(s,_r,reason)=>{const value=dice.shift()??1;s.randomLog.push({index:s.randomLog.length,reason,value});return value;},eliminate:(s,id)=>{s.racers.find(r=>r.id===id)!.eliminated=true;},finish:(s,r)=>{r.finished=true;ctx.log(s,'finish',r.id);},endRace:s=>{s.phase='results';},
    startPosition:s=>s.flags.twistReversed?30:0,finishPosition:s=>s.flags.twistReversed?0:30,firstCorner:s=>s.flags.twistReversed?15:12,secondCorner:s=>s.flags.twistReversed?12:15,progress:(s,p)=>s.flags.twistReversed?30-p:p,positionAt:(s,p)=>s.flags.twistReversed?30-p:p,raceRewards:()=>[3,1],
  };
  const rules=installTwists(ctx);rules.prepareRace(s);
  const run=()=>{let count=0;while(s.queue.length&&!s.pending&&s.phase==='race'){
    assert(++count<100,'twist task chain should finish');const t=s.queue.shift()! as Task&Record<string,any>;
    if(rules.task(s,t))continue;
    if(t.kind==='move'||t.kind==='warp'){
      const plans=t.plans??[{racerId:t.racerId,position:t.position,distance:t.distance}];
      for(const plan of plans){const r=s.racers.find(r=>r.id===plan.racerId);if(!r||!live(r))continue;r.position=t.kind==='warp'?plan.position:ctx.positionAt(s,Math.min(30,Math.max(0,ctx.progress(s,r.position)+plan.distance)));}
    }
    if(t.kind==='eliminate')ctx.eliminate(s,t.racerId,t.source);
  }};
  const card=(id:TwistCardId,trigger='r0')=>{rules.applyCard(s,id,trigger);run();};
  const choose=(id:string)=>{const c=s.pending;assert(c);s.pending=undefined;assert(rules.choice(s,s.racers.find(r=>r.id===c.racerId)!,c,id));run();};
  return{s,ctx,rules,run,card,choose,data:()=>s.flags.twist as TwistState,dice};
}

test('Twist deck contains thirteen unique cards with source page metadata',()=>{assert.equal(TWIST_CARDS.length,13);assert.equal(new Set(TWIST_CARDS.map(c=>c.id)).size,13);assert(TWIST_CARDS.every(c=>c.page===28||c.page===29));});

test('Twist crossing is a one-time 13/14 edge trigger including overshoot',()=>{
  const {s,rules,data}=fixture();assert.deepEqual(rules.crossingTasks(s,[{racerId:'r0',from:12,to:13}]),[]);
  const tasks=rules.crossingTasks(s,[{racerId:'r1',from:12,to:18},{racerId:'r0',from:13,to:14}]);assert.equal(tasks.length,1);assert.equal(tasks[0]!.triggerId,'r0');assert(data().triggered);
  assert.deepEqual(rules.crossingTasks(s,[{racerId:'r2',from:12,to:18}]),[]);
  const restored=JSON.parse(JSON.stringify(s)) as GameState;assert.deepEqual(rules.crossingTasks(restored,[{racerId:'r2',from:14,to:13}]),[]);
});

test('Alchemy Lab binds existing Bite Mark and adds an end-turn move',()=>{
  const {s,rules,card,run,data}=fixture(['bite-mark','coach','legs']);card('alchemy-lab');assert.equal(s.racers[0]!.position,0);assert.equal(s.racers[0]!.flags.form,'were-mouth');assert.equal(data().monster!.racerId,'r0');
  s.queue.push(...rules.endTurnTasks(s,s.racers[1]!));run();assert.equal(s.racers[0]!.position,2);assert.equal(s.randomLog.length,1);
});

test('Alchemy Lab neutral monster eliminates passed racers without inventing player points',()=>{
  const {s,rules,card,run,data,dice}=fixture(['coach','legs','blimp'],[1,3,15]);dice.splice(0,dice.length,4);card('alchemy-lab');s.queue.push(...rules.endTurnTasks(s,s.racers[2]!));run();
  assert(s.racers[0]!.eliminated);assert(s.racers[1]!.eliminated);assert(!s.racers[2]!.eliminated);assert.equal(data().monster!.position,4);assert(s.players.every(p=>p.score===0));assert.equal(s.racers.length,3);
});

test('Neutral monster uses the ending player’s fixed die after Randomness Ceased',()=>{
  const {s,rules,card,run,data}=fixture();card('alchemy-lab');data().fixedFaces={p0:5,p1:4,p2:3};s.queue.push(...rules.endTurnTasks(s,s.racers[1]!));run();assert.equal(data().monster!.position,4);assert.equal(s.randomLog.length,0);
});

test('Bonkbug only triggers on stopping in the last two spaces and follows reversed finish',()=>{
  const {s,rules,card}=fixture();card('bonkbug');for(const position of [28,29]){s.racers[0]!.position=position;assert.equal(rules.boardTasks(s,s.racers[0]!)[0]!.distance,-5);}
  s.racers[0]!.position=27;assert.deepEqual(rules.boardTasks(s,s.racers[0]!),[]);s.flags.twistReversed=true;s.racers[0]!.position=1;assert.equal(rules.boardTasks(s,s.racers[0]!)[0]!.distance,-5);
});

test('Conveyor warps all live racers together and only changes main distance',()=>{
  const {s,rules,card}=fixture();s.racers[2]!.eliminated=true;card('conveyor');assert.deepEqual(s.racers.map(r=>r.position),[1,1,16]);assert.equal(rules.mainDistance(s,s.racers[0]!,2),5);
});

test('Curse Wands counts finished and eliminated seats, including their own skip rolls',()=>{
  const {s,rules,card,run,dice}=fixture(['coach','legs','blimp','banana'],[0,1,2,3]);dice.splice(0,dice.length,1,1);card('curse-wands');s.racers[2]!.finished=true;
  assert(rules.nextTurn(s,s.racers[0]!));run();assert.equal(s.currentRacerId,'r0');assert.equal(s.randomLog.length,2);assert.equal(s.flags.needsBegin,true);
});

test('Curse fixed dice skip a repeated inactive-seat loop without manufacturing a result',()=>{
  const {s,rules,card,run,data}=fixture(['coach','legs','blimp','banana'],[0,1,2,3]);card('curse-wands');data().fixedFaces={p0:1,p1:1,p2:1,p3:1};s.racers[0]!.finished=true;s.racers[2]!.finished=true;
  rules.nextTurn(s,s.racers[0]!);run();assert.equal(s.phase,'race');assert.equal(s.randomLog.length,0);assert.equal(s.results.length,0);assert.equal(s.flags.ruleHold,undefined);assert.equal(s.flags.needsBegin,true);assert(!s.racers.find(r=>r.id===s.currentRacerId)!.finished);assert(s.players.every(p=>p.score===0));
});

test('Fans draws two cards in order and never redraws itself',()=>{
  const {s,rules,run,data}=fixture();data().deck=['fans','conveyor','mirror-world'];assert(rules.trigger(s,'r0'));run();assert.deepEqual(data().drawn,['fans','conveyor','mirror-world']);assert.equal(data().deck.length,0);assert(s.flags.twistReversed);assert(s.racers.every(r=>r.position===1));
});

test('Mirror leaves physical positions untouched and finishes racers at the old start in order',()=>{
  const {s,card}=fixture(['coach','legs','blimp'],[0,0,7]);card('mirror-world');assert.deepEqual(s.racers.map(r=>r.position),[0,0,7]);assert.deepEqual(s.logs.filter(l=>l.type==='finish').map(l=>l.text),['r0','r1']);assert(s.flags.twistReversed);
});

test('Scrying Pool uses complete main distance and six is the boundary',()=>{
  const {s,rules,card}=fixture();card('scrying-pool');assert.equal(rules.blocksMain(s,s.racers[0]!,5),false);assert.equal(rules.blocksMain(s,s.racers[0]!,6),true);assert(s.racers[0]!.eliminated);
  assert.equal(rules.blocksMain(s,s.racers[1]!,-6),true);assert(s.racers[1]!.eliminated);
});

test('Pinata places chips once after first corner and scores each exactly once',()=>{
  const {s,rules,card,data}=fixture(['coach','legs','blimp'],[2,13,16]);card('pinata');assert(!data().chips!.includes(12));assert(!data().chips!.includes(13));assert(!data().chips!.includes(16));assert(!data().chips!.includes(30));assert(data().chips!.includes(29));
  s.racers[0]!.position=14;rules.boardTasks(s,s.racers[0]!);rules.boardTasks(s,s.racers[0]!);assert.equal(s.players[0]!.score,1);assert.equal(s.scoreLedger![0]!.map,1);assert.equal(s.scoreLedger![0]!.total,1);
});

test('Randomness Ceased binds to players and persists through serialization',()=>{
  const {s,rules,card}=fixture();card('randomness-ceased');assert.equal(s.randomLog.length,3);assert.equal(rules.fixedDie(s,s.racers[0]!),2);
  const copy={...s.racers[0]!,id:'r0-extra'};assert.equal(rules.fixedDie(s,copy),2);const restored=JSON.parse(JSON.stringify(s)) as GameState;assert.equal(rules.fixedDie(restored,restored.racers[2]!),4);assert.equal(s.randomLog.length,3);
});

test('Roast Chicken snapshots every tied last racer before executing the moves',()=>{
  const {s,rules}=fixture(['coach','legs','blimp'],[2,2,10]);rules.applyCard(s,'roast-chicken','r2');assert.deepEqual(s.queue.map(t=>({id:t.racerId,d:t.distance})),[{id:'r0',d:7},{id:'r1',d:7}]);
});

test('Season Finale withholds qualifying points then starts exactly one duel at second corner',()=>{
  const {s,rules,card,data}=fixture();card('season-finale');assert(rules.beforeFinish(s,s.racers[0]!));assert(s.racers[0]!.finished);assert.equal(s.players[0]!.score,0);assert.equal(data().finale!.stage,'qualifying');
  s.queue.push({kind:'move',racerId:'r2',distance:3});assert(rules.beforeFinish(s,s.racers[1]!));assert.equal(data().finale!.stage,'duel');assert.deepEqual(s.racers.slice(0,2).map(r=>r.position),[15,15]);assert.equal(s.currentRacerId,'r0');assert.equal(s.queue.length,0);assert(s.racers[2]!.eliminated);assert(s.flags.twistFinaleStarted);
  assert.equal(rules.beforeFinish(s,s.racers[1]!),false);assert.equal(rules.placementPoints(s,s.racers[1]!,1,3),4);assert.equal(rules.placementPoints(s,s.racers[0]!,2,1),0);
});

test('Swap Meet keeps every choice private until all players commit',()=>{
  const {s,rules,card,choose,data}=fixture();card('swap-meet');assert.equal(s.pending?.playerId,'p0');choose('swap:r0');assert.equal(s.racers[0]!.characterId,'coach');assert.equal(s.pending?.playerId,'p1');
  const publicData=rules.publicState(s)!;assert(!('deck' in publicData));assert(!('swap' in publicData));assert(!s.logs.some(e=>e.type==='twist-swap'));
  choose('keep');assert.equal(s.pending?.playerId,'p2');choose('swap:r2');assert.equal(s.racers[0]!.characterId,'banana');assert.equal(s.racers[1]!.characterId,'legs');assert.equal(s.racers[2]!.characterId,'hare');assert.equal(data().swap,undefined);assert.deepEqual(s.discard,['coach','alchemist','blimp']);
});

test('Swap Meet permits choosing one of a player’s two racers without adding extra offers',()=>{
  const {s,card,choose,data}=fixture();s.racers[1]!.playerId='p0';card('swap-meet');assert.equal(data().swap!.length,2);assert(s.pending!.options.some(o=>o.id==='swap:r1'));choose('swap:r1');choose('keep');assert.equal(s.racers[1]!.characterId,'banana');assert.equal(s.racers[0]!.characterId,'coach');
});

test('Swap Meet preserves pending private decisions across restart',()=>{
  const {s,rules,card,choose}=fixture();card('swap-meet');choose('swap:r0');const restored=JSON.parse(JSON.stringify(s)) as GameState;const c=restored.pending!;restored.pending=undefined;assert(rules.choice(restored,restored.racers[1]!,c,'keep'));assert.equal(restored.racers[0]!.characterId,'coach');assert.equal((restored.flags.twist as TwistState).swap![0]!.racerId,'r0');
});

test('Swap Meet returns introduced physical cards at race end without clearing used team cards',()=>{
  const {s,rules,card,choose}=fixture();s.players[0]!.used=['coach'];card('swap-meet');choose('swap:r0');choose('keep');choose('keep');assert.equal(s.racers[0]!.flags.twistBorrowedCardId,'banana');assert(!s.discard.includes('banana'));
  rules.raceEnd(s);rules.raceEnd(s);assert.equal(s.discard.filter(id=>id==='banana').length,1);assert.deepEqual(s.players[0]!.used,['coach']);
});

test('Swap and Time Imp reserve one physical card until its extra-racer appearance ends',()=>{
  const {s,rules,card,choose}=fixture();card('swap-meet');choose('swap:r0');choose('keep');choose('keep');card('time-imp');rules.raceEnd(s);assert(!s.discard.includes('banana'));
  s.round=2;s.racers=s.racers.slice(1);rules.prepareRace(s);const extra=s.racers.find(r=>r.flags.timeImpExtra)!;assert.equal(extra.flags.twistBorrowedCardId,'banana');rules.raceEnd(s);assert.equal(s.discard.filter(id=>id==='banana').length,1);
});

test('Swap Meet never silently offers cards only to the first players when the pool is short',()=>{
  const {s,card,data}=fixture();s.deck=['banana'];card('swap-meet');assert.equal(s.phase,'paused');assert(s.flags.ruleHold);assert.equal(data().swap!.length,3);assert.equal(data().swap![0]!.cardId,'banana');assert.equal(s.pending,undefined);assert.deepEqual(s.racers.map(r=>r.characterId),['coach','legs','blimp']);
});

test('Time Imp adds a one-race extra and preserves Mush’s acquired powers',()=>{
  const {s,rules,card}=fixture(['mush','legs','blimp']);s.racers[0]!.flags.acquiredPowers=['penguin','coach'];card('time-imp');assert(s.racers[0]!.eliminated);
  s.round=2;s.racers=s.racers.slice(1);rules.prepareRace(s);const extra=s.racers.find(r=>r.flags.timeImpExtra)!;assert(extra);assert.equal(extra.playerId,'p0');assert.deepEqual(extra.flags.acquiredPowers,['penguin','coach']);
  s.round=3;s.racers=s.racers.filter(r=>!r.flags.timeImpExtra);rules.prepareRace(s);assert(!s.racers.some(r=>r.flags.timeImpExtra));assert.deepEqual(s.flags.twistNextRaceExtras,[]);
});

test('Time Imp in the last scheduled race eliminates without reserving a nonexistent next race',()=>{
  const {s,card}=fixture();s.round=4;card('time-imp');assert(s.racers[0]!.eliminated);assert.deepEqual(s.flags.twistNextRaceExtras,[]);
});

test('Twist next-race reset removes temporary board effects and fixed dice',()=>{
  const {s,rules,card,data}=fixture();card('conveyor');card('randomness-ceased');s.flags.twistReversed=true;s.round=2;rules.prepareRace(s);assert(!s.flags.twistReversed);assert(!data().conveyor);assert(!data().fixedFaces);assert.equal(data().drawn.length,0);assert.equal(data().deck.length,13);
});
