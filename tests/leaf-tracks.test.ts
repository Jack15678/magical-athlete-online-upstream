import test from 'node:test';
import assert from 'node:assert/strict';
import { LEAF_TRACKS } from '../src/shared/leaf-tracks.js';
import { nextTrackNodes, passesTrackSpace, sharedTrackSpace, trackDistance } from '../src/shared/track-topology.js';

test('Squiggle preserves every printed signed star, trip and arrow (PDF pp. 1-2)', () => {
  const { specials } = LEAF_TRACKS.squiggle;
  assert.deepEqual(Object.entries(specials).filter(([, value]) => value.kind === 'star').map(([node, value]) => [Number(node), value.points]), [
    [1, 1], [6, -2], [8, 1], [13, -1], [19, 1], [21, 1], [23, -3], [28, -1], [29, 2],
  ]);
  assert.deepEqual(Object.entries(specials).filter(([, value]) => value.kind === 'trip').map(([node]) => Number(node)), [5, 17, 26]);
  assert.deepEqual(Object.entries(specials).filter(([, value]) => value.kind === 'arrow'), [['14', { kind: 'arrow', move: 1 }]]);
  assert.equal(Object.keys(specials).length, 13);
});

test('Boardwalks preserves all fork/merge choices in both directions (PDF p. 3)', () => {
  const track = LEAF_TRACKS.boardwalks;
  assert.deepEqual(nextTrackNodes(track, 8), [9, 31]);
  assert.deepEqual(nextTrackNodes(track, 17), [18, 37]);
  assert.deepEqual(nextTrackNodes(track, 18), [19, 50]);
  assert.deepEqual(nextTrackNodes(track, 13, -1), [12, 36]);
  assert.deepEqual(nextTrackNodes(track, 24, -1), [23, 49]);
  assert.deepEqual(nextTrackNodes(track, 26, -1), [25, 58]);
  assert.deepEqual(nextTrackNodes(track, 30), []);
  assert.deepEqual(nextTrackNodes(track, 0, -1), []);
  const routes: number[] = [];
  const walk = (node: number, steps: number) => {
    if (node === 30) { routes.push(steps); return; }
    assert.ok(steps < 60, 'the source routes have no forward cycle');
    for (const next of nextTrackNodes(track, node)) walk(next, steps + 1);
  };
  walk(0, 0);
  assert.deepEqual(routes.sort((a, b) => a - b), [30, 32, 32, 34, 37, 39]);
});

test('Boardwalks all 57 physical cells match the author remaining-distance diagram (PDF p. 3)', () => {
  const track = LEAF_TRACKS.boardwalks;
  // Main shortest route, then upper-left, lower and upper-right detours.
  const diagram: [number[], number[]][] = [
    [Array.from({ length: 29 }, (_, i) => i + 1), [29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]],
    [[31, 32, 33, 34, 35, 36], [23, 22, 21, 20, 19, 18]],
    [[37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], [19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7]],
    [[50, 51, 52, 53, 54, 55, 56, 57, 58], [13, 12, 11, 10, 9, 8, 7, 6, 5]],
  ];
  let checked = 0;
  for (const [nodes, distances] of diagram) nodes.forEach((node, i) => {
    assert.equal(track.remaining[node], distances[i], `printed distance for node ${node}`);
    assert.equal(trackDistance(track, node, 30), distances[i], `graph distance for node ${node}`);
    checked++;
  });
  assert.equal(checked, 57);
  assert.equal(track.remaining[0], 30);
  assert.equal(track.remaining[30], 0);
  assert.equal(track.remaining[7], track.remaining[31]);
  assert.equal(sharedTrackSpace(track, 7, 31), false, 'equal rank on separate lanes is not sharing');
  assert.equal(passesTrackSpace(track, 7, 31), false, 'equal rank on separate lanes is not passing');
  assert.equal(trackDistance(track, 7, 31), 2);
  assert.equal(trackDistance(track, 31, 7), Infinity, 'no forward lane switching');
  assert.equal(trackDistance(track, 31, 7, -1), 2);
});

test('Boardwalks effects include every detour and the continuous trip lane (PDF pp. 1-2)', () => {
  const { specials } = LEAF_TRACKS.boardwalks;
  assert.deepEqual(Object.entries(specials).filter(([, value]) => value.kind === 'trip').map(([node]) => Number(node)), [6, 10, 16, 19, 20, 21, 22, 23]);
  assert.deepEqual(Object.entries(specials).filter(([, value]) => value.kind === 'star').map(([node, value]) => [Number(node), value.points]), [[1, 1], [37, 1], [47, 1], [49, 1]]);
  assert.deepEqual(Object.entries(specials).filter(([, value]) => value.kind === 'arrow').map(([node, value]) => [Number(node), value.move]), [[9, 1], [18, -1], [32, -1], [46, -2], [48, 2], [50, -2], [56, -3]]);
});

test('Bridges sharing is symmetric, passing is upper-to-lower only, movement remains numerical (PDF p. 3)', () => {
  const track = LEAF_TRACKS.bridges;
  assert.deepEqual(track.bridges, [[3, 8], [10, 13], [15, 18], [20, 23]]);
  for (const [upper, lower] of track.bridges!) {
    assert.equal(sharedTrackSpace(track, upper, lower), true);
    assert.equal(sharedTrackSpace(track, lower, upper), true);
    assert.equal(passesTrackSpace(track, upper, lower), true);
    assert.equal(passesTrackSpace(track, lower, upper), false);
    assert.equal(passesTrackSpace(track, upper, upper), true);
    assert.equal(passesTrackSpace(track, lower, lower), true);
    assert.deepEqual(nextTrackNodes(track, upper), [upper + 1]);
    assert.deepEqual(nextTrackNodes(track, lower), [lower + 1]);
    assert.equal(trackDistance(track, upper, lower), lower - upper);
    assert.notEqual(track.remaining[upper], track.remaining[lower], 'opposite layers do not tie for lead');
    assert.equal(track.nodes[upper]!.x, track.nodes[lower]!.x);
    assert.equal(track.nodes[upper]!.z, track.nodes[lower]!.z);
    assert.ok(track.nodes[upper]!.y! > track.nodes[lower]!.y!, 'source upper layer is visibly elevated');
  }
  assert.equal(sharedTrackSpace(track, 3, 13), false);
  assert.equal(passesTrackSpace(track, 3, 13), false);
  assert.deepEqual(track.specials, {});
});

test('Bridges relations retain the FAQ distinctions for Banana, Huge Baby, Leaptoad and Third Wheel', () => {
  const track = LEAF_TRACKS.bridges;
  // Upper racer goes 2 -> 3 -> 4, passing lower racer at 8 although ending numerically behind it.
  assert.equal(passesTrackSpace(track, 3, 8), true);
  assert.ok(4 < 8);
  // Huge Baby/Leaptoad sharing includes either layer; retreat/jump still follows numerical route.
  const displaced = [3, 8].filter(node => sharedTrackSpace(track, 3, node)).map(node => nextTrackNodes(track, node, -1)[0]);
  assert.deepEqual(displaced, [2, 7]);
  assert.deepEqual(nextTrackNodes(track, 3), [4]);
  assert.deepEqual(nextTrackNodes(track, 8), [9]);
  // Third Wheel may select either of the paired racers' exact positions.
  assert.deepEqual([3, 8].filter(node => sharedTrackSpace(track, 3, node)), [3, 8]);
});

test('every drawn node has finite coordinates and all legal routes stay on the map', () => {
  for (const track of Object.values(LEAF_TRACKS)) {
    assert.deepEqual(Object.keys(track.nodes).sort(), Object.keys(track.edges).sort());
    assert.deepEqual(Object.keys(track.nodes).sort(), Object.keys(track.remaining).sort());
    for (const [node, targets] of Object.entries(track.edges)) {
      const point = track.nodes[Number(node)]!;
      assert.ok(Number.isFinite(point.x) && Number.isFinite(point.z), `${track.id}:${node}`);
      for (const target of targets) assert.ok(track.nodes[target], `${track.id}:${node} -> ${target}`);
      assert.ok(Number.isFinite(trackDistance(track, 0, Number(node))), `${track.id}:${node} reachable from start`);
      assert.ok(Number.isFinite(trackDistance(track, Number(node), 30)), `${track.id}:${node} can finish`);
    }
  }
  assert.equal(Object.keys(LEAF_TRACKS.squiggle.nodes).length, 31);
  assert.equal(Object.keys(LEAF_TRACKS.boardwalks.nodes).length, 59);
  assert.equal(Object.keys(LEAF_TRACKS.bridges.nodes).length, 31);
});

test('unsupported corner rules use no invented positional cutoff', () => {
  for (const id of ['squiggle', 'boardwalks'] as const) {
    assert.equal(LEAF_TRACKS[id].firstCorner, -1);
    assert.equal(LEAF_TRACKS[id].secondCorner, -1);
    assert.deepEqual(LEAF_TRACKS[id].blockedCharacters, ['blimp', 'gloth', 'nepo-baby']);
    assert.equal(LEAF_TRACKS[id].cornerRules.first, 'unsupported');
    assert.equal(LEAF_TRACKS[id].cornerRules.second, 'unsupported');
  }
  assert.equal(LEAF_TRACKS.bridges.firstCorner, -1);
  assert.deepEqual(LEAF_TRACKS.bridges.blockedCharacters, ['nepo-baby']);
  assert.equal(LEAF_TRACKS.bridges.secondCorner, 15);
  assert.equal(LEAF_TRACKS.bridges.cornerRules.second, 'source');
});
