export interface LeafTrackSpace { kind: 'star' | 'trip' | 'arrow'; points?: number; move?: number }
export interface LeafTrackNode { x: number; z: number; y?: number; color?: string }
export interface LeafTrackDefinition {
  id: 'squiggle' | 'boardwalks' | 'bridges';
  name: string;
  length: number;
  finish: number;
  firstCorner: number;
  secondCorner: number;
  blockedCharacters: string[];
  specials: Record<number, LeafTrackSpace>;
  verified: boolean;
  source: string;
  nodes: Record<number, LeafTrackNode>;
  edges: Record<number, number[]>;
  remaining: Record<number, number>;
  bridges?: [number, number][];
  /** Absent corner rulings disable the abilities that depend on them. */
  cornerRules: { first: 'unsupported'; second: 'unsupported' | 'source'; note: string };
}

const colors = ['#f34b22', '#639fd0', '#509542', '#e9b51b', '#ce85ba'];
const linearEdges = (): Record<number, number[]> => Object.fromEntries(Array.from({ length: 31 }, (_, n) => [n, n < 30 ? [n + 1] : []]));
const linearRemaining = (): Record<number, number> => Object.fromEntries(Array.from({ length: 31 }, (_, n) => [n, 30 - n]));

/** Centers traced from the two 1500x1000 source panels joined left-to-right.
 * Uniform scale keeps the source bends; pixels never participate in game rules. */
function centers(points: Record<number, [number, number]>, tilePixels: number): Record<number, LeafTrackNode> {
  return Object.fromEntries(Object.entries(points).map(([id, [x, z]]) => [id, {
    x: (x - 1500) / tilePixels, z: (z - 500) / tilePixels,
    ...(Number(id) > 0 && Number(id) < 30 ? { color: colors[(Number(id) - 1) % 5] } : {}),
  }]));
}

// bgg442357.pdf pp. 1-2. Star signs are points, not movement arrows.
const squiggle: LeafTrackDefinition = {
  id: 'squiggle', name: '蜿蜒曲线', length: 30, finish: 30,
  firstCorner: -1, secondCorner: -1, blockedCharacters: ['blimp', 'gloth', 'nepo-baby'],
  cornerRules: { first: 'unsupported', second: 'unsupported', note: '原图没有弯道能力裁定；按用户决定禁用依赖弯道的角色。' },
  specials: {
    1: { kind: 'star', points: 1 }, 5: { kind: 'trip' }, 6: { kind: 'star', points: -2 },
    8: { kind: 'star', points: 1 }, 13: { kind: 'star', points: -1 }, 14: { kind: 'arrow', move: 1 },
    17: { kind: 'trip' }, 19: { kind: 'star', points: 1 }, 21: { kind: 'star', points: 1 },
    23: { kind: 'star', points: -3 }, 26: { kind: 'trip' }, 28: { kind: 'star', points: -1 },
    29: { kind: 'star', points: 2 },
  },
  verified: true, source: 'User-supplied bgg442357.pdf, pages 1-2 (2026-10-23)',
  edges: linearEdges(), remaining: linearRemaining(),
  nodes: centers({
    0: [45, 155], 1: [220, 165], 2: [365, 230], 3: [405, 390], 4: [410, 560],
    5: [420, 745], 6: [525, 850], 7: [705, 850], 8: [835, 760], 9: [905, 575],
    10: [965, 390], 11: [1020, 185], 12: [1220, 200], 13: [1300, 350],
    14: [1330, 550], 15: [1370, 795], 16: [1550, 870], 17: [1760, 765],
    18: [1840, 575], 19: [1895, 390], 20: [1960, 205], 21: [2130, 210],
    22: [2230, 365], 23: [2280, 520], 24: [2310, 675], 25: [2360, 845],
    26: [2540, 870], 27: [2710, 815], 28: [2760, 645], 29: [2795, 470], 30: [2800, 290],
  }, 180),
};

const boardwalkEdges = linearEdges();
function detour(from: number, nodes: number[], to: number): void {
  boardwalkEdges[from]!.push(nodes[0]!);
  nodes.forEach((node, i) => { boardwalkEdges[node] = [nodes[i + 1] ?? to]; });
}
detour(8, [31, 32, 33, 34, 35, 36], 13);
detour(17, [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], 24);
detour(18, [50, 51, 52, 53, 54, 55, 56, 57, 58], 26);

const boardwalkNodes = centers({
  0: [235, 90], 1: [235, 255], 2: [235, 405], 3: [235, 555], 4: [235, 710],
  5: [245, 860], 6: [450, 860], 7: [470, 700], 8: [470, 500],
  9: [650, 460], 10: [800, 460], 11: [935, 460], 12: [1095, 450], 13: [1125, 310],
  14: [1290, 315], 15: [1410, 315], 16: [1525, 315], 17: [1685, 315],
  18: [1870, 315], 19: [2035, 310], 20: [2190, 310], 21: [2340, 310],
  22: [2460, 300], 23: [2460, 390], 24: [2470, 510], 25: [2650, 505],
  26: [2800, 500], 27: [2810, 650], 28: [2810, 820], 29: [2640, 845], 30: [2470, 845],
  31: [470, 300], 32: [475, 155], 33: [650, 150], 34: [790, 150],
  35: [935, 150], 36: [1090, 160],
  37: [1690, 485], 38: [1680, 650], 39: [1515, 660], 40: [1360, 660],
  41: [1355, 850], 42: [1525, 860], 43: [1675, 860], 44: [1825, 860],
  45: [1965, 860], 46: [2120, 850], 47: [2280, 835], 48: [2290, 670], 49: [2290, 520],
  50: [1870, 140], 51: [2035, 130], 52: [2190, 130], 53: [2345, 135],
  54: [2495, 140], 55: [2650, 140], 56: [2795, 145], 57: [2800, 270], 58: [2800, 370],
}, 160);
// The detours contain extra green cells, so their colors do not follow node ID modulo five.
for (const [ids, pattern] of [
  [[31, 32, 33, 34, 35, 36], [2, 3, 4, 0, 1, 2]],
  [[37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], [2, 2, 3, 4, 0, 1, 2, 2, 4, 3, 0, 1, 2]],
  [[50, 51, 52, 53, 54, 55, 56, 57, 58], [2, 3, 4, 0, 1, 2, 2, 3, 4]],
] as [number[], number[]][]) ids.forEach((id, i) => { boardwalkNodes[id]!.color = colors[pattern[i]!]!; });

// bgg442654.pdf pp. 1-2: map; p. 3: exact author's shortest-distance diagram.
const boardwalks: LeafTrackDefinition = {
  id: 'boardwalks', name: '栈道岔路', length: 30, finish: 30,
  firstCorner: -1, secondCorner: -1, blockedCharacters: ['blimp', 'gloth', 'nepo-baby'],
  cornerRules: { first: 'unsupported', second: 'unsupported', note: '选路规则与距离图没有弯道能力裁定；按用户决定禁用依赖弯道的角色。' },
  specials: {
    1: { kind: 'star', points: 1 }, 6: { kind: 'trip' }, 9: { kind: 'arrow', move: 1 },
    10: { kind: 'trip' }, 16: { kind: 'trip' }, 18: { kind: 'arrow', move: -1 },
    19: { kind: 'trip' }, 20: { kind: 'trip' }, 21: { kind: 'trip' }, 22: { kind: 'trip' }, 23: { kind: 'trip' },
    32: { kind: 'arrow', move: -1 }, 37: { kind: 'star', points: 1 }, 46: { kind: 'arrow', move: -2 },
    47: { kind: 'star', points: 1 }, 48: { kind: 'arrow', move: 2 }, 49: { kind: 'star', points: 1 },
    50: { kind: 'arrow', move: -2 }, 56: { kind: 'arrow', move: -3 },
  },
  verified: true, source: 'User-supplied bgg442654.pdf, pages 1-3 (2026-10-23)',
  nodes: boardwalkNodes, edges: boardwalkEdges,
  remaining: {
    ...linearRemaining(),
    31: 23, 32: 22, 33: 21, 34: 20, 35: 19, 36: 18,
    37: 19, 38: 18, 39: 17, 40: 16, 41: 15, 42: 14, 43: 13,
    44: 12, 45: 11, 46: 10, 47: 9, 48: 8, 49: 7,
    50: 13, 51: 12, 52: 11, 53: 10, 54: 9, 55: 8, 56: 7, 57: 6, 58: 5,
  },
};

const bridgePairs: [number, number][] = [[3, 8], [10, 13], [15, 18], [20, 23]];
const bridgeNodes = centers({
  0: [20, 175], 1: [285, 175], 2: [545, 180], 3: [815, 250], 4: [1030, 450],
  5: [965, 730], 6: [690, 730], 7: [630, 510], 8: [815, 250], 9: [1110, 120],
  10: [1450, 210], 11: [1530, 430], 12: [1330, 420], 13: [1450, 210], 14: [1670, 135],
  15: [1920, 205], 16: [2000, 400], 17: [1780, 400], 18: [1920, 205], 19: [2180, 130],
  20: [2430, 200], 21: [2525, 400], 22: [2290, 400], 23: [2430, 200], 24: [2760, 210],
  25: [2830, 465], 26: [2640, 680], 27: [2320, 810], 28: [1995, 825], 29: [1675, 825], 30: [1380, 825],
}, 250);
// Display coordinates only: preserve every numbered node, effect and legal edge.
// Room for open portals, full-size pawns, flat landings and gradual approaches.
for (const node of Object.values(bridgeNodes)) { node.x *= 2.2; node.z *= 2.2; }
for (const id of [11, 12, 16, 17, 21, 22]) bridgeNodes[id]!.z += 1.2;
for (const id of [2, 14, 19]) bridgeNodes[id]!.x -= .5;
bridgeNodes[4]!.z += .5;
for (const [upper] of bridgePairs) for (const id of [upper - 1, upper + 1]) bridgeNodes[id]!.y = .15;
for (const [upper, lower] of bridgePairs) {
  // Height is a scene choice, giving the lower pawn clearance under the bridge.
  bridgeNodes[upper]!.y = 1.65;
  bridgeNodes[lower]!.y = 0;
}

// bgg442655.pdf p. 3 explicitly fixes the SECOND corner at 15, not the first.
const bridges: LeafTrackDefinition = {
  id: 'bridges', name: '交错桥梁', length: 30, finish: 30, firstCorner: -1, secondCorner: 15, blockedCharacters: ['nepo-baby'],
  cornerRules: { first: 'unsupported', second: 'source', note: '作者FAQ明确第二弯道为15；第一弯道未规定，依赖第一弯道的角色不可用。' },
  specials: {}, verified: true, source: 'User-supplied bgg442655.pdf, pages 1-3 (2026-10-23)',
  nodes: bridgeNodes, edges: linearEdges(), remaining: linearRemaining(), bridges: bridgePairs,
};

export const LEAF_TRACKS: Record<LeafTrackDefinition['id'], LeafTrackDefinition> = { squiggle, boardwalks, bridges };
