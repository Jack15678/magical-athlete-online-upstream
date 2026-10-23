import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { boardPoint, TILE, trackConnections } from './math.js';
import { bridgeProfile, BRIDGE_PAIRS } from './bridges-layout.js';

/** Static bridge sculpture is batched by surface, retaining the exact route ramps. */
export function BridgesRoads() {
 const parts=useMemo(()=>{
  const groups=new Map<string,THREE.BufferGeometry[]>();
  const add=(color:string,g:THREE.BufferGeometry)=>{const flat=g.index?g.toNonIndexed():g;if(flat!==g)g.dispose();if(!groups.has(color))groups.set(color,[]);groups.get(color)!.push(flat)};
  const beam=(a:readonly number[],b:readonly number[],width:number,height:number,color:string,side=0)=>{
   const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),delta=end.clone().sub(start),middle=start.add(end).multiplyScalar(.5);
   middle.add(new THREE.Vector3(-delta.z,0,delta.x).normalize().multiplyScalar(side));middle.y-=height/2+.02;
   const g=new RoundedBoxGeometry(width,height,delta.length()+.015,1,Math.min(.03,width*.2,height*.18));
   g.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),delta.normalize()));g.translate(middle.x,middle.y,middle.z);add(color,g);
  };
  const ribbon=(points:readonly (readonly number[])[],width:number,height:number,color:string,side=0)=>{
   const a=points[0]!,b=points.at(-1)!,normal=new THREE.Vector3(-(b[2]!-a[2]!),0,b[0]!-a[0]!).normalize(),vertices:number[]=[],indices:number[]=[];
   for(const p of points)for(const [edge,down]of [[-1,0],[1,0],[-1,1],[1,1]])vertices.push(p[0]!+normal.x*(side+edge!*width/2),p[1]!-(side===0?.02:.06)-down!*height,p[2]!+normal.z*(side+edge!*width/2));
   for(let i=0;i<points.length-1;i++){const a=i*4,b=a+4;indices.push(a,a+1,b,a+1,b+1,b,a+2,b+2,a+3,a+3,b+2,b+3,a,b,a+2,a+2,b,b+2,a+1,a+3,b+1,a+3,b+3,b+1);}
   const end=(points.length-1)*4;indices.push(0,2,1,1,2,3,end,end+1,end+2,end+1,end+3,end+2);
   const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(new Array(vertices.length/3*2).fill(0),2));g.setIndex(indices);const flat=g.toNonIndexed();g.dispose();flat.computeVertexNormals();add(color,flat);
  };
  for(const [from,to]of trackConnections('bridges')){
   const a=boardPoint(from,false,'bridges'),b=boardPoint(to,false,'bridges'),points=bridgeProfile(a,b),raised=a[1]>.3||b[1]>.3;
   ribbon(points,TILE*.82,.16,raised?'#d5ae75':'#7ca6a3');
   for(const side of [-1,1])ribbon(points,.09,raised?.3:.19,raised?'#755837':'#345e64',side*TILE*.41);
   const angle=Math.atan2(b[0]-a[0],b[2]-a[2]);
   for(const t of [.34,.61])for(const side of [-1,1]){
    const i=Math.floor((points.length-1)*t),p=new THREE.Vector3(...points[i]!);
    const g=new THREE.PlaneGeometry(.065,.27);g.rotateZ(side*-.65);g.rotateX(-Math.PI/2);g.translate(side*.085,0,0);g.rotateY(angle);g.translate(p.x,p.y+.025,p.z);add(raised?'#fff1c7':'#e1f4e9',g);
   }
  }
  // Rounded junction aprons conceal hard rail mitres at the tile/ramp join.
  // They are only a few centimetres wider than the existing numbered tile.
  for(let id=0;id<=30;id++){
   const p=boardPoint(id,false,'bridges'),h=TILE*.48,r=.24,shape=new THREE.Shape();
   shape.moveTo(-h+r,-h);shape.lineTo(h-r,-h);shape.quadraticCurveTo(h,-h,h,-h+r);shape.lineTo(h,h-r);shape.quadraticCurveTo(h,h,h-r,h);shape.lineTo(-h+r,h);shape.quadraticCurveTo(-h,h,-h,h-r);shape.lineTo(-h,-h+r);shape.quadraticCurveTo(-h,-h,-h+r,-h);shape.closePath();
   const g=new THREE.ExtrudeGeometry(shape,{depth:.15,bevelEnabled:true,bevelSize:.015,bevelThickness:.012,bevelSegments:2,curveSegments:4});g.rotateX(-Math.PI/2);g.translate(p[0],p[1]-.19,p[2]);add(p[1]>.3?'#755837':'#345e64',g);
  }
  for(const [upper,lower]of BRIDGE_PAIRS){
   const p=boardPoint(upper,false,'bridges'),a=boardPoint(lower-1,false,'bridges'),b=boardPoint(lower+1,false,'bridges'),dx=b[0]-a[0],dz=b[2]-a[2],len=Math.hypot(dx,dz);
   beam([p[0]-dz/len*1.38,p[1]-.14,p[2]+dx/len*1.38],[p[0]+dz/len*1.38,p[1]-.14,p[2]-dx/len*1.38],.26,.2,'#647f86');
   for(const side of [-1,1]){const x=p[0]-dz/len*side*1.38,z=p[2]+dx/len*side*1.38,g=new THREE.CylinderGeometry(.16,.23,p[1]-.16,12);g.translate(x,(p[1]-.16)/2,z);add('#647f86',g);
   const foot=new THREE.CylinderGeometry(.27,.3,.1,12);foot.translate(x,.065,z);add('#647f86',foot);}
  }
  return [...groups].map(([color,list])=>{const geometry=mergeGeometries(list,false)!;list.forEach(g=>g.dispose());return {color,geometry,material:new THREE.MeshStandardMaterial({color,roughness:.8,side:THREE.DoubleSide})}});
 },[]);
 useEffect(()=>()=>parts.forEach(p=>{p.geometry.dispose();p.material.dispose()}),[parts]);
 return <group name="bridge-open-portals">{parts.map(p=><mesh key={p.color} geometry={p.geometry} material={p.material} castShadow receiveShadow dispose={null}/>)}</group>;
}

export function BridgeRouteBadges() {
  return <group name="bridge-layer-route-signs">{BRIDGE_PAIRS.flatMap(pair => pair.map((id, layer) => <BridgeBadge key={id} id={id} upper={layer === 0} />))}</group>;
}
function BridgeBadge({id, upper}: {id: number; upper: boolean}) {
  const p = boardPoint(id, false, 'bridges');
  const texture = useMemo(() => {
    const canvas=document.createElement('canvas');canvas.width=256;canvas.height=96;
    const c=canvas.getContext('2d')!;c.fillStyle=upper?'#624725':'#214f59';c.beginPath();c.roundRect(2,2,252,92,20);c.fill();
    c.strokeStyle=upper?'#efc88b':'#a9d4cf';c.lineWidth=5;c.stroke();c.fillStyle='#fff9e7';c.font='bold 48px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(`${id} → ${id+1}`,128,49);
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;return t;
  },[id,upper]);
  useEffect(()=>()=>texture.dispose(),[texture]);
  return <sprite position={[p[0]-.15,p[1]+.2,p[2]-1.8]} scale={[1.05,.395,1]}><spriteMaterial map={texture} transparent depthTest={false} depthWrite={false} toneMapped={false}/></sprite>;
}
