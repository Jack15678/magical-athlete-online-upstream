import { test,expect } from '@playwright/test';
import { createApplication } from '../../src/server/index.js';
import { createGame,resolveTasks } from '../../src/engine/index.js';
import { boardPoint } from '../../src/client/scene/math.js';
import type {TrackId} from '../../src/shared/tracks.js';
let app:ReturnType<typeof createApplication>,url:string;
test.beforeAll(async()=>{app=createApplication(':memory:');await new Promise<void>(r=>app.http.listen(0,'127.0.0.1',r));url=`http://127.0.0.1:${(app.http.address() as {port:number}).port}`});test.afterAll(async()=>{await app.close()});
for(const track of ['squiggle','boardwalks','bridges','twisty-twirl'] as TrackId[])test(`${track} actual roll movement and arrival`,async({page})=>{
 const made=app.rooms.create('移动验收',2,0),code=made.identity.roomCode;app.rooms.join(code,'观察者');const room=app.rooms.get(code),game=createGame(room.game.players,731);game.phase='race';game.round=1;game.track=track;game.currentRacerId='r0';game.baseTurnOrder=['r0','r1'];
 // Keep the observer off the moving pawn's tile: Coach correctly grants +1 when sharing.
 game.racers=game.players.map((p,i)=>({id:`r${i}`,playerId:p.id,characterId:i?'coach':'leaf-revolutionary',position:i?0:2,tripped:false,finished:false,eliminated:false,flags:{}}));game.flags.testDice=[1];game.queue=[{kind:'beginTurn',racerId:'r0'}];resolveTasks(game);room.game=game;room.version++;app.store.save(room);
 await page.addInitScript(id=>{localStorage.setItem(`magical-athlete:identity:${id.roomCode}`,JSON.stringify(id));localStorage.setItem('magical-athlete:reduced-motion','false');localStorage.setItem('magical-athlete:low-quality','true');localStorage.setItem('magical-athlete:muted','true')},made.identity);
 await page.setViewportSize({width:360,height:800});await page.goto(`${url}/room/${code}`);const board=page.getByTestId('board-3d');await expect(board).toHaveAttribute('data-loaded-models','2');await page.getByTestId('roll-button').click();await expect(board).toHaveAttribute('data-phase','move');
 await page.screenshot({path:`test-results/expansion-dioramas/${track}-live-move.png`});await expect(board).toHaveAttribute('data-phase','idle');expect(app.rooms.get(code).game.racers[0]!.position).toBe(3);const p=boardPoint(3,true,track);for(const [i,k]of ['x','y','z'].entries())await expect.poll(async()=>Number(await board.locator('.pawn-seat[data-racer-id="r0"]').getAttribute(`data-world-${k}`))).toBeCloseTo(p[i]!+(i===1?.005:0),2);
 await page.screenshot({path:`test-results/expansion-dioramas/${track}-live-arrival.png`});
});
