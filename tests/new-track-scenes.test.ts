import test from 'node:test';
import assert from 'node:assert/strict';
import { TRACKS } from '../src/shared/tracks.js';
import { boardPoint, TILE, trackConnections, trackMovementDistance, trackNodeIds, trackSvgLayout } from '../src/client/scene/math.js';
import { cameraFrame, cameraProject, choiceFocus, pawnOccupancy, pawnWorldPoint } from '../src/client/scene/camera.js';
import { pawnRoute } from '../src/client/scene/pawn-motion.js';
import type { Racer, RoomView } from '../src/shared/types.js';

const racer = (id: string, position: number): Racer => ({ id, playerId: id, characterId: 'coach', position, tripped: false, finished: false, eliminated: false, flags: {} });

for (const track of ['squiggle', 'boardwalks', 'bridges'] as const) {
  test(`${track} scene uses every source node with the same rigid mobile rotation`, () => {
    for (const id of trackNodeIds(track)) {
      const point = TRACKS[track].nodes![id]!, desktop = boardPoint(id, false, track), compact = boardPoint(id, true, track);
      assert.deepEqual(desktop, [point.x * TILE, .22 + (point.y ?? 0) * TILE, point.z * TILE]);
      assert.deepEqual(compact, [-desktop[2], desktop[1], desktop[0]]);
    }
    const layout = trackSvgLayout(track, 320, 110);
    for (const id of layout.nodes) {
      const point = layout.point(id);
      assert.ok(point.x >= 13.99 && point.x <= 306.01 && point.y >= 13.99 && point.y <= 96.01);
    }
  });

  test(`${track} overview camera includes the full course and raised pawns in both viewports`, () => {
    for (const [width, height, compact] of [[1280, 900, false], [390, 844, true]] as const) {
      const frame = cameraFrame([], compact, width, height, true, undefined, false, track);
      for (const id of trackNodeIds(track)) {
        const point = boardPoint(id, compact, track);
        for (const y of [point[1], point[1] + 2.65]) {
          const projected = cameraProject([point[0] - frame.x, y, point[2] - frame.z], compact);
          assert.ok(Math.abs(projected.x * frame.zoom) < width / 2, `${track}:${id} horizontal fit`);
          assert.ok(Math.abs(projected.y * frame.zoom) < height / 2, `${track}:${id} vertical fit`);
        }
      }
    }
  });
}

test('Boardwalks draws actual forks without connecting unrelated sequential node IDs', () => {
  const edges = trackConnections('boardwalks');
  assert.ok(edges.some(([from, to]) => from === 8 && to === 31));
  assert.ok(edges.some(([from, to]) => from === 36 && to === 13));
  assert.ok(!edges.some(([from, to]) => from === 30 && to === 31));
  assert.ok(!edges.some(([from, to]) => from === 36 && to === 37));
  assert.equal(trackMovementDistance('boardwalks', [8, 31, 32]), 2);
  assert.equal(trackMovementDistance('boardwalks', [13, 36, 35]), -2);
  assert.equal(trackMovementDistance('boardwalks', [36, 13, 14]), 2);
  assert.notDeepEqual(boardPoint(31, false, 'boardwalks'), boardPoint(30, false, 'boardwalks'));
  const racers = [racer('a', 31), racer('b', 50)];
  assert.equal(pawnOccupancy(racers[0]!, racers, 31, false, 'boardwalks').scale, 1.65);
  assert.equal(pawnOccupancy(racers[1]!, racers, 50, false, 'boardwalks').scale, 1.65);
});

test('Twisty Twirl uses the original U route with its trigger on the 13-to-14 edge', () => {
  assert.deepEqual(TRACKS['twisty-twirl'].twistBoundary, { before: 13, after: 14 });
  for (const compact of [false, true]) for (let position = 0; position <= 30; position++) {
    assert.deepEqual(boardPoint(position, compact, 'twisty-twirl'), boardPoint(position, compact, 'mild'));
  }
  assert.equal(trackMovementDistance('twisty-twirl', [15, 14, 13], true), 2, 'Mirror forward movement follows the reversed race direction');
  assert.equal(trackMovementDistance('twisty-twirl', [13, 14, 15], true), -2);
});

test('a Boardwalks branch prompt frames both legal lanes, including node IDs above 30', () => {
  const racers = [racer('a', 8)], room = {
    code: 'BRANCH', version: 1, hostId: 'a', selfId: 'a', maxPlayers: 2, timeoutSeconds: 0, deadline: null,
    phase: 'race', round: 1, track: 'boardwalks', players: [], racers, currentRacerId: 'a', logs: [], results: [], rulesStatus: 'test',
    pending: { id: 'branch', kind: 'track-branch', playerId: 'a', racerId: 'a', title: '选路', optional: false, options: [{ id: '9', label: '内侧' }, { id: '31', label: '外侧' }] },
  } as RoomView;
  assert.deepEqual(choiceFocus(room, racers)?.positions, [8, 9, 31]);
});

test('Bridges pawn routes preserve height and numerically distinct layers have no crowd offset', () => {
  const racers = [racer('upper', 3), racer('lower', 8)];
  const upper = pawnWorldPoint(racers[0]!, racers, 3, false, 'bridges'), lower = pawnWorldPoint(racers[1]!, racers, 8, false, 'bridges');
  assert.equal(upper[0], lower[0]); assert.equal(upper[2], lower[2]); assert.ok(upper[1] - lower[1] > 3);
  const route = pawnRoute([2, 3, 4].map(position => boardPoint(position, false, 'bridges')));
  assert.ok(route.points[1]!.y > route.points[0]!.y + 3);
  assert.ok(Math.abs(route.getPoint(0).y - boardPoint(2, false, 'bridges')[1]) < 1e-10);
  assert.ok(Math.abs(route.getPoint(1).y - boardPoint(4, false, 'bridges')[1]) < 1e-10);
});
