import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
/** Peripheral carnival pavilion and pennants: no extra cells or rule devices. */
export function CarnivalDetails({lowQuality,reversed}:{lowQuality:boolean;reversed:boolean}) {
 const kit=useMemo(()=>{
 const buckets:THREE.BufferGeometry[][]=[[],[],[]];
 const add=(n:number,g:THREE.BufferGeometry,x:number,y:number,z:number)=>{g.translate(x,y,z);buckets[n]!.push(g.index?g.toNonIndexed():g);if(g.index)g.dispose()};
 for(const x of [-12.3,10.8]){
 add(0,new THREE.CylinderGeometry(.68,.77,.13,16),x,.22,0);
 for(const dx of [-.5,.5])add(1,new THREE.CylinderGeometry(.04,.04,1.2,8),x+dx,.86,0);
 add(0,new THREE.ConeGeometry(.94,.65,6),x,1.5,0);add(1,new THREE.SphereGeometry(.09,8,6),x,1.88,0);
 }
 for(const side of [-1,1])for(const x of [-12,-5,3,11]){
 add(1,new THREE.CylinderGeometry(.035,.035,.95,8),x,.66,side*4.8);
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([x,1.12,side*4.8,x+.55,1.12,side*4.8,x+.22,.78,side*4.8],3));g.setAttribute('uv',new THREE.Float32BufferAttribute([0,0,1,0,.5,1],2));g.computeVertexNormals();add(0,g,0,0,0);
 }
 if(!lowQuality)for(const x of [-12.3,10.8])for(const dx of [-.3,0,.3])add(2,new THREE.SphereGeometry(.055,6,4),x+dx,1.2,0);
 const materials=[new THREE.MeshStandardMaterial({color:'#aa91be',roughness:.7,side:THREE.DoubleSide}),new THREE.MeshStandardMaterial({color:'#ebc779',roughness:.55}),new THREE.MeshStandardMaterial({color:'#f7e6bd',roughness:.75})];
 return {geometries:buckets.map(b=>{const g=b.length?mergeGeometries(b):null;b.forEach(x=>x.dispose());return g}),materials};
 },[lowQuality]);
 useEffect(()=>()=>{kit.geometries.forEach(g=>g?.dispose());kit.materials.forEach(m=>m.dispose())},[kit]);
 return <group name="twisty-carnival-scenery" userData={{reversed}}>{kit.geometries.map((g,i)=>g&&<mesh key={i} geometry={g} material={kit.materials[i]} castShadow receiveShadow dispose={null}/>)}</group>;
}
