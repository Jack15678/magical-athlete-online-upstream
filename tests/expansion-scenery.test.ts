import { bridgeProfile } from '../src/client/scene/bridges-layout.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { expansionOutline, expansionTileSize, routeClearance, sceneryPockets } from '../src/client/scene/expansion-layout.js';
import { boardPoint, trackConnections, trackNodeIds } from '../src/client/scene/math.js';
import { TRACKS } from '../src/shared/tracks.js';
for(const track of ['squiggle','boardwalks','bridges'] as const){
 test(`${track}: landscaped pockets clear every walking edge and tile`,()=>{
 const pockets=sceneryPockets(track);assert.ok(pockets.length>=3);
 for(const p of pockets){assert.ok(routeClearance(track,p.x,p.z)>=p.r+1.35-1e-8);assert.ok(p.r>=.7);}
 assert.deepEqual(pockets,sceneryPockets(track));
 });
 test(`${track}: finite contour and sizes retain each unique logical tile`,()=>{
 const points=expansionOutline(track,1.8).getPoints(8);assert.ok(points.length>12);assert.ok(points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));
 for(const n of trackNodeIds(track)){assert.ok(expansionTileSize(track,n)>.6);assert.ok(expansionTileSize(track,n)<=2.05*.91)}
 });
}
test('Bridges remains a continuous 31-cell course, without crossing shortcuts',()=>{
 assert.deepEqual(trackConnections('bridges'),Array.from({length:30},(_,i)=>[i,i+1]));
 for(const [u,l]of [[3,8],[10,13],[15,18],[20,23]]){const a=boardPoint(u!,false,'bridges'),b=boardPoint(l!,false,'bridges');assert.equal(a[0],b[0]);assert.equal(a[2],b[2]);assert.ok(a[1]-b[1]>3)}
 assert.equal(TRACKS.bridges.secondCorner,15);
});
test('Boardwalks junction identities and authoritative remaining distance remain distinct',()=>{
 for(const id of [8,17,18])assert.equal(TRACKS.boardwalks.edges![id]!.length,2);
 for(const id of [13,24,26])assert.equal(trackConnections('boardwalks').filter(([,to])=>to===id).length,2);
 assert.equal(TRACKS.boardwalks.remaining![31],23);
 assert.deepEqual(TRACKS['twisty-twirl'].twistBoundary,{before:13,after:14});
});

test('rounded ramp shoulders preserve flat pads and bounded grade',()=>{
 for(const [from,to]of trackConnections('bridges'))for(const compact of [false,true]){
 const a=boardPoint(from,compact,'bridges'),b=boardPoint(to,compact,'bridges'),profile=bridgeProfile(a,b);
 assert.deepEqual(profile[0],a);assert.deepEqual(profile.at(-1),b);assert.equal(profile[0]![1],profile[1]![1]);assert.equal(profile.at(-1)![1],profile.at(-2)![1]);
 for(let i=1;i<profile.length;i++){const p=profile[i-1]!,q=profile[i]!;assert.ok(Math.abs(q[1]-p[1])/Math.max(.0001,Math.hypot(q[0]-p[0],q[2]-p[2]))<.85);assert.ok(q[1]>=Math.min(a[1],b[1])-1e-8&&q[1]<=Math.max(a[1],b[1])+1e-8)}
 }
});
