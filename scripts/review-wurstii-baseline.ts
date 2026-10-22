// Reproducible, read-only comparison against the reviewed upstream revision.
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import * as current from '../src/engine/index.js';
import type { GameState, Player } from '../src/shared/types.js';

mkdirSync('.local',{recursive:true});
const baseline='571b0cb1a875c0bb92bcf8767b21764ed7a75a3b';
const source=execFileSync('git',['show',`${baseline}:src/engine/index.ts`],{encoding:'utf8'}).replaceAll("'./leaf-expansion.js'","'../src/engine/leaf-expansion.js'").replaceAll("'../shared/","'../src/shared/");
writeFileSync('.local/review-upstream.ts',source);
const upstream=await import('../.local/review-upstream.js') as typeof current;
function fixture(ids:string[],positions:number[]):GameState{
  const players:Player[]=ids.map((_,i)=>({id:`p${i}`,name:`玩家${i}`,seat:i,color:'#123456',ready:true,connected:true,score:0,hand:[],used:[],selection:[]}));
  const s=current.createGame(players,7097,'multiplayer','mixed');s.phase='race';s.round=2;s.track='wild';s.currentRacerId='r0';
  s.racers=ids.map((characterId,i)=>({id:`r${i}`,playerId:`p${i}`,characterId,position:positions[i]!,tripped:false,finished:false,eliminated:false,flags:{}}));s.baseTurnOrder=s.racers.map(r=>r.id);return s;
}
const scenarios=[
  {name:'huge-baby-forced',state:fixture(['cheerleader','huge-baby','magikarp'],[11,12,0]),task:{kind:'move',racerId:'r0',distance:1,cause:'track-arrow'}},
  {name:'huge-baby-fish-declines',state:fixture(['cheerleader','huge-baby','suckerfish'],[11,12,11]),task:{kind:'move',racerId:'r0',distance:1,cause:'track-arrow'}},
  {name:'huge-baby-fish-follows',state:fixture(['cheerleader','huge-baby','suckerfish'],[11,12,11]),task:{kind:'move',racerId:'r0',distance:1,cause:'track-arrow'}},
  {name:'gluebert-pass',state:fixture(['leaptoad','extra-mile-gluebert','leaf-triangle-man'],[2,4,20]),task:{kind:'move',racerId:'r0',distance:5}},
  {name:'game-watch-scoocher',state:fixture(['wurstii-mr-game-and-watch','scoocher','magikarp'],[12,12,0]),task:{kind:'ability',racerId:'r1',power:'scoocher',effects:[{kind:'move',racerId:'r1',distance:1,cause:'scoocher'}]}},
];
const report=[];
for(const scenario of scenarios){
  scenario.state.queue=[scenario.task];writeFileSync(`.local/repro-${scenario.name}.json`,JSON.stringify(scenario.state,null,2));
  for(const [label,engine] of [['upstream',upstream],['current',current]] as const){
    if(label==='upstream'&&scenario.name==='game-watch-scoocher')continue;
    const s=structuredClone(scenario.state);let choices=0,calls=1;engine.resolveTasks(s);
    while(s.phase==='race'&&(s.pending||s.flags.continuation)&&calls++<10000){
      if(s.pending){choices++;engine.applyGameAction(s,s.pending.playerId,{type:'choose',choiceId:s.pending.id,optionId:scenario.name.endsWith('follows')?'use':'skip'});}
      else engine.applyGameAction(s,'p0',{type:'next'});
    }
    report.push({scenario:scenario.name,engine:label,phase:s.phase,positions:s.racers.map(r=>r.position),scores:s.players.map(p=>p.score),choices,calls,remaining:s.queue.length,rng:s.rngState,hold:s.flags.ruleHold,loops:s.logs.filter(e=>e.type==='loop').length,trace:s.logs.slice(-24)});
  }
}
writeFileSync('.local/review-baseline.json',JSON.stringify({baseline,report},null,2));
console.log(JSON.stringify(report.map(({trace,...summary})=>summary),null,2));
