import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

test('face-surface audit and its replacement sculpt identify the current source and shipping assets', async () => {
  const audit = JSON.parse(await readFile(new URL('../docs/evidence/refinement-20261022/mouth-surface-repair.json', import.meta.url), 'utf8'));
  // The historical 46-model record stays intact. The user-requested new sculpt
  // has a different face and is checked geometrically in revolutionary-sculpt.test.ts.
  const replacement = JSON.parse(await readFile(new URL('../docs/evidence/expansion-dioramas/revolutionary-sculpt.json', import.meta.url), 'utf8'));
  assert.equal(replacement.id, 'leaf-revolutionary');
  assert.equal(replacement.supersedes, 'surface-mouth-v2');
  assert.equal(audit.passed, true);
  assert.equal(audit.version, 'surface-mouth-v2');
  assert.equal(audit.models.length, 46);
  const hashes = new Map<string, string>();
  const hash = async (path: string) => {
    if (!hashes.has(path)) hashes.set(path, createHash('sha256').update(await readFile(new URL(`../${path}`, import.meta.url))).digest('hex'));
    return hashes.get(path);
  };
  for (const model of audit.models) {
    assert.ok(model.minCentrelineGap > .00399 && model.maxCentrelineGap < .00401, model.id);
    assert.ok(model.matchedShippingVertices >= 8, model.id);
    const current = model.id === replacement.id ? replacement : model;
    assert.equal(await hash(current.source), current.sourceSha256, model.id);
    const pack = model.id.startsWith('extra-mile-') ? 'extra-mile' : model.id.startsWith('leaf-') ? 'leaf' : model.source.includes('/second-wind/') ? 'second-wind' : null;
    assert.equal(await hash(pack ? `public/models/${pack}/${model.id}.glb` : 'public/models/toy-racers.glb'), current.glbSha256, model.id);
  }
  assert.equal(audit.models.find((model: { id: string }) => model.id === 'extra-mile-thief').eyePairs, 1);
});
