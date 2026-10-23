import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { Box3, LoadingManager, Raycaster, Texture, Vector3 } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { boardPoint } from '../src/client/scene/math.js';
import { cameraFrame, cameraProject } from '../src/client/scene/camera.js';
import { WHIRLY_MODEL_BOUNDS } from '../src/client/scene/whirly-model.js';
import { TRACKS } from '../src/shared/tracks.js';

const bytes = await readFile(new URL('../public/models/tracks/whirly-world.glb', import.meta.url));
const json = JSON.parse(bytes.subarray(20, 20 + bytes.readUInt32LE(12)).toString());
const manager = new LoadingManager();
manager.setURLModifier(url => { throw Error(`Unexpected external resource: ${url}`); });
// Node checks geometry; the actual embedded atlas is decoded in the browser tests.
const loader = new GLTFLoader(manager).register(() => ({ name: 'geometry-check', loadTexture: async () => new Texture() }));
const gltf = await loader.parseAsync(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength), '');
gltf.scene.updateMatrixWorld(true);

test('Whirly is a self-contained static GLB with editable Blender source', async () => {
  assert.equal(bytes.readUInt32LE(0), 0x46546c67);
  assert.equal(bytes.readUInt32LE(4), 2);
  assert.equal(bytes.readUInt32LE(8), bytes.length);
  assert(bytes.length < 5 * 1024 * 1024);
  assert.equal(json.animations?.length ?? 0, 0);
  assert.equal(json.cameras?.length ?? 0, 0);
  assert.equal(json.extensionsRequired?.length ?? 0, 0);
  assert(json.buffers.every((buffer: { uri?: string }) => !buffer.uri));
  assert.equal(json.images.length, 1);
  assert(json.images.every((image: { uri?: string; bufferView?: number }) => !image.uri && image.bufferView !== undefined));
  assert(json.materials.length <= 10);
  const blend = await readFile(new URL('../assets/blender/tracks/whirly-world.blend', import.meta.url));
  assert.equal(blend.subarray(0, 7).toString(), 'BLENDER');
});

test('Whirly anchors and six portal groups match the playable rules in both orientations', () => {
  const root = gltf.scene.getObjectByName('track_whirly_world'); assert(root);
  assert.deepEqual(root.position.toArray(), [0, 0, 0]);
  assert.deepEqual(root.quaternion.toArray(), [0, 0, 0, 1]);
  assert.deepEqual(root.scale.toArray(), [1, 1, 1]);
  const pairs = Object.entries(TRACKS['whirly-world'].specials).filter(([from, tile]) => tile.to! > Number(from));
  const expectedGroups = pairs.map(([from, tile]) => `portal_pair_${from.padStart(2, '0')}_${String(tile.to).padStart(2, '0')}`).sort();
  assert.equal(expectedGroups.length, 6);
  assert.deepEqual(root.children.filter(child => /^portal_pair_\d+_\d+$/.test(child.name)).map(child => child.name).sort(), expectedGroups);
  assert.equal(root.children.filter(child => /^space_\d+$/.test(child.name)).length, 31);
  for (const compact of [false, true]) {
    const scene = gltf.scene.clone(true); scene.rotation.y = compact ? -Math.PI / 2 : 0; scene.updateMatrixWorld(true);
    for (let i = 0; i <= 30; i++) {
      const node = scene.getObjectByName(`space_${String(i).padStart(2, '0')}`); assert(node);
      assert(node.getWorldPosition(new Vector3()).distanceTo(new Vector3(...boardPoint(i, compact, 'whirly-world'))) < .01);
    }
  }
});

test('all Whirly standing positions have a surface and the full model fits both overview cameras', () => {
  const bounds = new Box3().setFromObject(gltf.scene, true);
  for (let axis = 0; axis < 3; axis++) {
    assert(bounds.min.getComponent(axis) >= WHIRLY_MODEL_BOUNDS.min[axis] - .001);
    assert(bounds.max.getComponent(axis) <= WHIRLY_MODEL_BOUNDS.max[axis] + .001);
  }
  for (let i = 0; i <= 30; i++) {
    const [x, y, z] = boardPoint(i, false, 'whirly-world');
    const hits = new Raycaster(new Vector3(x, 3, z), new Vector3(0, -1, 0)).intersectObject(gltf.scene, true);
    assert(hits.length && Math.abs(hits[0]!.point.y - y) < .01, `space ${i} must support its pawn`);
  }
  for (const [width, height, compact] of [[1280, 900, false], [390, 844, true]] as const) {
    const frame = cameraFrame([], compact, width, height, true, undefined, false, 'whirly-world');
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, 2.9]) for (const z of [bounds.min.z, bounds.max.z]) {
      const p = cameraProject(compact ? [-z, y, x] : [x, y, z], compact);
      assert(Math.abs(p.x * frame.zoom) < width / 2 - (compact ? 11 : 39));
      assert(Math.abs(p.y * frame.zoom) < height / 2 - (compact ? 189 : 94), 'overview must clear the floating phone controls');
    }
  }
});
