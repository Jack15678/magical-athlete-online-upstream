import { useState } from 'react';
import type { RoomView } from '../shared/types.js';
import { CHARACTERS } from '../shared/characters.js';
import { TWIST_CARDS } from '../shared/twists.js';
import { EVENTS_RULES_VERSION } from '../shared/rules-versions.js';
import type { PresentationBeat } from './presentation.js';

export function visibleTwists(room: RoomView, queue: PresentationBeat[] = []) {
  const later = new Set(queue.slice(1).flatMap(beat => beat.events.filter(event => event.type === 'twist').map(event => event.cause)));
  return (room.trackState?.twist?.drawn ?? []).filter(id => !later.has(id));
}

export function TrackInfo({ room, queue }: { room: RoomView; queue?: PresentationBeat[] }) {
  const [collapsed, setCollapsed] = useState('');
  const drawn = visibleTwists(room, queue), key = `${room.code}:${room.round}:${drawn.join(',')}`;
  const expanded = collapsed !== key, event = room.trackState?.event;
  if (room.track !== 'bridges' && !drawn.length && !event) return null;
  return <aside className="race-track-info" aria-label="本场地图规则">
    {room.track === 'bridges' && <details className="track-rule-card" data-testid="bridges-rules">
      <summary>Bridges · 桥上桥下怎样走？</summary>
      <p><strong>只按格号顺序走，交叉处不能换层抄近路。</strong>例如3→4，8→9，不能3→8。</p>
      <p>桥上／桥下配对：3／8、10／13、15／18、20／23。每对在空间上重叠，仍是不同进度。</p>
      <p>同格技能一般同时作用两层；领先、落后和距离按格号算。上层越过会经过两层选手，下层越过只经过下层。</p>
      <p>吸盘鱼仅能跟同格号；跳蛙遇任一层占人都跳过。第二弯道为15格。</p>
      <a href="/rules/bridges.md" target="_blank" rel="noreferrer">完整规则与角色例外</a>
    </details>}
    {!!drawn.length && <section className="twist-card-panel" data-testid="twist-cards" aria-label="本场变化卡">
      <button className="twist-card-toggle" type="button" aria-expanded={expanded} onClick={() => setCollapsed(expanded ? key : '')}>✦ 变化卡 · {drawn.length} 张 <span>{expanded ? '收起' : '查看效果'}</span></button>
      {expanded && <div className="twist-card-list" aria-live="polite">{drawn.map((id, index) => {
        const card = TWIST_CARDS.find(card => card.id === id)!;
        return <article key={id} data-twist-card={id}>
          <small>{index + 1} · {card.duration}</small><h3>{card.name}</h3><p>{card.effect}</p>
          {id === 'randomness-ceased' && room.trackState?.twist?.fixedFaces && <p className="twist-card-status">{room.players.map(player => `${player.name}：${room.trackState!.twist!.fixedFaces![player.id]}点`).join(' · ')}</p>}
          {id === 'season-finale' && room.rulesVersion === EVENTS_RULES_VERSION && <p className="twist-card-status">若抽到时已经发过名次奖励，则保留奖励，继续原比赛，本卡不再改赛制。</p>}
        </article>;
      })}<a href="/rules/competition.md" target="_blank" rel="noreferrer">地图与网页裁定</a></div>}
    </section>}
    {event && <details key={`${room.code}:${room.round}:${event.id}`} className="race-special-event" data-testid="special-event" open><summary>特殊赛事 · {CHARACTERS.find(c => c.id === event.id)?.nameZh ?? event.id}</summary><p>{event.description}</p><p>本场生效；需要你选择时会自动提示，其余效果由系统结算。</p>{event.npc && <p>公共标记：第 {event.npc.position} 格</p>}<a href="/rules/special-events.md" target="_blank" rel="noreferrer">网页适配规则</a></details>}
  </aside>;
}
