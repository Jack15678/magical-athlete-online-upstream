/** Topology is independent of rendering coordinates and of racer abilities. */
export interface TrackTopology {
  finish: number;
  edges?: Record<number, number[]>;
  bridges?: [number, number][];
}

export function nextTrackNodes(track: TrackTopology, position: number, direction = 1): number[] {
  if (track.edges) {
    if (direction >= 0) return [...(track.edges[position] ?? [])];
    return Object.entries(track.edges).filter(([, targets]) => targets.includes(position)).map(([node]) => Number(node));
  }
  const next = position + Math.sign(direction);
  return next !== position && next >= 0 && next <= track.finish ? [next] : [];
}

/** Shortest directed movement distance; distinct lanes never become the same node. */
export function trackDistance(track: TrackTopology, from: number, to: number, direction = 1): number {
  if (from === to) return 0;
  const queue: [number, number][] = [[from, 0]], seen = new Set([from]);
  for (let index = 0; index < queue.length; index++) {
    const [node, distance] = queue[index]!;
    for (const next of nextTrackNodes(track, node, direction)) {
      if (next === to) return distance + 1;
      if (!seen.has(next)) { seen.add(next); queue.push([next, distance + 1]); }
    }
  }
  return Infinity;
}

/** General sharing only. Suckerfish explicitly requires numerical equality instead. */
export function sharedTrackSpace(track: TrackTopology, a: number, b: number): boolean {
  return a === b || Boolean(track.bridges?.some(([upper, lower]) => a === upper && b === lower || a === lower && b === upper));
}

/** Call for an actually passed node, not an arrival node. Upper bridges pass both layers. */
export function passesTrackSpace(track: TrackTopology, passedNode: number, targetNode: number): boolean {
  return passedNode === targetNode || Boolean(track.bridges?.some(([upper, lower]) => passedNode === upper && targetNode === lower));
}
