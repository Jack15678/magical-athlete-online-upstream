import { test, expect } from '@playwright/test';
import { createApplication } from '../../src/server/index.js';
import { createGame } from '../../src/engine/index.js';
import { boardPoint, trackNodeIds } from '../../src/client/scene/math.js';
import type { TrackId } from '../../src/shared/tracks.js';

let app: ReturnType<typeof createApplication>, url: string;
test.beforeAll(async () => {
  app = createApplication(':memory:');
  await new Promise<void>(resolve => app.http.listen(0, '127.0.0.1', resolve));
  const address = app.http.address(); if (!address || typeof address === 'string') throw Error('No test address');
  url = `http://127.0.0.1:${address.port}`;
});
test.afterAll(async () => { await app.close(); });

const courses: { track: TrackId; reversed?: boolean }[] = [
  { track: 'squiggle' }, { track: 'boardwalks' }, { track: 'bridges' }, { track: 'twisty-twirl' }, { track: 'twisty-twirl', reversed: true },
];
for (const { track, reversed = false } of courses) test(`${track}${reversed ? ' Mirror' : ''} actual 3D course, mobile rotation and overview`, async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  const made = app.rooms.create('地图检查', 2, 0), code = made.identity.roomCode;
  app.rooms.join(code, '另一名选手');
  const room = app.rooms.get(code), game = createGame(room.game.players, 731);
  game.phase = 'race'; game.round = 1; game.track = track; game.currentRacerId = 'r0'; game.baseTurnOrder = ['r0', 'r1'];
  const positions = track === 'boardwalks' ? [31, 50] : track === 'bridges' ? [3, 8] : [19, 23];
  game.racers = game.players.map((player, i) => ({ id: `r${i}`, playerId: player.id, characterId: 'coach', position: positions[i]!, tripped: false, finished: false, eliminated: false, flags: { awaitRoll: true } }));
  if (track === 'twisty-twirl') game.flags.twist = { triggered: true, deck: [], drawn: ['alchemy-lab', 'pinata'], chips: [10, 20], monster: { position: 7 } };
  if (reversed) game.flags.twistReversed = true;
  room.game = game; room.version++; app.store.save(room);
  await page.addInitScript(identity => {
    localStorage.setItem(`magical-athlete:identity:${identity.roomCode}`, JSON.stringify(identity));
    for (const [key, value] of Object.entries({ 'reduced-motion': 'true', 'low-quality': 'true', muted: 'true' })) localStorage.setItem(`magical-athlete:${key}`, value);
  }, made.identity);
  await page.setViewportSize({ width: 1280, height: 900 }); await page.goto(`${url}/room/${code}`);
  const board = page.getByTestId('board-3d'); await expect(board).toBeVisible();
  await expect(board).toHaveAttribute('data-track', track); await expect(board).toHaveAttribute('data-node-count', String(trackNodeIds(track).length));
  if (track === 'twisty-twirl') {
    await expect(board).toHaveAttribute('data-twist-boundary', '13-14');
    await expect(board).toHaveAttribute('data-neutral-monster', '7');
    await expect(board).toHaveAttribute('data-twist-chips', '10,20');
  }
  for (const compact of [false, true]) {
    if (compact) await page.setViewportSize({ width: 390, height: 844 });
    await board.getByRole('button', { name: '总览', exact: true }).click();
    await expect(board).toHaveAttribute('data-camera-state', 'overview');
    for (let i = 0; i < positions.length; i++) {
      const expected = boardPoint(positions[i]!, compact, track), label = board.locator(`.pawn-seat[data-racer-id="r${i}"]`);
      await expect.poll(async () => Number(await label.getAttribute('data-world-x'))).toBeCloseTo(expected[0], 3);
      await expect.poll(async () => Number(await label.getAttribute('data-world-z'))).toBeCloseTo(expected[2], 3);
      await expect.poll(async () => Number(await label.getAttribute('data-world-y'))).toBeCloseTo(expected[1] + .005, 3);
    }
    await expect(board.locator('.scene-fallback')).toHaveCount(0);
    const minimap = board.getByTestId('board-minimap');
    await expect(minimap.locator('[data-map-node="0"] text')).toHaveText(reversed ? '终点' : '起点');
    await expect(minimap.locator('[data-map-node="30"] text')).toHaveText(reversed ? '起点' : '终点');
    if (reversed) await expect(minimap).toContainText('反向赛道');
    const positionLabel = board.getByTestId('minimap-own-position');
    expect(await positionLabel.locator('strong').evaluate(element => element.getBoundingClientRect().right <= element.closest('.minimap-own-position')!.getBoundingClientRect().right)).toBe(true);
    if (track === 'boardwalks') await expect(positionLabel).toContainText('距终点 23 格');
    await board.screenshot({ path: info.outputPath(`${track}-${compact ? 'mobile' : 'desktop'}.png`) });
    await board.getByRole('button', { name: '自己', exact: true }).click();
    await expect(board).toHaveAttribute('data-camera-state', 'self');
    const ownPoint = boardPoint(positions[0]!, compact, track);
    await expect.poll(async () => Number(await board.getAttribute('data-camera-x'))).toBeCloseTo(ownPoint[0], 1);
    await expect.poll(async () => Number(await board.getAttribute('data-camera-z'))).toBeCloseTo(ownPoint[2], 1);
  }
  expect(errors).toEqual([]);
});

test('setup exposes real new-map thumbnails and the schedule character restriction', async ({ page }) => {
  await page.goto(url); await page.getByRole('tab', { name: '创建房间', exact: true }).click();
  await page.getByRole('button', { name: '修改经典赛赛程', exact: true }).click();
  await page.getByRole('button', { name: '添加 Boardwalks', exact: true }).click();
  await expect(page.locator('.map-options svg[data-track="boardwalks"]')).toHaveAttribute('data-node-count', '59');
  await expect(page.locator('.rotation-list')).toContainText('Boardwalks');
  await expect(page.getByRole('note').filter({ hasText: '此赛程禁用' })).toContainText('弯道');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
});
