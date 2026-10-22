import { test, expect } from '@playwright/test';
import { writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { io } from 'socket.io-client';
import type { ActionEnvelope, ActionReply } from '../../src/shared/types.js';
import { createApplication } from '../../src/server/index.js';
import { createGame, resolveTasks } from '../../src/engine/index.js';

let app:ReturnType<typeof createApplication>,url:string;
test.beforeAll(async()=>{app=createApplication(':memory:');await new Promise<void>(r=>app.http.listen(0,'127.0.0.1',r));const a=app.http.address();if(!a||typeof a==='string')throw Error('address');url=`http://127.0.0.1:${a.port}`;});
test.afterAll(async()=>app.close());

test('three players and spectator see one Fox response across reconnect, with high/low models and failure fallback',async({browser},info)=>{
  const made=app.rooms.create('纳克鲁斯玩家',3,0),code=made.identity.roomCode;
  const joins=[made,app.rooms.join(code,'狐狸玩家'),app.rooms.join(code,'马里奥玩家'),app.rooms.join(code,'观众','spectator')];
  const room=app.rooms.get(code),s=createGame(room.game.players,456,'multiplayer','all');
  s.phase='race';s.round=1;s.currentRacerId='r0';s.flags.awaitRoll=false;
  s.racers=['wurstii-knuckles','extra-mile-mr-fox','wurstii-mario'].map((characterId,i)=>({id:`r${i}`,playerId:s.players[i]!.id,characterId,position:5+i*8,tripped:false,finished:false,eliminated:false,flags:{turnsTaken:1}}));s.baseTurnOrder=['r0','r1','r2'];s.queue=[{kind:'endTurn',racerId:'r0'}];resolveTasks(s);room.game=s;room.version++;app.store.save(room);
  const contexts=await Promise.all(joins.map(()=>browser.newContext({viewport:{width:1280,height:900}})));
  const pages=[];
  try{
    for(const [i,context] of contexts.entries()){
      await context.addInitScript(({identity,low})=>{localStorage.setItem(`magical-athlete:identity:${identity.roomCode}`,JSON.stringify(identity));localStorage.setItem(`magical-athlete:identity:${identity.roomCode}:${identity.role??'player'}`,JSON.stringify(identity));localStorage.setItem('magical-athlete:low-quality',String(low));localStorage.setItem('magical-athlete:animation-speed','4');localStorage.setItem('magical-athlete:reduced-motion','true');localStorage.setItem('magical-athlete:muted','true');},{identity:joins[i]!.identity,low:i!==1});
      // Only the spectator loses one model; the independent SVG portrait still renders.
      if(i===3)await context.route('**/models/wurstii/wurstii-mario.glb*',r=>r.abort());
      const page=await context.newPage();pages.push(page);await page.goto(`${url}/room/${code}`);await expect(page.locator('.connection.is-online')).toBeVisible();
    }
    const [host,fox,other,viewer]=pages;
    await expect(fox!.getByTestId('skill-choice')).toContainText('纳克鲁斯');
    await expect(fox!.getByRole('button',{name:'消耗1次，阻止技能',exact:true})).toBeEnabled();
    for(const page of [host!,other!,viewer!]){
      await expect(page.getByRole('button',{name:'消耗1次，阻止技能',exact:true})).toHaveCount(0);
      await expect(page.locator('body')).toContainText('决定是否阻止技能');
      await expect(page.locator('body')).toContainText('狐狸玩家');
    }
    const choiceId=app.rooms.get(code).game.pending!.id;
    await fox!.reload();await expect(fox!.locator('.connection.is-online')).toBeVisible();
    expect(app.rooms.get(code).game.pending!.id).toBe(choiceId);
    await fox!.getByRole('button',{name:'消耗1次，阻止技能',exact:true}).click();
    await expect.poll(()=>app.rooms.get(code).game.racers[1]!.flags.foxUsed).toBe(1);
    for(const page of pages){await expect(page.getByTestId('skill-choice')).toHaveCount(0);await expect(page.getByTestId('board-3d')).toHaveAttribute('data-phase','idle');}
    expect(app.rooms.get(code).game.currentRacerId).toBe('r1');expect(app.rooms.get(code).game.racers[0]!.flags.wurstiiExtraTurns??0).toBe(0);
    for(const page of [host!,fox!]){await expect(page.getByTestId('board-3d')).toHaveAttribute('data-loaded-models','3');await expect(page.getByTestId('board-3d')).toHaveAttribute('data-model-fallbacks','0');}
    await expect(viewer!.getByTestId('board-3d')).toHaveAttribute('data-model-fallbacks','1');
    await expect(viewer!.locator('img[src*="wurstii-mario.webp"]')).toHaveCount(0);
    await expect(viewer!.locator('.floating-racers svg.avatar')).toHaveCount(3);
    await expect(viewer!.locator('.floating-racer[aria-label^="马力欧"] svg.avatar')).toBeVisible();
    await viewer!.screenshot({path:info.outputPath('spectator-fallback.png')});
    await fox!.reload();await expect(fox!.getByTestId('skill-choice')).toHaveCount(0);expect(app.rooms.get(code).game.racers[1]!.flags.foxUsed).toBe(1);
    // An actual second authenticated socket retries the SAME response envelope.
    const latest=app.rooms.get(code),game=latest.game;game.currentRacerId='r0';game.flags.needsBegin=false;game.flags.awaitRoll=false;
    game.racers[0]!.characterId='wurstii-simon-belmont';game.racers[0]!.position=5;game.queue=[{kind:'endTurn',racerId:'r0'}];resolveTasks(game);latest.version++;app.store.save(latest);
    for(const socket of app.io.sockets.sockets.values())if(socket.data.identity?.roomCode===code)socket.emit('snapshot',app.rooms.view(latest,socket.data.identity.playerId));
    await expect(fox!.getByTestId('skill-choice')).toContainText('西蒙');
    const socket=io(url,{auth:joins[1]!.identity,transports:['websocket']});
    try{
      await new Promise<void>((resolve,reject)=>{socket.once('connect',resolve);socket.once('connect_error',reject);});
      const envelope:ActionEnvelope={actionId:randomUUID(),expectedVersion:app.rooms.get(code).version,action:{type:'choose',choiceId:game.pending!.id,optionId:'allow'}};
      const submit=()=>new Promise<ActionReply>((resolve,reject)=>socket.timeout(6500).emit('action',envelope,(error:Error|null,reply:ActionReply)=>error?reject(error):resolve(reply)));
      expect((await submit()).ok).toBe(true);await expect.poll(()=>app.rooms.get(code).game.flags.awaitRoll).toBe(true);
      const count=app.rooms.get(code).game.racers[0]!.flags.turnsTaken;
      expect((await submit()).duplicate).toBe(true);expect(app.rooms.get(code).game.racers[0]!.flags.turnsTaken).toBe(count);
      expect(app.rooms.get(code).game.currentRacerId).toBe('r0');expect(app.rooms.get(code).game.racers[1]!.flags.foxUsed).toBe(1);
      for(const page of pages)await expect(page.getByTestId('skill-choice')).toHaveCount(0);
      await expect(host!.getByTestId('roll-button')).toBeEnabled();await expect(fox!.getByTestId('roll-button')).toBeDisabled();
    }finally{socket.disconnect();}
    await info.attach('final-state',{body:JSON.stringify(app.rooms.get(code).game,null,2),contentType:'application/json'});
  }finally{await Promise.all(contexts.map(c=>c.close()));}
});

test('all expansion pickers use flat SVG at desktop and mobile sizes without rendered-image requests',async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const imageRequests:string[]=[];
  page.on('request',r=>{if(/\/(?:avatars\/|models\/[^/]+\/avatars\/)/.test(r.url()))imageRequests.push(r.url());});
  await page.goto(url);await page.getByRole('tab',{name:'自己练习',exact:true}).click();
  for(const name of ['Extra Mile','Leaf’s Fan Expansion','Wurstii A'])await page.getByRole('checkbox',{name,exact:true}).check();
  await page.getByRole('button',{name:'开始自己练习',exact:true}).click();await expect(page.locator('.connection.is-online')).toBeVisible();
  const packs=[['extra-mile',31],['leaf',18],['wurstii',30]] as const;
  for(const [pack,count] of packs){
    await page.getByLabel('角色版本筛选').selectOption(pack);
    await expect(page.locator('.practice-pool svg.avatar')).toHaveCount(count);
    await expect(page.locator('.practice-pool img,.practice-pool image')).toHaveCount(0);
    const button=page.locator('.practice-pool .character-pick').first();await button.click();
    await expect(button).toHaveAttribute('aria-pressed','true');
    await page.screenshot({path:info.outputPath(`${pack}-desktop.png`)});
    await page.setViewportSize({width:390,height:844});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect(page.locator('.practice-pool svg.avatar').first()).toBeVisible();
    await page.screenshot({path:info.outputPath(`${pack}-mobile.png`)});
    await page.setViewportSize({width:1280,height:900});
  }
  await page.reload();await expect(page.locator('.connection.is-online')).toBeVisible();
  await page.getByLabel('角色版本筛选').selectOption('wurstii');await expect(page.locator('.practice-pool svg.avatar')).toHaveCount(30);
  expect(imageRequests).toEqual([]);expect(errors).toEqual([]);
  const network=JSON.stringify({avatarRequests:imageRequests,pageErrors:errors},null,2);writeFileSync(info.outputPath('avatar-network.json'),network);
  await info.attach('avatar-network',{body:network,contentType:'application/json'});
});
