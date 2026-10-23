import { test, expect, type Page } from '@playwright/test';
import { createApplication } from '../../src/server/index.js';
import { createGame, resolveTasks } from '../../src/engine/index.js';
import { ROOM_OWNER_AWAY_MS } from '../../src/shared/room-lifecycle.js';

let app:ReturnType<typeof createApplication>,url:string;
test.beforeAll(async()=>{app=createApplication(':memory:');await new Promise<void>(r=>app.http.listen(0,'127.0.0.1',r));const addr=app.http.address();if(!addr||typeof addr==='string')throw Error('no address');url=`http://127.0.0.1:${addr.port}`;});
test.afterAll(async()=>{await app.close();});

test('Scout main roll is animated once across the teleport choice and confirmed movement',async({page})=>{
  const host=app.rooms.create('童子军',3,0),code=host.identity.roomCode;
  app.rooms.join(code,'对手甲');app.rooms.join(code,'对手乙');
  const room=app.rooms.get(code),g=createGame(room.game.players,42);
  g.phase='race';g.round=1;g.track='mild';g.currentRacerId='r0';g.baseTurnOrder=['r0','r1','r2'];g.flags.testDice=[3];
  g.racers=['extra-mile-scout','legs','blimp'].map((characterId,i)=>({id:`r${i}`,playerId:g.players[i]!.id,characterId,position:[1,20,25][i]!,tripped:false,finished:false,eliminated:false,flags:{}}));
  g.queue=[{kind:'beginTurn',racerId:'r0'}];resolveTasks(g);room.game=g;room.version++;app.store.save(room);
  await page.addInitScript(identity=>{localStorage.setItem(`magical-athlete:identity:${identity.roomCode}`,JSON.stringify(identity));localStorage.setItem('magical-athlete:low-quality','true');localStorage.setItem('magical-athlete:reduced-motion','false');},host.identity);
  await page.goto(`${url}/room/${code}`);await expect(page.getByTestId('roll-button')).toBeEnabled();
  await expect(page.getByTestId('board-3d')).toBeVisible();
  await page.evaluate(()=>{
    const board=document.querySelector('[data-testid="board-3d"]')!;
    const ids=new Set<string>();(window as unknown as {scoutDice:Set<string>}).scoutDice=ids;
    const record=()=>{if(board.getAttribute('data-phase')==='dice')ids.add(board.getAttribute('data-event-ids')!);};
    new MutationObserver(record).observe(board,{attributes:true,attributeFilter:['data-phase','data-event-ids']});
  });
  await page.getByTestId('roll-button').click();await expect(page.getByTestId('skill-choice')).toBeVisible();
  const choice=app.rooms.get(code).game.pending!;await page.getByTestId('skill-choice').getByRole('button',{name:choice.options.find(option=>option.id==='forward')!.label,exact:true}).click();
  await expect(page.locator('[data-testid="scene-racer"][data-racer-id="r0"]')).toHaveAttribute('data-position','5');
  await expect(page.getByTestId('board-3d')).toHaveAttribute('data-phase','idle');
  expect(await page.evaluate(()=>(window as unknown as {scoutDice:Set<string>}).scoutDice.size)).toBe(1);
  expect(app.rooms.get(code).game.randomLog).toHaveLength(1);
});

test('online humans vote across refresh, spectator only watches, current race displays before everyone closes',async({browser},info)=>{
  const host=app.rooms.create('离线房主',3,0),code=host.identity.roomCode;
  const joins=[app.rooms.join(code,'继续甲'),app.rooms.join(code,'继续乙'),app.rooms.join(code,'观众','spectator')];
  const room=app.rooms.get(code),g=createGame(room.game.players,42);
  g.phase='race';g.round=2;g.track='mild';g.currentRacerId='r0';g.baseTurnOrder=['r0','r1','r2'];g.flags.awaitRoll=true;
  g.racers=g.players.map((p,i)=>({id:`r${i}`,playerId:p.id,characterId:'coach',position:10-i,tripped:false,finished:false,eliminated:false,flags:{}}));
  room.game=g;room.version++;app.store.save(room);
  const contexts=await Promise.all(joins.map((_,i)=>browser.newContext({viewport:i===1?{width:390,height:844}:{width:1440,height:900}})));
  const pages:Page[]=[],errors:string[]=[];
  try{
    for(const [i,context] of contexts.entries()){
      await context.addInitScript(identity=>{localStorage.setItem(`magical-athlete:identity:${identity.roomCode}`,JSON.stringify(identity));localStorage.setItem('magical-athlete:reduced-motion','true');localStorage.setItem('magical-athlete:animation-speed','4');localStorage.setItem('magical-athlete:low-quality','true');},joins[i]!.identity);
      const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));pages.push(page);await page.goto(`${url}/room/${code}`);await expect(page.locator('.connection.is-online')).toBeVisible();
    }
    const current=app.rooms.get(code);current.hostLeftAt=Date.now()-ROOM_OWNER_AWAY_MS;app.rooms.expire(code);
    for(const page of pages)await expect(page.getByRole('dialog',{name:'房主已离开，是否继续？'})).toBeVisible();
    await expect(pages[2]!.getByRole('button',{name:'继续比赛',exact:true})).toHaveCount(0);
    await pages[1]!.screenshot({path:info.outputPath('vote-mobile.png'),fullPage:true});
    expect(await pages[1]!.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await pages[0]!.getByRole('button',{name:'继续比赛',exact:true}).click();await pages[0]!.reload();
    await expect(pages[0]!.getByRole('button',{name:'已同意，等待其他人',exact:true})).toBeDisabled();
    expect(app.rooms.get(code).continuation!.stage).toBe('voting');
    await pages[1]!.getByRole('button',{name:'继续比赛',exact:true}).click();
    for(const page of pages)await expect(page.getByRole('dialog',{name:'房主已离开，是否继续？'})).toHaveCount(0);
    expect(app.rooms.get(code).continuation!.stage).toBe('playing');
    // Actual engine finishes and scores this round; no synthetic result screen.
    const playing=app.rooms.get(code);playing.game.flags.awaitRoll=false;playing.game.queue=[{kind:'move',racerId:'r1',distance:30},{kind:'move',racerId:'r2',distance:30}];resolveTasks(playing.game);expect(playing.game.phase).toBe('results');app.rooms.tick();
    for(const page of pages){await expect(page.getByText('本场已结束，结果展示完毕后房间自动解散。', {exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'前往下一场',exact:true})).toHaveCount(0);}
    expect(app.rooms.rooms.has(code)).toBe(true);await pages[0]!.screenshot({path:info.outputPath('current-race-results.png'),fullPage:true});
    await expect.poll(()=>app.rooms.closed(code)?.reason,{timeout:30_000}).toBe('host-away');
    for(const page of pages)await expect(page.getByText('房间已关闭', {exact:true}).first()).toBeVisible();
    expect(errors).toEqual([]);
  }finally{await Promise.all(contexts.map(context=>context.close()));}
});
