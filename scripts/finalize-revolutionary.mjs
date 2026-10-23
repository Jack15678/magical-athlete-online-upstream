/** Run after Blender with @gltf-transform/{core,extensions,functions} 4.5.1 and meshoptimizer installed.
 * No position quantization: the existing reduced-motion path uses unskinned bind-pose geometry.
 */
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const toolRoot=resolve(process.env.GLTF_TOOL_ROOT ?? '.tools/revolutionary/node_modules');
const load=path=>import(pathToFileURL(resolve(toolRoot,path)).href);
const {NodeIO}=await load('@gltf-transform/core/dist/index.js');
const {EXTMeshoptCompression,ALL_EXTENSIONS}=await load('@gltf-transform/extensions/dist/index.js');
const {dedup,prune,resample}=await load('@gltf-transform/functions/dist/index.js');
const {MeshoptEncoder}=await load('meshoptimizer/index.js');
import { readFile, writeFile, stat } from 'node:fs/promises';
await MeshoptEncoder.ready;
const path='public/models/leaf/leaf-revolutionary.glb';
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.encoder':MeshoptEncoder});
const doc=await io.read(path);await doc.transform(dedup(),resample(),prune());
doc.createExtension(EXTMeshoptCompression).setRequired(true).setEncoderOptions({method:EXTMeshoptCompression.EncoderMethod.FILTER});
await io.write(path,doc);
const source='assets/blender/leaf/leaf-revolutionary.json', manifestPath='public/models/leaf/manifest.json';
const row=JSON.parse(await readFile(source,'utf8'));row.bytes=(await stat(path)).size;row.compression='EXT_meshopt_compression (no position quantization)';
await writeFile(source,JSON.stringify(row,null,2)+'\n');
const manifest=JSON.parse(await readFile(manifestPath,'utf8'));
manifest.models=manifest.models.map(m=>m.id===row.id?{...m,...row}:m);
manifest.totalBytes=manifest.models.reduce((s,m)=>s+m.bytes,0);
manifest.bytes=manifest.totalBytes;
await writeFile(manifestPath,JSON.stringify(manifest,null,2)+'\n');
