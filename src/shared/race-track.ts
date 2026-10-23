import { TRACKS } from './tracks.js';
import { nextTrackNodes, sharedTrackSpace, trackDistance } from './track-topology.js';
import type { GameState, Racer } from './types.js';

export const raceDirection = (s: GameState) => s.flags.twistReversed ? -1 : 1;
export const startPosition = (s: GameState) => s.flags.twistReversed ? TRACKS[s.track].finish : 0;
export const finishPosition = (s: GameState) => s.flags.twistReversed ? 0 : TRACKS[s.track].finish;
export const firstCorner = (s: GameState) => s.flags.twistReversed ? TRACKS[s.track].secondCorner : TRACKS[s.track].firstCorner;
export const secondCorner = (s: GameState) => s.flags.twistReversed ? TRACKS[s.track].firstCorner : TRACKS[s.track].secondCorner;
export const positionAt = (s: GameState, progress: number) => s.flags.twistReversed ? TRACKS[s.track].finish - progress : progress;
/** Ranking is the author's distance diagram, never a branch's storage ID. */
export function progress(s: GameState, value: number | Racer): number {
  const position = typeof value === 'number' ? value : value.position;
  const track = TRACKS[s.track];
  return s.flags.twistReversed ? track.finish - position : track.remaining ? track.finish - track.remaining[position]! : position;
}
export function sharing(s: GameState, a: Racer, b: Racer) { return sharedTrackSpace(TRACKS[s.track], a.position, b.position); }
/** Range powers measure connected track steps; bridge layers keep their numbered distance. */
export function separation(s: GameState, a: Racer, b: Racer): number {
  if(s.track !== 'boardwalks')return Math.abs(a.position-b.position);
  return Math.min(trackDistance(TRACKS[s.track],a.position,b.position),trackDistance(TRACKS[s.track],a.position,b.position,-1));
}
export function forwardDistance(s: GameState, from: number, to: number) { return trackDistance(TRACKS[s.track],from,to,raceDirection(s)); }
export function trackNodes(s: GameState) { return TRACKS[s.track].edges ? Object.keys(TRACKS[s.track].edges!).map(Number) : Array.from({length:TRACKS[s.track].finish+1},(_,i)=>i); }
/** A deterministic neighbouring node is only used where a power names an exact
 * lane. Movement through a fork uses the engine's persisted route prompt. */
export function adjacentPosition(s: GameState, position: number, distance: number) {
  let current=position;
  for(let i=0;i<Math.abs(distance);i++)current=nextTrackNodes(TRACKS[s.track],current,Math.sign(distance)*raceDirection(s))[0]??current;
  return current;
}
