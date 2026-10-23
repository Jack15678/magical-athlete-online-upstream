import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Billboard } from '@react-three/drei';
import type { RoomView } from '../../shared/types.js';
import { TRACKS, type TrackId } from '../../shared/tracks.js';
import { boardPoint, TILE } from './math.js';
import { ToyCharacter } from './ToyCharacter.js';

function labelTexture(label: string) {
  const canvas = document.createElement('canvas'); canvas.width = 512; canvas.height = 128;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#66498c'; context.beginPath(); context.roundRect(0, 0, 512, 128, 16); context.fill();
  context.fillStyle = '#fff7dc'; context.font = '900 66px "Microsoft YaHei",sans-serif'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(label, 256, 64);
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; return texture;
}

export function TwistBoundary({ track, compact }: { track: TrackId; compact: boolean }) {
  const boundary = TRACKS[track].twistBoundary;
  const texture = useMemo(() => labelTexture('TWIST'), []);
  useEffect(() => () => texture.dispose(), [texture]);
  if (!boundary) return null;
  const a = boardPoint(boundary.before, compact, track), b = boardPoint(boundary.after, compact, track);
  return <group name="twist-crossing-line" position={[(a[0] + b[0]) / 2, .247, (a[2] + b[2]) / 2]} rotation={[0, Math.atan2(b[0] - a[0], b[2] - a[2]), 0]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[TILE * 1.07, .42]} /><meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} /></mesh>
  </group>;
}

/** Public temporary pieces have no player seat and never enter the racer list. */
export function TwistPieces({ room, compact, lowQuality, reducedMotion }: { room: RoomView; compact: boolean; lowQuality: boolean; reducedMotion: boolean }) {
  const twist = room.trackState?.twist, monster = twist?.monster;
  const texture = useMemo(() => labelTexture('游荡巨口'), []);
  useEffect(() => () => texture.dispose(), [texture]);
  const wandering = monster && !monster.racerId && !monster.finished ? boardPoint(monster.position, compact, room.track) : undefined;
  const event=room.trackState?.event,npc=event?.npc,marker=npc&&!npc.finished?boardPoint(npc.position,compact,room.track):undefined;
  return <group name="public-twist-pieces">
    <TwistBoundary track={room.track} compact={compact} />
    {twist?.chips?.map(position => { const point = boardPoint(position, compact, room.track); return <mesh key={position} name={`twist-chip-${position}`} position={[point[0] + .55, point[1] + .1, point[2] + .55]}>
      <cylinderGeometry args={[.22, .22, .09, 16]} /><meshStandardMaterial color="#ffd15b" metalness={.45} roughness={.3} />
    </mesh>; })}
    {event?.trampolines?.map(position=>{const point=boardPoint(position,compact,room.track);return <mesh key={`event-${position}`} name={`event-trampoline-${position}`} position={[point[0],point[1]+.12,point[2]]} rotation={[-Math.PI/2,0,0]}><torusGeometry args={[.65,.09,8,24]} /><meshStandardMaterial color="#df69aa" /></mesh>;})}
    {marker&&npc&&<group name={`event-marker-${npc.id}`} position={[marker[0]-.6,marker[1]+.01,marker[2]-.5]}><ToyCharacter characterId={npc.id} color="#d56cbb" lowQuality={lowQuality} motionEnabled={!reducedMotion} /><mesh position={[0,.02,0]}><cylinderGeometry args={[.55,.55,.08,20]} /><meshStandardMaterial color="#d56cbb" /></mesh></group>}
    {wandering && <group name="twist-neutral-monster" position={[wandering[0] - .55, wandering[1] + .005, wandering[2] - .45]}>
      <group scale={1.4}><ToyCharacter characterId="mouth" color="#9272bd" lowQuality={lowQuality} motionEnabled={!reducedMotion} /></group>
      <Billboard position={[0, 2.45, 0]}><mesh><planeGeometry args={[2.1, .525]} /><meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} /></mesh></Billboard>
    </group>}
  </group>;
}
