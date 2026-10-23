import { competitionConfig, expandedSchedule, PRESETS, presetCompetition, REWARD_TIERS, TRACK_CATALOG, unavailableMaps, type CompetitionConfig, type MapId, type PresetId, type RaceCount } from '../shared/competition.js';
import { CHARACTER_PACK_IDS, type RoomConfig } from '../shared/room-config.js';
import { CHARACTERS } from '../shared/characters.js';
import { TRACKS, RACE_POINTS, type TrackId } from '../shared/tracks.js';
import { trackSvgLayout } from './scene/math.js';

export function TrackThumbnail({id}:{id:MapId}) {
  if(!(id in TRACKS))return null;
  const playable=id as TrackId, track=TRACKS[playable],layout=trackSvgLayout(playable,320,110,16);
  const radius=track.nodes?4.3:5.5;
  return <svg className="track-thumbnail" viewBox="0 0 320 110" role="img" data-track={id} data-node-count={layout.nodes.length} aria-label={`${TRACK_CATALOG[id].name} 实际路线与特殊格缩略图`}>
    {layout.edges.map(([from,to])=>{const a=layout.point(from),b=layout.point(to);return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#78967d" strokeWidth={radius*1.5} strokeLinecap="round" />;})}
    {[...layout.nodes].sort((a,b)=>(track.nodes?.[a]?.y??0)-(track.nodes?.[b]?.y??0)).map(index=>{const p=layout.point(index),special=track.specials[index];return <g key={index} data-map-node={index}><rect x={p.x-radius} y={p.y-radius} width={radius*2} height={radius*2} rx="1.5" fill={index===0?'#edb65e':index===track.finish?'#db785b':track.nodes?.[index]?.color??(special?'#e4d77c':'#fff9db')} stroke={(track.nodes?.[index]?.y??0)>0?'#fff9db':'#567966'} strokeWidth={(track.nodes?.[index]?.y??0)>0?1.6:.6} /><text x={p.x} y={p.y+2.8} textAnchor="middle" fontSize={track.nodes?6.7:8} fill="#173f37">{index===0?'起':index===track.finish?'终':special?.kind==='star'?(special.points??1)===1?'★':String(special.points):special?.kind==='trip'?'!':special?.kind==='arrow'?(special.move!>0?'+':'−'):special?.kind==='warp'?'↪':''}</text></g>;})}
    {track.twistBoundary&&(()=>{const a=layout.point(track.twistBoundary.before),b=layout.point(track.twistBoundary.after),x=(a.x+b.x)/2,y=(a.y+b.y)/2;return <g data-twist-boundary={`${track.twistBoundary.before}-${track.twistBoundary.after}`}><circle cx={x} cy={y} r="6" fill="#7850a2" stroke="#fff8df" /><text x={x} y={y+2.7} textAnchor="middle" fontSize="8" fontWeight="900" fill="#fff8df">扭</text></g>;})()}
  </svg>;
}
export function competitionSummary(config:RoomConfig):string {
  const c=competitionConfig(config),name=c.preset==='custom'?'自定义积分赛':PRESETS[c.preset].name;
  return `${name} · ${c.raceCount} 场比赛 · ${new Set(expandedSchedule(c)).size} 张地图 · ${CHARACTER_PACK_IDS.filter(id=>config.characterPacks[id]).length} 个角色包 · ${c.thrillingThirds.enabled?`特殊赛事第 ${c.thrillingThirds.rounds.join('、')} 场`:'特殊赛事关闭'}`;
}
export function SchedulePreview({competition}:{competition:CompetitionConfig}) {
  const maps=expandedSchedule(competition);
  return <ol className="schedule-preview" aria-label="完整逐场安排">{maps.map((id,i)=><li key={i}>
    <span className="race-number">{i+1}</span><span><strong>{TRACK_CATALOG[id].name}</strong><small>{!TRACK_CATALOG[id].available?'地图尚未开放':competition.thrillingThirds.enabled&&competition.thrillingThirds.rounds.includes(i+1)?'Thrilling Thirds · 网页适配':'特殊赛事关闭'}</small></span>
    <span className="race-rewards">第 1 名 <b>{RACE_POINTS[REWARD_TIERS[competition.raceCount][i]!]![0]}</b> 分<br />第 2 名 <b>{RACE_POINTS[REWARD_TIERS[competition.raceCount][i]!]![1]}</b> 分</span>
  </li>)}</ol>;
}
export function CompetitionFields({config,onChange,disabled=false}:{config:RoomConfig;onChange:(value:RoomConfig)=>void;disabled?:boolean}) {
  const c=competitionConfig(config);
  const blocked=[...new Set(c.rotation.flatMap(id=>id in TRACKS?TRACKS[id as TrackId].blockedCharacters??[]:[]))];
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
        <div className="map-options">{(Object.keys(TRACKS) as TrackId[]).filter(id=>TRACK_CATALOG[id].available).map(id=><div key={id}><TrackThumbnail id={id} /><strong>{TRACK_CATALOG[id].name}</strong><p>{TRACK_CATALOG[id].description}</p><button type="button" onClick={()=>custom({rotation:[...c.rotation,id]})}>添加 {TRACK_CATALOG[id].name}</button></div>)}</div>
      </details>
      {!!blocked.length&&<p className="project-rule" role="note">此赛程禁用：{blocked.map(id=>CHARACTERS.find(character=>character.id===id)?.nameZh??id).join('、')}。地图原规则未规定对应弯道，整局选秀、抽牌及复制均排除这些角色。</p>}
      {c.raceCount!==4&&<p className="project-rule">{c.raceCount} 场为项目自定义赛制：每人每场使用未出赛角色；每批按顺序和逆序各选一名，下批首选顺延。不是官方赛制，未获社区平衡性认证。最后一场不加倍。</p>}
      <fieldset disabled={disabled}><legend>特殊赛事 · Thrilling Thirds</legend>
        <label><input type="checkbox" checked={c.thrillingThirds.enabled} onChange={e=>change({...c,thrillingThirds:{enabled:e.target.checked,rounds:e.target.checked?[3]:[]}})} />启用 36 项粉丝事件（网页适配）</label>
        <p>选手揭晓后抽取本场公共规则。原作者用于第三场；此处可选其他场次。独立事件签、双人双角色和扩展地图的适配见<a href="/rules/special-events.md" target="_blank" rel="noreferrer">规则说明</a>。</p>
        {c.thrillingThirds.enabled&&<div className="event-rounds">{Array.from({length:c.raceCount},(_,i)=>i+1).map(round=><label key={round}><input type="checkbox" checked={c.thrillingThirds.rounds.includes(round)} onChange={e=>change({...c,thrillingThirds:{enabled:true,rounds:e.target.checked?[...c.thrillingThirds.rounds,round].sort((a,b)=>a-b):c.thrillingThirds.rounds.filter(n=>n!==round)}})} />第 {round} 场</label>)}</div>}
      </fieldset>
      <h3>完整逐场安排</h3><SchedulePreview competition={c} />
      <details className="source-details"><summary>来源与适配详情</summary><p>基础规则书第18页允许赛前约定地图，第19页为四场总分，第20页给出官方巡回顺序。6／8场与扩展巡回为本项目规则。</p><a href="/rules/competition.md" target="_blank" rel="noreferrer">核验范围、奖励表与待开放资料 ↗</a></details>
    </fieldset>
  </>;
}
export function PendingContent(){return <details className="optional-rules pending-content"><summary>待开放内容 · {Object.values(TRACK_CATALOG).filter(map=>!map.available).length} 张地图与 1 种玩法</summary><ul>{(Object.entries(TRACK_CATALOG) as [MapId,typeof TRACK_CATALOG[MapId]][]).filter(([,map])=>!map.available).map(([id,map])=><li key={id}><strong>{map.name} · {map.kind}</strong><p>{map.description}</p></li>)}<li><strong>社区锦标赛 · 社区方案</strong><p>作者原帖暂无法读取，按当前约定暂缓接入。</p></li></ul></details>;}
