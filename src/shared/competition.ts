import { RACE_POINTS } from './tracks.js';
import { SCHEDULE_RULES_VERSION } from './rules-versions.js';

export const TRACK_CATALOG = {
  mild: { name: 'Mild Mile', label: '温和一英里', kind: '官方', available: true, description: '30 格基础跑道，专注角色互动。' },
  wild: { name: 'Wild Wilds', label: '狂野荒野', kind: '官方', available: true, description: '星星得分、绊倒与有向箭头，30 格。' },
  'twisty-twirl': { name: 'Twisty Twirl', label: 'Twisty Twirl', kind: '官方续作', available: false, description: '待取得 Second Wind 完整规则书与逐格布局。' },
  'whirly-world': { name: 'Whirly World', label: 'Whirly World', kind: '官方续作', available: false, description: '待取得 Second Wind 完整规则书与逐格布局。' },
  squiggle: { name: 'Squiggle', label: 'Squiggle', kind: '粉丝地图', available: false, description: '待取得 Leafsnack 原始地图 PDF，核对特殊格与弯道标记。' },
  boardwalks: { name: 'Boardwalks', label: 'Boardwalks', kind: '粉丝地图', available: false, description: '待取得原图、完整选路规则与作者距离图。' },
  bridges: { name: 'Bridges', label: 'Bridges', kind: '粉丝地图', available: false, description: '待取得原图与桥上、桥下、下穿规则。' },
} as const;
export type MapId = keyof typeof TRACK_CATALOG;
export type PlayableMapId = 'mild' | 'wild';
export type RaceCount = 4 | 6 | 8;
export type PresetId = 'classic' | 'official' | 'extended' | 'custom';
export interface CompetitionConfig {
  version: 'points-v1';
  mode: 'points';
  preset: PresetId;
  raceCount: RaceCount;
  rotation: MapId[];
  thrillingThirds: { enabled: boolean; rounds: number[] };
}
export const PRESETS: Record<Exclude<PresetId, 'custom'>, { name: string; raceCount: RaceCount; rotation: MapId[]; description: string }> = {
  classic: { name: '经典赛', raceCount: 4, rotation: ['mild','wild'], description: '4 场 · 2 张地图。熟悉基础玩法，从这里开跑。' },
  official: { name: '官方巡回', raceCount: 4, rotation: ['mild','wild','twisty-twirl','whirly-world'], description: '4 场 · 4 张地图。官方规则书给出的地图轮换顺序。' },
  extended: { name: '扩展巡回', raceCount: 8, rotation: ['mild','wild','twisty-twirl','whirly-world','squiggle','boardwalks','bridges','wild'], description: '七张地图各跑一次，最后回到 Wild Wilds，按八场总积分决定胜负。' },
};
export const REWARD_TIERS: Record<RaceCount, readonly number[]> = { 4:[0,1,2,3], 6:[0,1,1,2,2,3], 8:[0,0,1,1,2,2,3,3] };
export const presetCompetition = (id: Exclude<PresetId,'custom'> = 'classic'): CompetitionConfig => ({version:'points-v1',mode:'points',preset:id,raceCount:PRESETS[id].raceCount,rotation:[...PRESETS[id].rotation],thrillingThirds:{enabled:false,rounds:[]}});
export const competitionConfig = (config?: {competition?: CompetitionConfig}): CompetitionConfig => config?.competition ?? presetCompetition();
export function expandedSchedule(config: CompetitionConfig): MapId[] {
  return config.rotation.length ? Array.from({length:config.raceCount},(_,i)=>config.rotation[i%config.rotation.length]!) : [];
}
export function unavailableMaps(config: CompetitionConfig): MapId[] { return [...new Set(config.rotation)].filter(id=>!TRACK_CATALOG[id]?.available); }
function object(value:unknown):Record<string,unknown> {
  if(!value || typeof value!=='object' || Array.isArray(value)) throw Error('赛程配置格式无效。');
  return value as Record<string,unknown>;
}
export function validateCompetition(value: unknown): CompetitionConfig {
  const c=object(value);
  if(Object.keys(c).some(key=>!['version','mode','preset','raceCount','rotation','thrillingThirds'].includes(key)) || c.version!=='points-v1') throw Error('不支持此赛程版本，请使用兼容版本恢复。');
  if(c.mode!=='points') throw Error('社区锦标赛规则待确认，尚未开放。');
  if(!['classic','official','extended','custom'].includes(String(c.preset))) throw Error('比赛方案无效。');
  if(![4,6,8].includes(c.raceCount as number)) throw Error('比赛场数只能为 4、6 或 8。');
  if(!Array.isArray(c.rotation)||!c.rotation.length||c.rotation.length>(c.raceCount as number)) throw Error('轮换列表不能为空，且长度不能超过比赛场数；请手动调整。');
  if(c.rotation.some(id=>typeof id!=='string'||!Object.hasOwn(TRACK_CATALOG,id))) throw Error('赛程包含未知地图。');
  const event=object(c.thrillingThirds);
  if(Object.keys(event).some(key=>!['enabled','rounds'].includes(key)) || typeof event.enabled!=='boolean' || !Array.isArray(event.rounds) || event.rounds.some(n=>!Number.isInteger(n)||n<1||n>(c.raceCount as number)) || new Set(event.rounds).size!==event.rounds.length) throw Error('特殊赛事适用场次无效。');
  if(event.enabled) throw Error('Thrilling Thirds 完整事件表与抽牌裁定待确认，尚未开放。');
  if(event.rounds.length) throw Error('特殊赛事关闭时不能指定适用场次。');
  const config=structuredClone(c) as unknown as CompetitionConfig;
  if(config.preset!=='custom'){
    const expected=PRESETS[config.preset];
    if(config.raceCount!==expected.raceCount || JSON.stringify(config.rotation)!==JSON.stringify(expected.rotation)) throw Error('地图或场数已修改，请使用自定义赛程。');
  }
  const missing=unavailableMaps(config);
  if(missing.length) throw Error(`尚未开放地图：${missing.map(id=>TRACK_CATALOG[id].name).join('、')}。缺少完整规则与布局，不能替换后使用原方案。`);
  return config;
}
export interface MatchPlan {
  version: 'points-v1';
  trackVersion: 'base-tracks-2026-10-21';
  raceCount: RaceCount;
  races: { round:number; map:PlayableMapId; rewards:number[]; specialEvent:null }[];
}
export function createMatchPlan(config?: {competition?:CompetitionConfig}): MatchPlan {
  const c=validateCompetition(competitionConfig(config));
  return {version:'points-v1',trackVersion:'base-tracks-2026-10-21',raceCount:c.raceCount,races:expandedSchedule(c).map((map,i)=>({round:i+1,map:map as PlayableMapId,rewards:[...RACE_POINTS[REWARD_TIERS[c.raceCount][i]!]!],specialEvent:null}))};
}
export function matchRaceCount(state:{rulesVersion?:string;matchPlan?:MatchPlan;config?:{competition?:CompetitionConfig}}):RaceCount {
  if(state.matchPlan)return state.matchPlan.raceCount;
  // A finished historical match may already have a different next-game draft.
  return state.rulesVersion===SCHEDULE_RULES_VERSION?competitionConfig(state.config).raceCount:4;
}
/** Executable plans are saved once at draft start; the live catalog never rebuilds them. */
export function assertSupportedPlan(plan?:MatchPlan):void {
  if(!plan)return;
  if(plan.version!=='points-v1'||plan.trackVersion!=='base-tracks-2026-10-21'||![4,6,8].includes(plan.raceCount)||plan.races.length!==plan.raceCount||plan.races.some((race,i)=>race.round!==i+1||!['mild','wild'].includes(race.map)||race.specialEvent!==null||JSON.stringify(race.rewards)!==JSON.stringify(RACE_POINTS[REWARD_TIERS[plan.raceCount][i]!]))) throw Error('存档赛程版本或奖励表不兼容，请使用对应版本恢复，不能按另一张地图继续。');
}
