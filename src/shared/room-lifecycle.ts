import type { GameMode } from './types.js';
import { CONTINUE_VOTE_MS } from './room-continuation.js';

/** All room modes follow the owner's presence, independently of gameplay. */
export const ROOM_OWNER_AWAY_MS = 30 * 60 * 1000;
export const PRACTICE_OWNER_AWAY_MS = 10 * 60 * 1000;
/** Compatibility name retained for existing clients and saved diagnostics. */
export const PERSONAL_ROOM_AWAY_MS = ROOM_OWNER_AWAY_MS;
export type RoomCloseReason = 'expired' | 'host-away' | 'dismissed';
export interface RoomClosure { code:string; closedAt:number; reason:RoomCloseReason; hostId?:string; version?:number; actionId?:string }
export const personalRoom = (room:{mode?:GameMode}):boolean => room.mode==='ai'||room.mode==='practice';
export const ownerAwayMs = (room:{mode?:GameMode}):number => room.mode==='practice'?PRACTICE_OWNER_AWAY_MS:ROOM_OWNER_AWAY_MS;
export const roomExpiryMessage = (room:{mode?:GameMode}):string => `房主连续离开超过${ownerAwayMs(room)/60000}分钟，房间已关闭。`;
export function roomExpiry(room:{mode?:GameMode;createdAt:number;hostLeftAt?:number;expiresAt?:number;closedAt?:number;continuation?:import('./room-continuation.js').RoomContinuation}):number {
  if(room.closedAt!==undefined)return room.closedAt+ROOM_OWNER_AWAY_MS;
  if(room.continuation)return room.continuation.stage==='playing'?(room.continuation.emptySince===undefined?Number.MAX_SAFE_INTEGER:room.continuation.emptySince+CONTINUE_VOTE_MS):room.continuation.deadline;
  return room.hostLeftAt===undefined?Number.MAX_SAFE_INTEGER:room.hostLeftAt+ownerAwayMs(room);
}
