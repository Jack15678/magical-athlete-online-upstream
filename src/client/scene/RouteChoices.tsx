import type { RefObject } from 'react';
import { Line } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import type { TrackId } from '../../shared/tracks.js';
import { boardPoint, routeChoice } from './math.js';

type Route = NonNullable<ReturnType<typeof routeChoice>>;
type Buttons = RefObject<Map<string, HTMLButtonElement>>;

/** HTML hit targets stay finger-sized while their anchors follow the real track. */
export function RouteChoices({ route, track, compact, buttons }: { route: Route; track: TrackId; compact: boolean; buttons: Buttons }) {
  const from = boardPoint(route.from, compact, track);
  const a = new Vector3(), b = new Vector3(), anchor = new Vector3();
  useFrame(({ camera, size }) => {
    a.set(...from).project(camera);
    for (const option of route.options) {
      const button = buttons.current.get(option.id); if (!button) continue;
      const to = boardPoint(option.to, compact, track); b.set(...to).project(camera);
      anchor.set(from[0] + (to[0] - from[0]) * .8, from[1] + (to[1] - from[1]) * .8 + .35, from[2] + (to[2] - from[2]) * .8).project(camera);
      button.style.transform = `translate(${(anchor.x + 1) * size.width / 2}px,${(1 - anchor.y) * size.height / 2}px) translate(-50%,-50%)`;
      button.querySelector('svg')!.style.transform = `rotate(${Math.atan2(-(b.y - a.y) * size.height, (b.x - a.x) * size.width)}rad)`;
    }
  });
  return <group name="route-choice-arrows">
    <mesh position={[from[0], from[1] + .03, from[2]]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={10}>
      <ringGeometry args={[.55, .68, 32]} /><meshBasicMaterial color="#ffb83d" depthTest={false} />
    </mesh>
    {route.options.map(option => { const to = boardPoint(option.to, compact, track); return <Line key={option.id} points={[[from[0], from[1] + .08, from[2]], [to[0], to[1] + .08, to[2]]]} color="#e89d20" lineWidth={5} depthTest={false} />; })}
  </group>;
}

export function RouteButtons({ route, buttons, disabled, onChoose }: { route: Route; buttons: Buttons; disabled: boolean; onChoose: (id: string) => void }) {
  return <div className="route-choice-overlay" role="group" aria-label={`第${route.from}格方向箭头`}>{route.options.map(option =>
      <button key={option.id} ref={element => { if (element) buttons.current.set(option.id, element); else buttons.current.delete(option.id); }} className="route-arrow" type="button" data-testid={`route-arrow-${option.id}`} data-from={route.from} data-to={option.to} disabled={disabled} aria-label={option.label} onPointerDown={event => event.stopPropagation()} onClick={event => { event.stopPropagation(); onChoose(option.id); }}>
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M4 11h13V4l12 12-12 12v-7H4z" fill="currentColor" /></svg>
        <span>去 {option.to} 格</span>
      </button>
  )}</div>;
}
