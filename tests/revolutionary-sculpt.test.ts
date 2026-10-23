import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile}from 'node:fs/promises';
import {Box3,Vector3,AnimationMixer,Raycaster,SkinnedMesh}from 'three';
import {GLTFLoader}from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder}from 'three/addons/libs/meshopt_decoder.module.js';
import {cloneToyModel}from '../src/client/scene/toy-model-instance.js';
test('Revolutionary static bind-pose and five animated clips remain coherent after compression',async()=>{
 const bytes=await readFile('public/models/leaf/leaf-revolutionary.glb');const asset=await new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 const source=asset.scene.getObjectByName('toy_leaf-revolutionary')!;assert.ok(source);
 assert.deepEqual(asset.animations.map(clip=>clip.name).sort(),['fall','idle','move','recover','skill']);
 const ink=source.getObjectByName('leaf-revolutionary_toy-sw-ink') as SkinnedMesh;
 const face=source.getObjectByName('leaf-revolutionary_toy-sw-pink') as SkinnedMesh;
 source.updateMatrixWorld(true);
 const mouth=Array.from({length:ink.geometry.attributes.position!.count},(_,i)=>ink.getVertexPosition(i,new Vector3()).applyMatrix4(ink.matrixWorld)).filter(p=>p.y>.55&&p.y<.64&&p.z>.08);
 assert.equal(mouth.length,60,'the sculpt retains its complete mouth geometry, including seam vertices');
 const ray=new Raycaster(),gaps=mouth.map(p=>{ray.set(new Vector3(p.x,p.y,1),new Vector3(0,0,-1));const hit=ray.intersectObject(face,false)[0];assert.ok(hit,'mouth must sit over the face');return p.z-hit.point.z;});
 // This shallow sculpted tube intersects the cheeks; it is not the old mouth
 // projected to an exact 0.004 centreline gap. Catch both floating and buried lips.
 assert.ok(Math.max(...gaps)>0&&Math.max(...gaps)<.012);
 assert.ok(Math.min(...gaps)>-.012&&Math.min(...gaps)<0);
 const bounds=new Box3().setFromObject(source,true),staticBounds=new Box3().setFromObject(cloneToyModel(source,false),true);
 assert.ok(bounds.min.distanceTo(staticBounds.min)<.001);assert.ok(bounds.max.distanceTo(staticBounds.max)<.001);
 for(const clip of asset.animations){const model=cloneToyModel(source,true),mixer=new AnimationMixer(model);mixer.clipAction(clip).play();for(const t of [0,.25,.5,.75,1]){mixer.setTime(clip.duration*t);model.updateMatrixWorld(true);const size=new Box3().setFromObject(model,true).getSize(new Vector3());assert.ok(size.x<.7&&size.y<1.08&&size.z<.5,clip.name+' must not explode');assert.deepEqual(model.position.toArray(),[0,0,0]);}mixer.stopAllAction();}
});
