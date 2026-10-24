import { test, expect } from '@playwright/test';
import { createApplication } from '../../src/server/index.js';
import { createGame, resolveTasks } from '../../src/engine/index.js';
import { pawnWorldPoint } from '../../src/client/scene/camera.js';

let app: ReturnType<typeof createApplication>, url: string;
test.beforeAll(async () => {
  app = createApplication(':memory:');
  await new Promise<void>(resolve => app.http.listen(0, '127.0.0.1', resolve));
  const address = app.http.address(); if (!address || typeof address === 'string') throw Error('No test address');
  url = `http://127.0.0.1:${address.port}`;
});
test.afterAll(async () => { await app.close(); });

for (const [from, to, unavailable] of [[18, 22, false], [24, 27, false], [20, 23, true]] as const) test(`Whirly ${from}-${to}: ${unavailable ? 'missing model keeps the board playable' : 'Blender model supports a real portal arrival, crowd and refresh'}`, async ({ page }, info) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  if (!unavailable) page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  let requests = 0;
  await page.route('**/models/tracks/whirly-world.glb*', async route => { requests++; if (unavailable) await route.abort(); else await route.continue(); });
  const made = app.rooms.create('漩涡模型检查', 3, 0), code = made.identity.roomCode;
  app.rooms.join(code, '端点选手甲'); app.rooms.join(code, '端点选手乙');
  const room = app.rooms.get(code), game = createGame(room.game.players, 731);
  game.phase = 'race'; game.round = 1; game.track = 'whirly-world'; game.currentRacerId = 'r0'; game.baseTurnOrder = ['r0', 'r1', 'r2'];
  game.racers = game.players.map((player, i) => ({ id: `r${i}`, playerId: player.id, characterId: 'banana', position: i ? to : from - 1, tripped: false, finished: false, eliminated: false, flags: {} }));
  game.flags.testDice = [1]; game.queue = [{ kind: 'beginTurn', racerId: 'r0' }]; resolveTasks(game);
  room.game = game; room.version++; app.store.save(room);
  await page.addInitScript(({ identity, unavailable }) => {
    localStorage.setItem(`magical-athlete:identity:${identity.roomCode}`, JSON.stringify(identity));
    for (const [key, value] of Object.entries({ 'reduced-motion': 'true', 'low-quality': String(unavailable), muted: 'true' })) localStorage.setItem(`magical-athlete:${key}`, value);
  }, { identity: made.identity, unavailable });
  await page.setViewportSize({ width: 1280, height: 900 }); await page.goto(`${url}/room/${code}`);
  const board = page.getByTestId('board-3d'); await expect(board).toBeVisible();
  await expect.poll(() => requests).toBeGreaterThan(0);
  await expect(board).toHaveAttribute('data-track-model', unavailable ? 'procedural' : 'whirly-world');
  await page.getByTestId('roll-button').click();
  await expect.poll(() => app.rooms.get(code).game.racers[0]!.position).toBe(to);
  await expect(page.locator('[data-testid="scene-racer"][data-racer-id="r0"]')).toHaveAttribute('data-position', String(to));
  expect(app.rooms.get(code).game.logs.filter(log => log.cause === 'track-whirl')).toHaveLength(1);
  for (const compact of [false, true]) {
    if (compact) await page.setViewportSize({ width: 390, height: 844 });
    const state = app.rooms.get(code).game;
    for (const racer of state.racers) {
      const expected = pawnWorldPoint(racer, state.racers, racer.position, compact, state.track);
      const label = board.locator(`.pawn-seat[data-racer-id="${racer.id}"]`);
      await expect.poll(async () => Number(await label.getAttribute('data-world-x'))).toBeCloseTo(expected[0], 3);
      await expect.poll(async () => Number(await label.getAttribute('data-world-z'))).toBeCloseTo(expected[2], 3);
    }
    await expect(board.locator('.scene-fallback')).toHaveCount(0);
    if (!unavailable) await board.screenshot({ path: info.outputPath(`whirly-${from}-${to}-crowd-${compact ? 'mobile' : 'desktop'}.png`) });
  }
  const randoms = app.rooms.get(code).game.randomLog.length;
  await page.reload(); await expect(board).toHaveAttribute('data-track-model', unavailable ? 'procedural' : 'whirly-world');
  await expect(page.locator('[data-testid="scene-racer"][data-racer-id="r0"]')).toHaveAttribute('data-position', String(to));
  expect(app.rooms.get(code).game.randomLog.length).toBe(randoms);
  expect(errors).toEqual([]);
});
