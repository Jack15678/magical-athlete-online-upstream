import test from 'node:test';
import assert from 'node:assert/strict';
import { BRIDGE_PAIRS, bridgeLeg } from '../src/client/scene/bridges-layout.js';
import { boardPoint, trackConnections } from '../src/client/scene/math.js';
import { pawnRoute } from '../src/client/scene/pawn-motion.js';
import { TRACKS } from '../src/shared/tracks.js';

test('Bridges preserves exact numeric route and four non-junction crossings',()=>{
 assert.deepEqual(trackConnections('bridges'),Array.from({length:30},(_,i)=>[i,i+1]));
 assert.deepEqual(TRACKS.bridges.bridges,BRIDGE_PAIRS);assert.equal(TRACKS.bridges.secondCorner,15);
});
test('Bridges flat landings, graded approaches and full underpass clearance',()=>{
 for(const [upper,lower]of BRIDGE_PAIRS){
  const u=boardPoint(upper,false,'bridges'),l=boardPoint(lower,false,'bridges');
  assert.ok(u[1]-.32-l[1]>1.65*(.98+.164)+.4);
  for(const center of [upper,lower])for(const compact of [false,true]){
   const nodes=[center-1,center,center+1].map(n=>boardPoint(n,compact,'bridges'));
   const route=pawnRoute(nodes,true);
   for(let i=1;i<nodes.length;i++){
    const leg=bridgeLeg(nodes[i-1]!,nodes[i]!);
    assert.equal(leg[0]![1],leg[1]![1]);assert.equal(leg[2]![1],leg[3]![1]);
    const rise=Math.abs(leg[2]![1]-leg[1]![1]);const run=Math.hypot(leg[2]![0]-leg[1]![0],leg[2]![2]-leg[1]![2]);
    assert.ok(rise/run<.85,'no near-vertical ramp');
   }
   assert.ok(route.getPointAt(0).distanceTo(route.points[0]!)<1e-8);
   assert.ok(route.getPointAt(1).distanceTo(route.points[2]!)<1e-8);
   for(let t=0;t<=1;t+=.01){const p=route.getPointAt(t);assert.ok(p.y>=Math.min(...nodes.map(n=>n[1]))-1e-8);assert.ok(p.y<=Math.max(...nodes.map(n=>n[1]))+1e-8);}
  }
 }
});
