// Isolated three-room HTTP/WebSocket smoke; never contacts deployed rooms.
import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync } from 'node:fs';
import { io, type Socket } from 'socket.io-client';
import { createApplication } from '../src/server/index.js';
import { decideAI } from '../src/engine/ai.js';
import { legacyRoomConfig } from '../src/shared/room-config.js';
import { presetCompetition } from '../src/shared/competition.js';
import type { ActionReply, GameAction, Identity } from '../src/shared/types.js';

const app=createApplication(':memory:'),sockets:Socket[]=[],latencies:number[]=[];
await new Promise<void>(resolve=>app.http.listen(0,'127.0.0.1',resolve));
const address=app.http.address();assert(address&&typeof address!=='string');const url=`http://127.0.0.1:${address.port}`;
async function post(path:string,data:unknown){const response=await fetch(url+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});assert.equal(response.status,201);return response.json();}
async function connect(identity:Identity){const socket=io(url,{auth:identity,transports:['websocket']});sockets.push(socket);await new Promise<void>((resolve,reject)=>{socket.once('connect',resolve);socket.once('connect_error',reject);});return socket;}
async function act(socket:Socket,code:string,action:GameAction){
  const started=performance.now(),reply=await new Promise<ActionReply>((resolve,reject)=>socket.timeout(5000).emit('action',{actionId:crypto.randomUUID(),expectedVersion:app.rooms.get(code).version,action},(error:Error|null,result:ActionReply)=>error?reject(error):resolve(result)));
  assert(reply.ok,reply.error);latencies.push(performance.now()-started);
}
try{
  const started=performance.now(),before=process.memoryUsage();
  const fixtures=await Promise.all(([4,6,8] as const).map(async(rounds,index)=>{
    const config={...legacyRoomConfig(),competition:{...presetCompetition(),preset:'custom' as const,raceCount:rounds}};
    const host=await post('/api/rooms',{name:`并发${rounds}`,maxPlayers:2,timeoutSeconds:0,config}),code=host.identity.roomCode;
    const guest=await post(`/api/rooms/${code}/join`,{name:'朋友'}),clients=await Promise.all([host,guest].map(async r=>({identity:r.identity as Identity,socket:await connect(r.identity)})));
    const game=app.rooms.get(code).game;game.rngState=5400+index;delete game.randomStream;
    for(const client of clients)await act(client.socket,code,{type:'ready',ready:true});await act(clients[0]!.socket,code,{type:'start'});
    return {code,rounds,clients,seed:5400+index};
  }));
  const progress=await Promise.all(fixtures.map(async fixture=>{
    let completed=0;
    while(completed<60){
      const room=app.rooms.get(fixture.code),g=room.game;assert.notEqual(g.phase,'paused');
      const candidate=fixture.clients.map(client=>({client,action:decideAI(app.rooms.view(room,client.identity.playerId))})).find(x=>x.action);
      if(candidate&&!(g.phase==='race'&&!g.pending&&(g.flags.needsBegin||g.flags.continuation))){await act(candidate.client.socket,fixture.code,candidate.action!);completed++;}
      await new Promise(resolve=>setTimeout(resolve,270));
    }
    const game=app.rooms.get(fixture.code).game;return {raceCount:fixture.rounds,seed:fixture.seed,actions:completed,phase:game.phase,round:game.round};
  }));
  const listing=await(await fetch(url+'/api/rooms')).json();assert.equal(listing.rooms.length,3);
  latencies.sort((a,b)=>a-b);const report={rooms:3,transport:'real local Node HTTP + WebSocket, no browser rendering',progress,elapsedMs:performance.now()-started,acknowledgements:latencies.length,p50Ms:latencies[Math.floor(latencies.length*.5)],p95Ms:latencies[Math.floor(latencies.length*.95)],maxMs:latencies.at(-1),before,after:process.memoryUsage(),limits:'Single Windows host; no 30-room performance claim, no production load, no new maps available for comparison.'};
  mkdirSync('.local',{recursive:true});writeFileSync('.local/schedule-concurrency.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{for(const socket of sockets)socket.disconnect();await app.close();}
