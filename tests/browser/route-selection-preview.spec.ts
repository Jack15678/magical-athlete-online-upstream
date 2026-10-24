import { test, expect, type Page } from '@playwright/test';
import { createApplication } from '../../src/server/index.js';
import { createGame, resolveTasks } from '../../src/engine/index.js';
import { createMatchPlan } from '../../src/shared/competition.js';
import { TRACKS, type TrackId } from '../../src/shared/tracks.js';
import type { Identity, Room } from '../../src/shared/types.js';

let app: ReturnType<typeof createApplication>, url: string;
test.beforeAll(async () => {
  app = createApplication(':memory:');
  await new Promise<void>(resolve => app.http.listen(0, '127.0.0.1', resolve));
  const address = app.http.address();
  if (!address || typeof address === 'string') throw Error('Missing test server address');
  url = `http://127.0.0.1:${address.port}`;
});
test.afterAll(async () => { await app.close(); });

async function identify(page: Page, identity: Identity) {
  await page.addInitScript(saved => {
    localStorage.setItem(`magical-athlete:identity:${saved.roomCode}`, JSON.stringify(saved));
    localStorage.setItem('magical-athlete:muted', 'true');
    localStorage.setItem('magical-athlete:low-quality', 'true');
    localStorage.setItem('magical-athlete:reduced-motion', 'true');
    localStorage.setItem('magical-athlete:animation-speed', '4');
  }, identity);
}

function publish(room: Room) {
  room.version = Math.max(room.version, app.rooms.get(room.code).version) + 1;
  app.rooms.rooms.set(room.code, room);
  app.store.save(room);
  for (const socket of app.io.sockets.sockets.values()) {
    if (socket.data.identity?.roomCode === room.code) socket.emit('snapshot', app.rooms.view(room, socket.data.identity.playerId));
  }
}

async function noHorizontalOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
}

async function routeArrowsAreClickable(page: Page) {
  const arrows = page.locator('.route-arrow');
  await expect(arrows).toHaveCount(2);
  for (const arrow of await arrows.all()) {
    await expect.poll(() => arrow.evaluate(element => {
      const rect = element.getBoundingClientRect();
      return rect.width >= 44 && rect.height >= 44 && rect.left >= 0 && rect.right <= innerWidth
        && rect.top >= 0 && rect.bottom <= innerHeight
        && document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2)?.closest('button') === element;
    })).toBe(true);
  }
}

test('Boardwalks keeps the authoritative dice visible through route selection, mobile resize and refresh', async ({ page }, info) => {
  const made = app.rooms.create('岔路选手', 2, 0), code = made.identity.roomCode;
  app.rooms.join(code, '岔路观察');
  const room = app.rooms.get(code), game = createGame(room.game.players, 731);
  game.phase = 'race'; game.round = 1; game.track = 'boardwalks';
  game.currentRacerId = 'r0'; game.baseTurnOrder = ['r0', 'r1'];
  game.racers = game.players.map((player, index) => ({
    id: `r${index}`, playerId: player.id, characterId: index ? 'coach' : 'banana',
    position: index ? 0 : 8, tripped: false, finished: false, eliminated: false, flags: {},
  }));
  game.flags.testDice = [3]; game.queue = [{ kind: 'beginTurn', racerId: 'r0' }];
  resolveTasks(game); room.game = game; publish(room);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await identify(page, made.identity);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${url}/room/${code}`);
  await page.addLocatorHandler(page.getByTestId('skip-animation'), async skip => {
    await skip.evaluateAll(buttons => (buttons[0] as HTMLButtonElement | undefined)?.click());
  });
  await expect(page.getByTestId('roll-button')).toBeEnabled();
  await page.getByTestId('roll-button').click();
  const panel = page.getByRole('region', { name: '选择路线', exact: true });
  await expect(panel).toBeVisible();
  const confirmed = app.rooms.get(code).game;
  expect(confirmed.pending?.kind).toBe('track-branch');
  expect(confirmed.lastRoll).toEqual({ racerId: 'r0', face: 3, distance: 3 });
  const draws = confirmed.randomLog.length;
  const choiceId = confirmed.pending!.id;
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 667 }]) {
    await page.setViewportSize(viewport);
    await expect(panel.getByTestId('dice-value')).toContainText('骰面 3');
    await expect(panel.getByTestId('dice-value')).toContainText('主移动 3 格');
    const box = await panel.getByTestId('dice-value').boundingBox();
    expect(box).not.toBeNull(); expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    await noHorizontalOverflow(page);
    await routeArrowsAreClickable(page);
  }
  await page.screenshot({ path: info.outputPath('route-dice-mobile.png') });
  await page.reload();
  await expect(panel.getByTestId('dice-value')).toContainText('骰面 3');
  await expect(panel.getByTestId('dice-value')).toContainText('主移动 3 格');
  expect(app.rooms.get(code).game.pending!.id).toBe(choiceId);
  expect(app.rooms.get(code).game.randomLog).toHaveLength(draws);
  await routeArrowsAreClickable(page);
  await page.getByTestId('route-arrow-31').click();
  await expect(panel).toHaveCount(0);
  await expect.poll(() => app.rooms.get(code).game.racers[0]!.position).toBe(33);
  expect(app.rooms.get(code).game.randomLog).toHaveLength(draws);
  expect(errors).toEqual([]);
});

test('selection previews every current track, updates next round, fits phones and preserves private character selection', async ({ page, browser }, info) => {
  const made = app.rooms.create('选角选手', 2, 0), code = made.identity.roomCode;
  app.rooms.join(code, '选角对手');
  const spectator = app.rooms.join(code, '地图观众', 'spectator');
  const room = app.rooms.get(code), game = createGame(room.game.players, 731);
  game.phase = 'selection'; game.round = 1; game.track = 'mild';
  // The saved current track wins over a future schedule or a parity guess.
  game.matchPlan = createMatchPlan();
  game.players[0]!.hand = ['banana', 'coach', 'legs', 'alchemist'];
  game.players[1]!.hand = ['romantic', 'genius', 'gunk', 'skipper'];
  room.game = game; publish(room);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await identify(page, made.identity);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${url}/room/${code}`);
  await expect(page.locator('.connection.is-online')).toBeVisible();
  const preview = page.getByTestId('selection-track-preview');
  for (const track of Object.keys(TRACKS) as TrackId[]) {
    const current = app.rooms.get(code); current.game.track = track; publish(current);
    await expect(preview).toHaveAttribute('data-track', track);
    await expect(preview).toContainText(TRACKS[track].name);
    await expect(preview).toContainText('第 1 场');
    const svg = preview.locator('svg.track-thumbnail');
    await expect(svg).toHaveAttribute('data-track', track);
    await expect(svg).toHaveAttribute('data-node-count', track === 'boardwalks' ? '59' : '31');
    await expect(svg.locator('[data-map-node]')).toHaveCount(track === 'boardwalks' ? 59 : 31);
    await expect(svg.locator('[data-map-node="0"]')).toContainText('起');
    await expect(svg.locator('[data-map-node="30"]')).toContainText('终');
    if (track === 'wild') await expect(svg.locator('[data-map-node="5"]')).toContainText('!');
    if (track === 'squiggle') await expect(svg.locator('[data-map-node="23"]')).toContainText('-3');
    if (track === 'whirly-world') await expect(svg.locator('[data-map-node] text').filter({ hasText: '↪' })).toHaveCount(12);
    if (track === 'twisty-twirl') await expect(svg.locator('[data-twist-boundary="13-14"]')).toHaveCount(1);
  }
  const next = app.rooms.get(code); next.game.round = 2; next.game.track = 'boardwalks'; publish(next);
  await expect(preview).toContainText('第 2 场');
  await expect(preview).toHaveAttribute('data-track', 'boardwalks');
  await page.reload();
  await expect(preview).toContainText('第 2 场');
  await expect(preview.locator('svg')).toHaveAttribute('data-node-count', '59');
  for (const viewport of [{ width: 390, height: 844 }, { width: 320, height: 667 }]) {
    await page.setViewportSize(viewport); await expect(preview).toBeVisible();
    const box = await preview.boundingBox(); expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0); expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    await noHorizontalOverflow(page);
  }
  await page.screenshot({ path: info.outputPath('selection-preview-mobile.png'), fullPage: true });
  const picks = page.locator('.hand-selection .character-pick');
  await expect(picks).toHaveCount(4); await picks.nth(0).click(); await picks.nth(1).click();
  await page.getByRole('button', { name: '锁定上场角色', exact: true }).click();
  await expect.poll(() => app.rooms.get(code).game.players[0]!.selection).toEqual(['banana', 'coach']);
  await expect(preview).toHaveAttribute('data-track', 'boardwalks');
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const observer = await context.newPage(); observer.on('pageerror', error => errors.push(error.message));
    await identify(observer, spectator.identity); await observer.goto(`${url}/room/${code}`);
    await expect(observer.getByTestId('selection-track-preview')).toHaveAttribute('data-track', 'boardwalks');
    await expect(observer.locator('.hand-selection .character-card')).toHaveCount(0);
    await expect(observer.getByRole('button', { name: '锁定上场角色', exact: true })).toHaveCount(0);
    await noHorizontalOverflow(observer);
  } finally { await context.close(); }
  expect(errors).toEqual([]);
});
