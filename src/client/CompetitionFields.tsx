import { competitionConfig, expandedSchedule, PRESETS, presetCompetition, REWARD_TIERS, TRACK_CATALOG, unavailableMaps, type CompetitionConfig, type MapId, type PresetId, type RaceCount } from '../shared/competition.js';
import { CHARACTER_PACK_IDS, type RoomConfig } from '../shared/room-config.js';
import { TRACKS, RACE_POINTS } from '../shared/tracks.js';
import { boardPoint } from './scene/math.js';

export function TrackThumbnail({id}:{id:MapId}) {
  if(id!=='mild'&&id!=='wild')return null;
  const track=TRACKS[id],points=Array.from({length:track.finish+1},(_,i)=>{const [x,,z]=boardPoint(i,false);return {x:160+x*8,y:45+z*8,index:i};});
  return <svg className="track-thumbnail" viewBox="0 0 320 90" role="img" aria-label={`${TRACK_CATALOG[id].name} 实际路线与特殊格缩略图`}>
    <polyline points={points.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="#78967d" strokeWidth="13" strokeLinejoin="round" />
    {points.map(p=><g key={p.index}><rect x={p.x-6} y={p.y-6} width="12" height="12" rx="2" fill={p.index===0?'#edb65e':p.index===30?'#db785b':track.specials[p.index]?'#e4d77c':'#fff9db'} stroke="#567966" strokeWidth=".6" /><text x={p.x} y={p.y+3} textAnchor="middle" fontSize="8" fill="#294a40">{p.index===0?'起':p.index===30?'终':track.specials[p.index]?.kind==='star'?'★':track.specials[p.index]?.kind==='trip'?'!':track.specials[p.index]?.kind==='arrow'?(track.specials[p.index]!.move!>0?'+':'−'):''}</text></g>)}
  </svg>;
}
export function competitionSummary(config:RoomConfig):string {
  const c=competitionConfig(config),name=c.preset==='custom'?'自定义积分赛':PRESETS[c.preset].name;
  return `${name} · ${c.raceCount} 场比赛 · ${new Set(expandedSchedule(c)).size} 张地图 · ${CHARACTER_PACK_IDS.filter(id=>config.characterPacks[id]).length} 个角色包 · 特殊赛事关闭`;
}
export function SchedulePreview({competition}:{competition:CompetitionConfig}) {
  const maps=expandedSchedule(competition);
  return <ol className="schedule-preview" aria-label="完整逐场安排">{maps.map((id,i)=><li key={i}>
    <span className="race-number">{i+1}</span><span><strong>{TRACK_CATALOG[id].name}</strong><small>{TRACK_CATALOG[id].available?'特殊赛事关闭':'地图尚未开放'}</small></span>
    <span className="race-rewards">第 1 名 <b>{RACE_POINTS[REWARD_TIERS[competition.raceCount][i]!]![0]}</b> 分<br />第 2 名 <b>{RACE_POINTS[REWARD_TIERS[competition.raceCount][i]!]![1]}</b> 分</span>
  </li>)}</ol>;
}
export function CompetitionFields({config,onChange,disabled=false}:{config:RoomConfig;onChange:(value:RoomConfig)=>void;disabled?:boolean}) {
  const c=competitionConfig(config);
  function change(next:CompetitionConfig){onChange({...config,competition:next});}
  function custom(patch:Partial<CompetitionConfig>){change({...c,...patch,preset:'custom'});}
  function reorder(index:number,offset:number){const rotation=[...c.rotation];[rotation[index],rotation[index+offset]]=[rotation[index+offset]!,rotation[index]!];custom({rotation});}
  return <>
    <fieldset className="competition-mode" disabled={disabled}><legend>比赛方式</legend>
      <label><input type="radio" name="competition-mode" checked readOnly />积分赛 <small>按全部场次累计积分，同分共享胜利。</small></label>
      <label aria-describedby="tournament-unavailable"><input type="radio" name="competition-mode" disabled />社区锦标赛 <small id="tournament-unavailable">规则待确认：尚未取得可核验的完整作者方案。</small></label>
    </fieldset>
    <fieldset className="competition-settings" disabled={disabled}><legend>比赛方案与赛程</legend>
      <div className="preset-grid">{(Object.keys(PRESETS) as Exclude<PresetId,'custom'>[]).map(id=>{
        const preset=PRESETS[id],missing=unavailableMaps(presetCompetition(id));
        return <div key={id} className={`preset-card${c.preset===id?' is-selected':''}`}>
          <button type="button" className="preset-select" aria-pressed={c.preset===id} disabled={disabled||!!missing.length} onClick={()=>change({...presetCompetition(id),thrillingThirds:c.thrillingThirds})}>
            <small>{id==='classic'?'基础四场':id==='official'?'官方地图顺序':'项目赛程 · 含粉丝地图'}</small><strong>{c.preset===id?'✓ ':''}{preset.name}</strong><p>{preset.description}</p>
          </button>
          {!!missing.length&&<p className="unavailable-reason">尚缺：{missing.map(map=>TRACK_CATALOG[map].name).join('、')}</p>}
          <button type="button" className="text-button edit-preset" onClick={()=>change({...presetCompetition(id),preset:'custom',thrillingThirds:c.thrillingThirds})}>修改{preset.name}赛程</button>
        </div>;
      })}</div>
      <details className="custom-schedule" open={c.preset==='custom'} onToggle={event=>{if(event.currentTarget.open&&c.preset!=='custom')custom({});}}>
        <summary>自定义赛程{c.preset==='custom'?' · 已选中':''}</summary>
        <label>比赛场数<select aria-label="比赛场数" value={c.raceCount} onChange={e=>custom({raceCount:Number(e.target.value) as RaceCount})}>{[4,6,8].map(n=><option key={n} value={n}>{n} 场{n===4?'':' · 项目规则'}</option>)}</select></label>
        <p>按下方顺序从头循环，直到填满全部场次。同一张图可以重复添加；修改不会自动丢弃你的选择。</p>
        <ol className="rotation-list">{c.rotation.map((id,i)=><li key={i}>
          <span>{i+1}. {TRACK_CATALOG[id].name}{!TRACK_CATALOG[id].available&&'（待开放）'}</span>
          <div><button type="button" aria-label={`上移第${i+1}项`} disabled={disabled||i===0} onClick={()=>reorder(i,-1)}>↑</button><button type="button" aria-label={`下移第${i+1}项`} disabled={disabled||i===c.rotation.length-1} onClick={()=>reorder(i,1)}>↓</button><button type="button" aria-label={`移除第${i+1}项`} onClick={()=>custom({rotation:c.rotation.filter((_,j)=>i!==j)})}>移除</button></div>
        </li>)}</ol>
        <div className="map-options">{(['mild','wild'] as const).map(id=><div key={id}><TrackThumbnail id={id} /><strong>{TRACK_CATALOG[id].name}</strong><p>{TRACK_CATALOG[id].description}</p><button type="button" onClick={()=>custom({rotation:[...c.rotation,id]})}>添加 {TRACK_CATALOG[id].name}</button></div>)}</div>
      </details>
      {c.raceCount!==4&&<p className="project-rule">{c.raceCount} 场为项目自定义赛制：每人每场使用未出赛角色；每批按顺序和逆序各选一名，下批首选顺延。不是官方赛制，未获社区平衡性认证。最后一场不加倍。</p>}
      <h3>完整逐场安排</h3><SchedulePreview competition={c} />
      <details className="source-details"><summary>来源与适配详情</summary><p>基础规则书第18页允许赛前约定地图，第19页为四场总分，第20页给出官方巡回顺序。6／8场与扩展巡回为本项目规则。</p><a href="/rules/competition.md" target="_blank" rel="noreferrer">核验范围、奖励表与待开放资料 ↗</a></details>
    </fieldset>
  </>;
}
export function PendingContent(){return <details className="optional-rules pending-content"><summary>待开放内容 · 5 张地图与 2 种玩法</summary><ul>{(Object.entries(TRACK_CATALOG) as [MapId,typeof TRACK_CATALOG[MapId]][]).filter(([,map])=>!map.available).map(([id,map])=><li key={id}><strong>{map.name} · {map.kind}</strong><p>{map.description}</p></li>)}<li><strong>Thrilling Thirds · 粉丝特殊赛事</strong><p>完整事件表、抽牌来源及扩展角色映射未取得。当前关闭，无法启用。</p></li><li><strong>社区锦标赛 · 社区方案</strong><p>完整作者方案、阶段与晋级／同分裁定未取得，规则待确认。</p></li></ul></details>;}
