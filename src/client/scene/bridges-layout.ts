/** Display-only space. Rules, IDs, shared cells and edge order stay in TRACKS.
 * Longer approaches and half-height landings replace isolated steep peaks.
 * All consumers (tiles, pawns, route, minimap, bounds) use boardPoint. */
export const BRIDGE_PAIRS = [[3, 8], [10, 13], [15, 18], [20, 23]] as const;
/** Flat tile landings, then a ramp; used verbatim by deck and moving pawns. */
export function bridgeLeg(a: readonly number[], b: readonly number[]): [number, number, number][] {
  const distance = Math.hypot(b[0]! - a[0]!, b[2]! - a[2]!);
  const t = Math.min(.28, .94 / Math.max(.001, distance));
  const at = (fraction: number, y: number): [number, number, number] => [a[0]! + (b[0]! - a[0]!) * fraction, y, a[2]! + (b[2]! - a[2]!) * fraction];
  return [at(0, a[1]!), at(t, a[1]!), at(1 - t, b[1]!), at(1, b[1]!)];
}

/** C1 eased ramp shoulders. Flat pads stay flat; short eased ends keep the
 * steepest grade below .85 and never reduce underpass clearance. The deck and
 * pawn sampler consume these identical vertices, including in compact view. */
export function bridgeProfile(a:readonly number[],b:readonly number[]):[number,number,number][] {
 const leg=bridgeLeg(a,b),p=leg[1]!,q=leg[2]!,ease=.04;
 const height=(t:number)=>t<ease?t*t/(2*ease*(1-ease)):t>1-ease?1-(1-t)*(1-t)/(2*ease*(1-ease)):(t-ease/2)/(1-ease);
 return [[a[0]!,a[1]!,a[2]!],... [0,ease/3,ease*2/3,ease,.25,.5,.75,1-ease,1-ease*2/3,1-ease/3,1].map(t=>t===0?p:t===1?q:[p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*height(t),p[2]+(q[2]-p[2])*t] as [number,number,number]),[b[0]!,b[1]!,b[2]!]];
}
