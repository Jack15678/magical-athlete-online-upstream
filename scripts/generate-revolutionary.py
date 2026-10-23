"""Rebuild only leaf-revolutionary. Blender 4.3+; no other character is written.
Reference: repository flat SVG and registered recognition features, not author PNG.
Side/back tailoring and sculpt detail are project interpretations.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
source=ROOT/'scripts/generate-second-wind-models.py'
exec(compile(source.read_text().split('models=[]; roots=[]; edit_roots=[]')[0],str(source),'exec'))
id='leaf-revolutionary'
root=bpy.data.objects.new('EDIT-'+id,None); scene.collection.objects.link(root); current={'id':id,'root':root}
# Continuous elliptical rings create authored cloth/head/hat silhouettes.
def loft(color, rings, name, sides=20):
    vertices=[]
    for x,y,z,rx,rz in rings:
        for i in range(sides):
            a=2*math.pi*i/sides; vertices.append((x+rx*math.cos(a),y,z+rz*math.sin(a)))
    faces=[tuple(reversed(range(sides)))]
    for j in range(len(rings)-1):
        for i in range(sides):
            a=j*sides+i;b=j*sides+(i+1)%sides;faces.append((a,b,b+sides,a+sides))
    faces.append(tuple(range((len(rings)-1)*sides,len(rings)*sides)))
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(vertices,[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);scene.collection.objects.link(obj);return add(obj,color,name)
# Matte vinyl, intentional restrained palette.
for material in MATS.values():
    bs=material.node_tree.nodes.get('Principled BSDF');bs.inputs['Roughness'].default_value=.72;bs.inputs['Coat Weight'].default_value=.04
for x in (-.105,.105):
    O('ink',(x,.075,.045),(.075,.064,.13),'rounded-boot')
    loft('ink',[(x,.07,0,.059,.07),(x,.16,-.015,.058,.055),(x,.23,-.01,.055,.052)],'boot-shaft',16)
loft('violet',[(0,.19,0,.19,.125),(0,.22,0,.205,.138),(0,.31,0,.18,.13),(0,.45,-.01,.145,.11),(0,.54,0,.165,.105),(0,.58,0,.12,.08)],'tailored-flared-coat',24)
# Raised lapel edges follow the coat, with a center seam rather than a pasted disc.
for side in (-1,1):
    L('violet',[(side*.105,.56,.085),(side*.075,.48,.122),(side*.015,.39,.132)],.018,'rolled-lapel')
L('ink',[(0,.38,.133),(0,.22,.14)],.004,'coat-seam')
for y in (.34,.28): O('yellow',(.035,y,.135),(.014,.014,.009),'button')
# Sculpted cheek-to-cranium surface, a small integrated nose (voxel union).
head=loft('pink',[(0,.565,.01,.07,.07),(0,.59,.015,.115,.1),(0,.64,.01,.15,.125),(0,.72,0,.16,.13),(0,.79,-.005,.14,.12),(0,.82,-.005,.09,.08)],'sculpted-head',24)
nose=O('pink',(.015,.675,.128),(.044,.035,.055),'nose')
select([head,nose]);bpy.context.view_layer.objects.active=head;bpy.ops.object.join()
rem=head.modifiers.new('Continuous cheeks and nose','REMESH');rem.mode='VOXEL';rem.voxel_size=.008;bpy.ops.object.modifier_apply(modifier=rem.name)
sm=head.modifiers.new('Soft sculpt finish','SMOOTH');sm.factor=.65;sm.iterations=3;bpy.ops.object.modifier_apply(modifier=sm.name)
dec=head.modifiers.new('Sculpt triangle budget','DECIMATE');dec.ratio=.35;bpy.ops.object.modifier_apply(modifier=dec.name)
for face in head.data.polygons: face.use_smooth=True
# Eyes inset into cheek surface, shallow highlights and eyebrows, no floating discs.
for x in (-.059,.059):
    O('paper',(x,.729,.112),(.028,.034,.011),'inset-eye')
    O('ink',(x+.005,.728,.122),(.010,.017,.004),'pupil')
    L('violet',[(x-.025,.771,.102),(x,.78,.111),(x+.025,.773,.103)],.006,'brow')
L('ink',[(-.046,.624,.117),(0,.613,.128),(.044,.624,.117)],.005,'seated-smile')
# One broad, soft bent cap, not a top hat with a thin antenna.
loft('violet',[(0,.793,0,.157,.133),(0,.827,0,.165,.139),(-.012,.88,-.01,.14,.12),(-.005,.94,-.015,.105,.093),(.048,.99,-.02,.087,.076),(.12,1.008,-.024,.07,.065),(.195,.985,-.023,.052,.05),(.239,.945,-.02,.037,.036),(.246,.901,-.014,.018,.022),(.239,.883,-.01,.004,.007)],'continuous-drooping-cap',24)
L('violet',[(-.14,.815,.06),(0,.816,.141),(.145,.815,.054)],.015,'soft-cap-hem')
# Bent sleeves grow out of shoulders. Right hand wraps the staff at the grip.
L('violet',[(-.125,.52,0),(-.205,.43,.01),(-.18,.365,.075)],.055,'relaxed-sleeve')
O('pink',(-.18,.35,.083),(.043,.05,.04),'relaxed-hand')
L('violet',[(.13,.52,0),(.20,.47,.045),(.255,.51,.105)],.052,'staff-sleeve')
O('pink',(.267,.512,.11),(.045,.042,.043),'gripping-hand')
L('brown',[(.28,.025,.13),(.28,.50,.13),(.28,.66,.13),(.303,.693,.13),(.335,.68,.13)],.015,'curved-staff')
O('pink',(.278,.523,.143),(.022,.024,.016),'gripping-thumb')
normalize(root);game=merge_game(root,id);game['edition']='leaf'
motion={'__file__':str(ROOT/'scripts/refine-racer-motion.py'),'__name__':'racer_motion'}
exec(compile(Path(motion['__file__']).read_text(),motion['__file__'],'exec'),motion)
arm=motion['rig'](game,id,'')
# Staff is a rigid prop attached to the same body bone as the closed grip.
for ob in game.children:
    if ob.type=='MESH' and 'brown' in ob.name:
        for vg in ob.vertex_groups: vg.remove(list(range(len(ob.data.vertices))))
        ob.vertex_groups[id+'_body'].add(list(range(len(ob.data.vertices))),1,'REPLACE')
OUT=ROOT/'public/models/leaf';SOURCES=ROOT/'assets/blender/leaf'; QA=ROOT/'docs/evidence/bridges-revolutionary';QA.mkdir(parents=True,exist_ok=True)
select([game,*game.children]);
params=dict(filepath=str(OUT/(id+'.glb')),export_format='GLB',use_selection=True,export_yup=True,export_apply=False,export_animations=True,export_animation_mode='NLA_TRACKS',export_nla_strips=True,export_frame_range=False,export_force_sampling=True,export_extras=True,export_skins=True)
allowed=bpy.ops.export_scene.gltf.get_rna_type().properties.keys();bpy.ops.export_scene.gltf(**{k:v for k,v in params.items() if k in allowed})
for obj in [root,*root.children]:obj.hide_render=True;obj.hide_set(True)
meshes=[o for o in game.children if o.type=='MESH']; pts=[o.matrix_world@v.co for o in meshes for v in o.data.vertices]
row=json.loads((SOURCES/(id+'.json')).read_text());row.update(bytes=(OUT/(id+'.glb')).stat().st_size,triangles=sum(len(p.vertices)-2 for o in meshes for p in o.data.polygons),draws=len(meshes),bounds=[round(max(p[k] for p in pts)-min(p[k] for p in pts),5) for k in (0,2,1)],referenceChecked=True,originalAuthorImageChecked=False,referenceBasis='Repository flat SVG and registered recognition traits; original author PNG not obtained in this revision.',inferred='Side/back tailoring, cap volume and face sculpt are project designs, not exact author-approved reverse views.',sculptVersion='tailored-v3-20261023',generator='Blender '+bpy.app.version_string,referenceDate='2026-10-23')
row.pop('mouthSurfaceVersion',None) # The new sculpt supersedes the old projected-mouth repair.
row.update(avatar='/avatars/leaf/'+id+'.svg',avatarStyle='flat-cartoon-svg',modelPreview='/models/leaf/avatars/'+id+'.png')
(SOURCES/(id+'.json')).write_text(json.dumps(row,ensure_ascii=False,indent=2)+'\n')
manifestpath=OUT/'manifest.json';manifest=json.loads(manifestpath.read_text());models=manifest['models'] if isinstance(manifest,dict) else manifest
for i,m in enumerate(models):
    if m['id']==id:models[i]={**m,**row};models[i].pop('mouthSurfaceVersion',None)
if isinstance(manifest,dict):
    if 'totalTriangles' in manifest:manifest['totalTriangles']=sum(m['triangles'] for m in models)
    if 'totalBytes' in manifest:manifest['totalBytes']=sum(m['bytes'] for m in models)
    if 'bytes' in manifest:manifest['bytes']=sum(m['bytes'] for m in models)
manifestpath.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
bpy.ops.wm.save_as_mainfile(filepath=str(SOURCES/(id+'.blend')),compress=True)
# Neutral transparent studio previews, not substituted for in-game verification.
scene.render.engine='CYCLES';scene.cycles.use_denoising=False;scene.cycles.samples=64;scene.render.resolution_x=640;scene.render.resolution_y=800;scene.render.resolution_percentage=100;scene.render.film_transparent=True
scene.world.color=(.55,.55,.55)
for pos,power,size in [((3,-4,5),500,4),((-3,-2,3),350,3),((1,3,4),450,3)]:
    bpy.ops.object.light_add(type='AREA',location=pos);light=bpy.context.object;light.data.energy=power;light.data.shape='DISK';light.data.size=size;light.rotation_euler=(Vector((0,0,.5))-light.location).to_track_quat('-Z','Y').to_euler()
bpy.ops.object.camera_add();camera=bpy.context.object;scene.camera=camera;camera.data.type='ORTHO';camera.data.ortho_scale=1.23
for name,pos in [('front',(0,-3,1.05)),('side',(3,0,.9)),('back',(0,3,1.05))]:
    camera.location=pos;camera.rotation_euler=(Vector((0,0,.48))-camera.location).to_track_quat('-Z','Y').to_euler();scene.render.filepath=str(QA/('revolutionary-'+name+'.png'));bpy.ops.render.render(write_still=True)
import shutil
shutil.copyfile(QA/'revolutionary-front.png',OUT/'avatars'/ (id+'.png'))
print('REVOLUTIONARY',json.dumps(row),flush=True)
