// Same flat palette and rounded outlines as the original 72 portraits.
export const yellow = '#ffda27', red = '#f44735', blue = '#254de4', pink = '#f6a8d0';
export const green = '#b5d66b', paper = '#fffdf4', ink = '#191919';
export const orange = '#ef9544', purple = '#9b73c7', brown = '#a46b45', grey = '#aebbc5';

export function Eyes({ x = 46, y = 42, gap = 24, small = false }: { x?: number; y?: number; gap?: number; small?: boolean }) {
  return <g fill={paper}><ellipse cx={x} cy={y} rx={small ? 5.5 : 8} ry={small ? 7 : 10} /><ellipse cx={x + gap} cy={y - 2} rx={small ? 5.5 : 8} ry={small ? 7 : 10} /><g fill={ink} stroke="none"><circle cx={x + 2} cy={y + 1} r={small ? 2.3 : 3.2} /><circle cx={x + gap + 2} cy={y - 1} r={small ? 2.3 : 3.2} /></g></g>;
}
export function Feet({ x = 43, y = 94, gap = 31 }: { x?: number; y?: number; gap?: number }) {
  const leg = Math.min(14, 114 - y);
  return <path d={`M${x} ${y}v${leg}h-10m${gap + 10}-${leg}v${leg}h11`} fill="none" strokeWidth="5" />;
}
