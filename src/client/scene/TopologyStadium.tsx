import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { TRACKS, type TrackId } from '../../shared/tracks.js';
import { nextTrackNodes } from '../../shared/track-topology.js';
import { boardBounds, boardPoint, TILE, trackConnections, trackNodeIds } from './math.js';
import { specialTileTexture } from './tile-art.js';

function nodeTexture(id: number, finish: number, remaining?: number) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#173f37'; context.textAlign = 'center'; context.textBaseline = 'middle';
  context.font = '900 55px "Microsoft YaHei", sans-serif';
  context.fillText(id === 0 ? '起点' : id === finish ? '终点' : String(id), 128, 94);
  if (remaining !== undefined && id !== 0 && id !== finish) {
    context.font = '700 26px "Microsoft YaHei", sans-serif'; context.fillText(`距终点 ${remaining}`, 128, 185);
  }
  if (id === 0 || id === finish) for (let i = 0; i < 10; i++) {
    context.fillStyle = i % 2 ? '#fff9db' : '#173f37'; context.fillRect(18 + i * 22, 213, 22, 17);
  }
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function TopologyTile({ track, id, triggered }: { track: TrackId; id: number; triggered: boolean }) {
  const definition = TRACKS[track], point = boardPoint(id, false, track), special = definition.specials[id];
  const next = nextTrackNodes(definition, id, Math.sign(special?.move ?? 1))[0];
  const toward = boardPoint(next ?? id, false, track);
  const angle = Math.atan2(-(toward[0] - point[0]), -(toward[2] - point[2]));
  const texture = useMemo(() => special ? specialTileTexture(special.kind, special.move, id, angle, special.points, special.to) : nodeTexture(id, definition.finish, track === 'boardwalks' ? definition.remaining?.[id] : undefined), [id, track, special, angle, definition.finish]);
  useEffect(() => () => texture.dispose(), [texture]);
  const nearest = Math.min(...trackNodeIds(track).filter(other => other !== id).map(other => {
    const p = boardPoint(other, false, track); return Math.hypot(p[0] - point[0], p[2] - point[2]);
  }).filter(distance => distance > .01));
  const size = Math.min(TILE * .91, nearest * .86), color = id === 0 ? '#82c5ae' : id === definition.finish ? '#efb15a' : definition.nodes?.[id]?.color ?? '#ead3a2';
  const geometry = useMemo(() => new RoundedBoxGeometry(size, .14, size, 2, .04), [size]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <group name={`track-node-${id}`} position={point}>
    <mesh geometry={geometry} position={[0, -.07, 0]} receiveShadow castShadow>
      <meshStandardMaterial color={color} roughness={.74} emissive={color} emissiveIntensity={triggered ? .24 : 0} />
    </mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .01, 0]}>
      <planeGeometry args={[size * .92, size * .92]} /><meshBasicMaterial map={texture} transparent toneMapped={false} depthWrite={false} />
    </mesh>
    {(definition.nodes?.[id]?.y ?? 0) > 0 && [-1, 1].map(side => <mesh key={side} position={[side * size * .39, -(point[1] - .12) / 2, 0]} castShadow>
      <boxGeometry args={[.13, point[1] - .12, size * .8]} /><meshStandardMaterial color="#738e74" roughness={.8} />
    </mesh>)}
  </group>;
}

function TrackConnection({ track, from, to }: { track: TrackId; from: number; to: number }) {
  const a = new THREE.Vector3(...boardPoint(from, false, track)), b = new THREE.Vector3(...boardPoint(to, false, track));
  const direction = b.clone().sub(a), middle = a.clone().add(b).multiplyScalar(.5);
  const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction.clone().normalize());
  return <mesh name={`track-edge-${from}-${to}`} position={[middle.x, middle.y - .12, middle.z]} quaternion={orientation} receiveShadow>
    <boxGeometry args={[TILE * .49, .12, direction.length()]} /><meshStandardMaterial color="#91ac8e" roughness={.85} />
  </mesh>;
}

/** Independent courses retain every source fork and bridge; node IDs never draw the edges. */
export function TopologyStadium({ track, compact, triggered }: { track: TrackId; compact: boolean; triggered: Set<number> }) {
  const bounds = boardBounds(track), start = boardPoint(0, false, track), definition = TRACKS[track];
  const deck = useMemo(() => new RoundedBoxGeometry(bounds.width + TILE * 2, .45, bounds.depth + TILE * 2, 4, .18), [bounds.width, bounds.depth]);
  useEffect(() => () => deck.dispose(), [deck]);
  return <group rotation={[0, compact ? -Math.PI / 2 : 0, 0]} name={`topology-stadium-${track}`}>
    <mesh geometry={deck} position={[bounds.x, -.22, bounds.z]} receiveShadow castShadow><meshStandardMaterial color="#e7e6c8" roughness={.8} /></mesh>
    {trackConnections(track).map(([from, to]) => <TrackConnection key={`${from}-${to}`} {...{ track, from, to }} />)}
    <mesh position={[start[0] - TILE * 1.5, .13, start[2]]} receiveShadow><boxGeometry args={[TILE * 3, .15, TILE * 1.45]} /><meshStandardMaterial color="#82c5ae" roughness={.8} /></mesh>
    {trackNodeIds(track).sort((a, b) => (definition.nodes?.[a]?.y ?? 0) - (definition.nodes?.[b]?.y ?? 0)).map(id => <TopologyTile key={id} {...{ track, id }} triggered={triggered.has(id)} />)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -.46, 0]} receiveShadow><planeGeometry args={[240, 240]} /><meshStandardMaterial color="#e3dcca" roughness={1} /></mesh>
  </group>;
}
