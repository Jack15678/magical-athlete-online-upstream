import * as THREE from 'three';
import type { TrackId } from '../../shared/tracks.js';
import { boardBounds, boardPoint, TILE, trackConnections, trackNodeIds } from './math.js';

/** Display-only measurements. No topology, distance or game-state mutation. */
export function expansionTileSize(track: TrackId, id: number) {
 const p=boardPoint(id,false,track);
 const distances=trackNodeIds(track).filter(n=>n!==id).map(n=>{const q=boardPoint(n,false,track);return Math.hypot(p[0]-q[0],p[2]-q[2])}).filter(d=>d>.01);
 return Math.min(TILE*.91,Math.min(...distances)*.86);
}
export function routeClearance(track:TrackId,x:number,z:number) {
 const p=new THREE.Vector3(x,0,z),q=new THREE.Vector3();
 const start=boardPoint(0,false,track),apron=new THREE.Line3(new THREE.Vector3(start[0]-TILE*3,0,start[2]),new THREE.Vector3(start[0],0,start[2])).closestPointToPoint(p,true,q).distanceTo(p);
 return Math.min(apron,...trackConnections(track).map(([a,b])=>{const u=boardPoint(a,false,track),v=boardPoint(b,false,track);return new THREE.Line3(new THREE.Vector3(u[0],0,u[2]),new THREE.Vector3(v[0],0,v[2])).closestPointToPoint(p,true,q).distanceTo(p)}));
}
/** Non-walkable pockets are kept outside ALL routes, including elevated ones.
 * Deterministic placement never consumes the game's random stream. */
export function sceneryPockets(track:TrackId) {
 const polygon=expansionOutline(track,1.2).getPoints(8).map(p=>({x:p.x,z:-p.y}));
 const inside=(x:number,z:number)=>{let yes=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i]!,b=polygon[j]!;if((a.z>z)!==(b.z>z)&&x<(b.x-a.x)*(z-a.z)/(b.z-a.z)+a.x)yes=!yes}return yes};
 const b=boardBounds(track),candidates:{x:number;z:number;r:number}[]=[];
 for(let x=b.minX+3;x<b.maxX-1.5;x+=1.4)for(let z=b.minZ+1.4;z<b.maxZ-1.4;z+=1.4){
 const d=routeClearance(track,x,z);const r=Math.min(2.2,d-1.35);if(d>2.05&&[[r,0],[-r,0],[0,r],[0,-r]].every(([dx,dz])=>inside(x+dx!,z+dz!)))candidates.push({x,z,r});
 }
 candidates.sort((a,b)=>b.r-a.r||a.x-b.x||a.z-b.z);
 const result:typeof candidates=[];
 for(const p of candidates)if(result.every(q=>Math.hypot(p.x-q.x,p.z-q.z)>p.r+q.r+1.4)){result.push(p);if(result.length>=12)break;}
 return result;
}
/** Rounded convex silhouette hugs the course instead of a rectangular slab. */
export function expansionOutline(track:TrackId,margin:number) {
 const points=trackNodeIds(track).map(id=>boardPoint(id,false,track));const start=boardPoint(0,false,track);points.push([start[0]-TILE*3,start[1],start[2]]);
 const cloud=points.flatMap(p=>[[-1,-1],[-1,1],[1,-1],[1,1]].map(([x,z])=>({x:p[0]+x!*margin,z:p[2]+z!*margin}))).sort((a,b)=>a.x-b.x||a.z-b.z);
 const cross=(a:typeof cloud[0],b:typeof cloud[0],c:typeof cloud[0])=>(b.x-a.x)*(c.z-a.z)-(b.z-a.z)*(c.x-a.x);
 const half=(list:typeof cloud)=>{const h:typeof cloud=[];for(const p of list){while(h.length>=2&&cross(h.at(-2)!,h.at(-1)!,p)<=0)h.pop();h.push(p)}return h};
 const lo=half(cloud),hi=half([...cloud].reverse());lo.pop();hi.pop();const hull=[...lo,...hi],shape=new THREE.Shape();
 const toward=(a:typeof cloud[0],b:typeof cloud[0])=>{const d=Math.hypot(b.x-a.x,b.z-a.z),t=Math.min(.6/d,.35);return{x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t}};
 const first=toward(hull[0]!,hull.at(-1)!);shape.moveTo(first.x,-first.z);
 for(let i=0;i<hull.length;i++){const p=hull[i]!,entry=toward(p,hull[(i+hull.length-1)%hull.length]!),exit=toward(p,hull[(i+1)%hull.length]!);shape.lineTo(entry.x,-entry.z);shape.quadraticCurveTo(p.x,-p.z,exit.x,-exit.z)}shape.closePath();return shape;
}
