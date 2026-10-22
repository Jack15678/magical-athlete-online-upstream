import assert from 'node:assert/strict';
import test from 'node:test';
import { applyGameAction, createGame, enqueueMove, enqueueWarp, publicTrackState, resolveTasks } from '../src/engine/index.js';
import { projectRoom } from '../src/shared/room-core.js';
import type { GameState, Player, Room } from '../src/shared/types.js';
import type { TwistCardId, TwistState } from '../src/engine/twist-cards.js';

function fixture(ids=['banana','legs','blimp'],positions=[12,5,22],cards:TwistCardId[]=['conveyor']){
  const players:Player[]=ids.map((_,i)=>({id:`p${i}`,name:`玩家${i}`,seat:i,color:'#000',ready:true,connected:true,score:0,hand:[],used:[],selection:[]}));
  const s=createGame(players,19,'multiplayer','mixed');s.phase='race';s.round=1;s.track='twisty-twirl';s.currentRacerId='r0';
  s.racers=ids.map((characterId,i)=>({id:`r${i}`,identityPlayerId:`p${i}`,playerId:`p${i}`,characterId,position:positions[i]!,finished:false,eliminated:false,tripped:false,flags:{}}));s.baseTurnOrder=s.racers.map(r=>r.id);
  s.flags.twist={triggered:false,deck:cards,drawn:[]} satisfies TwistState;
  s.scoreLedger=s.players.map(p=>({playerId:p.id,placement:0,map:0,skill:0,event:0,total:0}));return s;
}
const data=(s:GameState)=>s.flags.twist as TwistState;
const move=(s:GameState,id:string,distance:number)=>{enqueueMove(s,id,distance);resolveTasks(s);};
function begin(s:GameState,id='r0'){s.currentRacerId=id;s.flags.needsBegin=false;s.queue.push({kind:'beginTurn',racerId:id});resolveTasks(s);}
function roll(s:GameState,face:number){s.flags.testDice=[face];applyGameAction(s,s.racers.find(r=>r.id===s.currentRacerId)!.playerId,{type:'roll'});}
function choose(s:GameState,id:string){assert(s.pending);applyGameAction(s,s.pending.playerId,{type:'choose',choiceId:s.pending.id,optionId:id});}

test('Real motion resolves a crossed Twist before a long move can finish the race',()=>{
  const s=fixture();move(s,'r0',30);assert.deepEqual(data(s).drawn,['conveyor']);assert.equal(s.phase,'race');assert(s.racers.every(r=>r.position===1));assert(s.racers.every(r=>!r.finished));assert(s.players.every(p=>p.score===0));
});

test('Conveyor simultaneous arrival does not replay the original landing as a later Hotel visit',()=>{
  const s=fixture(['banana','hotel','blimp'],[12,5,22],['conveyor']);s.players[0]!.score=2;move(s,'r0',2);assert(s.racers.every(r=>r.position===1));assert.deepEqual(s.players.map(p=>p.score),[2,0,0]);assert(s.scoreLedger!.every(e=>e.total===0));
});

test('Real mirror changes forward movement but never teleports physical positions',()=>{
  const s=fixture(['banana','legs','blimp'],[12,0,22],['mirror-world']);move(s,'r0',2);assert(s.flags.twistReversed);assert.equal(s.racers[0]!.position,14);assert(s.racers[1]!.finished);assert.equal(s.racers[1]!.rank,1);assert.equal(s.players[1]!.score,3);
  begin(s);roll(s,2);assert.equal(s.racers[0]!.position,12);assert(!s.logs.some(e=>e.type==='warp'&&e.cause==='mirror-world'));
});

test('Real Bonkbug landing works for movement and warp while passing does not trigger',()=>{
  const s=fixture(['banana','legs','blimp'],[25,5,15]);data(s).triggered=true;data(s).bonkbug=true;move(s,'r0',3);assert.equal(s.racers[0]!.position,23);
  enqueueWarp(s,'r0',29);resolveTasks(s);assert.equal(s.racers[0]!.position,24);move(s,'r0',3);assert.equal(s.racers[0]!.position,27);
});

test('Real conveyor adds its bonus before Blunderdog reverses movement',()=>{
  const s=fixture(['blunderdog','legs','blimp'],[15,2,22]);data(s).triggered=true;data(s).conveyor=true;begin(s);roll(s,2);assert.equal(s.lastRoll?.distance,-5);assert.equal(s.racers[0]!.position,10);
});

test('Real Scrying Pool checks modified main distance and preserves skill moves',()=>{
  const s=fixture(['blimp','legs','banana'],[2,10,22]);data(s).triggered=true;data(s).scryingPool=true;begin(s);roll(s,3);assert(s.racers[0]!.eliminated);assert.equal(s.racers[0]!.position,2);
  move(s,'r1',6);assert(!s.racers[1]!.eliminated);assert.equal(s.racers[1]!.position,16);
});

test('Real Pinata points are one-use map income in scoreLedger',()=>{
  const s=fixture();data(s).triggered=true;data(s).chips=[14];move(s,'r0',2);assert.equal(s.players[0]!.score,1);assert.equal(s.scoreLedger![0]!.map,1);assert.equal(s.scoreLedger![0]!.total,1);
  enqueueWarp(s,'r0',14);resolveTasks(s);assert.equal(s.players[0]!.score,1);assert.equal(data(s).chips!.length,0);
});

test('Real Season Finale withholds qualifying rewards and pays both chips only once',()=>{
  const s=fixture(['banana','legs','blimp'],[28,25,10]);data(s).triggered=true;data(s).finale={stage:'qualifying',qualifiers:[],reward:4};move(s,'r0',2);assert(s.racers[0]!.finished);assert.equal(s.players[0]!.score,0);assert.equal(s.results.length,0);
  move(s,'r1',5);assert.equal(s.phase,'race');assert.equal(s.results.length,0);assert.equal(data(s).finale!.stage,'duel');assert.deepEqual(s.racers.slice(0,2).map(r=>r.position),[15,15]);assert.equal(s.currentRacerId,'r0');
  begin(s);move(s,'r0',15);assert.equal(s.phase,'results');assert.deepEqual(s.players.map(p=>p.score),[4,0,0]);assert.deepEqual(s.results[0]!.placements.map(p=>p.points),[4,0]);assert.deepEqual(s.results[0]!.scores!.map(p=>p.total),[4,0,0]);
});

test('Season Finale drawn after an awarded finish pauses with the existing score and pending movement intact',()=>{
  const s=fixture(['banana','legs','blimp'],[12,28,22],['season-finale']);move(s,'r1',2);assert.equal(s.phase,'race');assert.equal(s.players[1]!.score,3);assert(!data(s).triggered);
  const placements=structuredClone(s.flags.placements),ledger=structuredClone(s.scoreLedger);move(s,'r0',2);
  assert.equal(s.phase,'paused');assert.equal((s.flags.ruleHold as {kind:string}).kind,'twist-late-finale');assert.deepEqual(data(s).drawn,['season-finale']);assert.equal(data(s).finale,undefined);assert.deepEqual(s.players.map(p=>p.score),[0,3,0]);assert.deepEqual(s.flags.placements,placements);assert.deepEqual(s.scoreLedger,ledger);assert(s.racers[1]!.finished);assert.equal(s.racers[0]!.position,14);assert.equal(s.results.length,0);assert(s.queue.some(t=>t.kind==='motion-arrival'));
  const restored=JSON.parse(JSON.stringify(s)) as GameState,queue=structuredClone(restored.queue);resolveTasks(restored);assert.equal(restored.phase,'paused');assert.deepEqual(restored.queue,queue);assert.deepEqual(restored.scoreLedger,ledger);assert.deepEqual(data(restored).drawn,['season-finale']);
});

test('Real reverse Season Finale restarts at the reversed second corner',()=>{
  const s=fixture(['banana','legs','blimp'],[2,5,20]);s.flags.twistReversed=true;data(s).triggered=true;data(s).finale={stage:'qualifying',qualifiers:[],reward:4};move(s,'r0',2);move(s,'r1',5);assert.equal(data(s).finale!.stage,'duel');assert.deepEqual(s.racers.slice(0,2).map(r=>r.position),[12,12]);
});

test('Season Finale sole surviving racer receives all placement points without waiting for a second qualifier',()=>{
  const s=fixture(['banana','legs','blimp'],[28,5,20]);data(s).triggered=true;data(s).finale={stage:'qualifying',qualifiers:[],reward:4};s.racers[1]!.eliminated=true;s.racers[2]!.eliminated=true;move(s,'r0',2);assert.equal(s.phase,'results');assert.equal(s.players[0]!.score,4);assert.equal(s.results[0]!.placements.length,1);assert.equal(s.results[0]!.placements[0]!.points,4);assert.equal(s.results[0]!.scores![0]!.total,4);
});

test('Season Finale sole qualifier wins when the last rival is subsequently eliminated',()=>{
  const s=fixture(['banana','legs','blimp'],[28,5,20]);data(s).triggered=true;data(s).finale={stage:'qualifying',qualifiers:[],reward:4};move(s,'r0',2);s.racers[2]!.eliminated=true;s.queue.push({kind:'eliminate',racerId:'r1',source:'test'});resolveTasks(s);assert.equal(s.phase,'results');assert.equal(s.players[0]!.score,4);assert.equal(s.results[0]!.placements.length,1);assert.equal(s.results[0]!.scores![0]!.total,4);
});

test('Real Swap Meet hides committed swaps and unrevealed deck across projections',()=>{
  const s=fixture(['banana','legs','blimp'],[12,5,22],['swap-meet','bonkbug']);s.deck=['coach','alchemist','hare'];move(s,'r0',2);assert.equal(s.pending?.kind,'twist-swap');choose(s,'swap:r0');assert.equal(s.racers[0]!.characterId,'banana');
  const room={code:'ABC234',hostId:'p0',createdAt:1,updatedAt:1,version:1,maxPlayers:3,timeoutSeconds:0,deadline:null,game:s} as Room;
  const viewer=projectRoom(room,'p2',{authorityId:'p0',authorityOnline:true});assert(!JSON.stringify(viewer).includes('swap:r0'));assert(!JSON.stringify(publicTrackState(s)).includes('bonkbug'));
  choose(s,'keep');choose(s,'keep');assert.equal(s.racers[0]!.characterId,'coach');assert.equal(s.racers[0]!.position,14);
});

test('Real Fans chain survives pending Swap Meet and executes second card afterwards',()=>{
  let s=fixture(['banana','legs','blimp'],[12,5,22],['fans','swap-meet','conveyor']);s.deck=['coach','alchemist','hare'];move(s,'r0',2);assert.equal(s.pending?.kind,'twist-swap');assert(!data(s).conveyor);
  s=JSON.parse(JSON.stringify(s)) as GameState;choose(s,'keep');choose(s,'keep');choose(s,'keep');assert(data(s).conveyor);assert.deepEqual(data(s).drawn,['fans','swap-meet','conveyor']);assert(s.racers.every(r=>r.position===1));
});

test('Real fixed-six Party Pooper chain terminates or holds without consuming new dice',()=>{
  const s=fixture(['banana','party-pooper','blimp'],[2,8,22]);data(s).triggered=true;data(s).fixedFaces={p0:6,p1:2,p2:3};begin(s);const randomBefore=s.randomLog.length;applyGameAction(s,'p0',{type:'roll'});assert.equal(s.randomLog.length,randomBefore);assert(s.phase==='paused'||s.phase==='results'||s.flags.needsBegin||s.pending,'fixed-six chain must reach a meaningful state');assert(s.logs.length<1000);
});

test('Doppelgangster replaces the first attempted finish before Season Finale records a qualifier',()=>{
  const s=fixture(['banana','doppelgangster','blimp'],[28,10,20]);data(s).triggered=true;data(s).finale={stage:'qualifying',qualifiers:[],reward:4};move(s,'r0',2);assert(s.racers[0]!.eliminated);assert(!s.racers[0]!.finished);assert.deepEqual(data(s).finale!.qualifiers,[]);assert(s.racers[1]!.flags.doppelUsed);assert(s.players.every(p=>p.score===0));
});

test('A newly acquired Doppelgangster after first qualification cannot eliminate the second qualifier',()=>{
  const s=fixture(['banana','legs','mush'],[28,25,10]);data(s).triggered=true;data(s).finale={stage:'qualifying',qualifiers:[],reward:4};move(s,'r0',2);s.racers[2]!.flags.acquiredPowers=['doppelgangster'];move(s,'r1',5);assert(!s.racers[1]!.eliminated);assert.equal(data(s).finale!.stage,'duel');assert.deepEqual(data(s).finale!.qualifiers,['r0','r1']);
});

test('Mastermind correctly predicts the qualifying winner and takes the second finale slot',()=>{
  const s=fixture(['banana','mastermind','blimp'],[28,10,20]);data(s).triggered=true;data(s).finale={stage:'qualifying',qualifiers:[],reward:4};s.racers[1]!.flags.prediction='r0';move(s,'r0',2);assert.equal(data(s).finale!.stage,'duel');assert.deepEqual(data(s).finale!.qualifiers,['r0','r1']);assert.deepEqual(s.racers.slice(0,2).map(r=>r.position),[15,15]);assert(s.players.every(p=>p.score===0));
});

test('Time Imp real selection creates exactly one extra and carries Mush’s acquired powers',()=>{
  const s=fixture(['mush','legs','blimp'],[12,5,22],['time-imp']);s.racers[0]!.flags.acquiredPowers=['penguin','coach'];move(s,'r0',2);assert(s.racers[0]!.eliminated);
  s.round=2;s.phase='selection';s.queue=[];s.pending=undefined;s.players.forEach((p,i)=>{p.hand=[['banana','alchemist','coach'][i]!];p.selection=[];});for(const p of s.players)applyGameAction(s,p.id,{type:'select',characterIds:[p.hand[0]!]});
  const extra=s.racers.find(r=>r.flags.timeImpExtra)!;assert(extra);assert.equal(s.racers.length,4);assert.equal(extra.playerId,'p0');assert.deepEqual(extra.flags.acquiredPowers,['penguin','coach']);assert.deepEqual(s.flags.twistNextRaceExtras,[]);
});

test('Final-race Time Imp eliminates without adding a phantom ninth race',()=>{
  const s=fixture(['banana','legs','blimp'],[12,5,22],['time-imp']);s.round=4;move(s,'r0',2);assert(s.racers[0]!.eliminated);assert.deepEqual(s.flags.twistNextRaceExtras,[]);assert.equal(s.round,4);
});

test('Fixed-six Party Pooper and Bonkbug cycle cannot consume fresh RNG or generate thousands of events',()=>{
  const s=fixture(['banana','party-pooper','blimp'],[2,23,15]);data(s).triggered=true;data(s).fixedFaces={p0:6,p1:2,p2:3};data(s).bonkbug=true;begin(s);const before=s.randomLog.length;applyGameAction(s,'p0',{type:'roll'});assert.equal(s.randomLog.length,before);assert(s.phase==='paused'||s.flags.needsBegin||s.pending,'repeated fixed-six loop must stop or reach an actionable choice');assert(s.logs.length<1000);
});

test('Real swapped card returns to the shared physical deck after scoring',()=>{
  const s=fixture(['banana','legs','blimp'],[12,5,22],['swap-meet']);s.deck=['coach','alchemist','hare'];s.players[0]!.used=['banana'];move(s,'r0',2);choose(s,'swap:r0');choose(s,'keep');choose(s,'keep');move(s,'r0',16);move(s,'r1',25);assert.equal(s.phase,'results');assert(s.discard.includes('coach'));assert.deepEqual(s.players[0]!.used,['banana']);assert.equal(s.results[0]!.scores!.reduce((a,b)=>a+b.total,0),s.players.reduce((a,b)=>a+b.score,0));
});

test('Two-player double-racer Swap offers one card per person and keeps score ownership correct',()=>{
  const s=fixture(['banana','legs','blimp','coach'],[12,5,22,7],['swap-meet']);s.players=s.players.slice(0,2);s.racers.forEach((r,i)=>r.playerId=`p${Math.floor(i/2)}`);s.scoreLedger=s.scoreLedger!.slice(0,2);s.deck=['alchemist','hare'];move(s,'r0',2);assert.equal(data(s).swap!.length,2);assert(s.pending!.options.some(o=>o.id==='swap:r1'));choose(s,'swap:r1');assert.equal(s.pending?.playerId,'p1');choose(s,'swap:r3');assert.equal(s.racers[1]!.characterId,'alchemist');assert.equal(s.racers[3]!.characterId,'hare');
  move(s,'r1',25);move(s,'r3',23);assert.equal(s.phase,'results');assert.deepEqual(s.players.map(p=>p.score),[3,1]);assert.deepEqual(s.results[0]!.scores!.map(p=>p.total),[3,1]);assert(s.discard.includes('alchemist')&&s.discard.includes('hare'));
});

test('Eight-player Swap waits for all eight commitments before a single reveal',()=>{
  const s=fixture(['banana','legs','blimp','coach','mastermind','sisyphus','alchemist','rocket-scientist'],[12,1,3,5,7,9,17,22],['swap-meet']);s.deck=['hare','genius','duelist','scoocher','copycat','romantic','gunk','heckler'];move(s,'r0',2);assert.equal(data(s).swap!.length,8);
  for(let i=0;i<8;i++){assert.equal(s.pending?.playerId,`p${i}`);assert(!s.logs.some(e=>e.type==='twist-swap'));choose(s,'keep');}
  assert.equal(s.pending,undefined);assert.equal(s.logs.filter(e=>e.type==='twist-swap').length,1);assert.equal(data(s).swap,undefined);
});
