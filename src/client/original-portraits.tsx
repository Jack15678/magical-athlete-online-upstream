import type { ReactNode } from 'react';

// Original pen-and-ink drawings. Back limbs and props are drawn before the body;
// faces and held objects sit in front, so no construction line crosses a face.
const yellow = '#ffda27', red = '#f44735', blue = '#254de4', pink = '#f6a8d0';
const green = '#b5d66b', paper = '#fffdf4', ink = '#191919';
const warm = '#e8b967', rose = '#d77591', slate = '#67849b';

export function Eyes({ x = 46, y = 42, gap = 23, small = false }: { x?: number; y?: number; gap?: number; small?: boolean }) {
  const rx = small ? 5.1 : 7, ry = small ? 6.7 : 9;
  return <g fill={paper} strokeWidth="2"><ellipse cx={x} cy={y} rx={rx} ry={ry} /><ellipse cx={x + gap} cy={y - 1} rx={rx} ry={ry} /><g fill={ink} stroke="none"><ellipse cx={x + 1.3} cy={y + 1} rx={small ? 2.1 : 2.8} ry={small ? 3.1 : 4} /><ellipse cx={x + gap + 1.3} cy={y} rx={small ? 2.1 : 2.8} ry={small ? 3.1 : 4} /></g><g fill={paper} stroke="none"><circle cx={x + 0.3} cy={y - 0.6} r="1" /><circle cx={x + gap + 0.3} cy={y - 1.6} r="1" /></g></g>;
}
function Feet({ x = 38, y = 94, gap = 36 }: { x?: number; y?: number; gap?: number }) {
  const end = Math.min(y + 16, 112), sole = end + 2;
  return <g><path d={`M${x} ${y}v${end-y-3}m${gap} ${-(end-y-3)}v${end-y-3}`} fill="none" strokeWidth="4" /><path d={`M${x-4} ${end-5}h8v8h-18q-2-6 10-8zM${x+gap-4} ${end-5}h8q12 2 10 8h-18z`} fill={ink} /><path d={`M${x-11} ${sole}h14m${gap-6} 0h14`} stroke={paper} strokeWidth="1.3" /></g>;
}
function Blush({ x, y, gap = 30 }: { x:number; y:number; gap?:number }) { return <g fill={rose} opacity=".45" stroke="none"><ellipse cx={x} cy={y} rx="4" ry="2.3" /><ellipse cx={x+gap} cy={y-1} rx="4" ry="2.3" /></g>; }

export const ORIGINAL_PORTRAITS: Record<string, ReactNode> = {
  alchemist: <>
    <Feet x={43} y={96} gap={28} /><path d="m28 71-14-9m74 10 17-15" fill="none" /><circle cx="13" cy="61" r="3" fill={green} />
    <path d="M43 12h30v13L65 35l23 36q18 29-15 30H43Q13 102 27 75l25-40-9-10z" fill={green} />
    <path d="M29 73q15-10 30-2 16 8 28 0l5 12q3 16-23 16H43Q20 98 27 81z" fill={blue} />
    <path d="M45 12h26v10H45z" fill={warm} /><path d="M50 14v5m7-5v5m7-5v5M38 53l-7 15" fill="none" stroke={paper} strokeWidth="3" />
    <Eyes x={48} y={55} gap={22} /><path d="M52 82q10 8 20-1" fill="none" /><circle cx="40" cy="83" r="2" fill={paper} stroke="none" /><circle cx="77" cy="89" r="2.5" fill={paper} stroke="none" />
    <circle cx="95" cy="27" r="7" fill={yellow} /><circle cx="104" cy="13" r="3" fill={green} /><path d="M89 25l2-2m7 14 3 4" stroke={paper} strokeWidth="2" />
  </>,
  'baba-yaga': <>
    <path d="m43 90-10 18-12 3m12-3 6 7m39-25 9 18 14 3m-14-3-6 7" fill="none" strokeWidth="3" />
    <path d="M28 43h65v49H28z" fill={yellow} /><path d="M28 82h65M29 74h12m39 0h12M29 53h11m40 0h12" stroke={warm} strokeWidth="2" />
    <path d="M28 34V14h11v12" fill={blue} /><path d="M17 45 60 13l43 32-5 5-38-25-38 25z" fill={red} /><path d="m35 37 9-6m4-3 8-6m16 10 10 7" stroke={paper} strokeWidth="1.5" opacity=".7" />
    <path d="M39 52h43v22H39z" fill={warm} /><Eyes x={49} y={63} gap={24} small /><path d="M50 92V79q11-8 21 0v13" fill={blue} /><circle cx="66" cy="85" r="1.5" fill={yellow} stroke="none" />
    <path d="m12 29 2-6 2 6 6 2-6 2-2 6-2-6-6-2z" fill={blue} /><path d="M33 10q-5-3-1-7" fill="none" stroke={slate} strokeWidth="2" />
  </>,
  banana: <>
    <path d="m38 92-15 16H11m59-17 12 17h14M27 82 10 72M89 55l17-6" fill="none" />
    <path d="M81 15q-1 44-37 56-16 7-29-3 2 27 23 30 42 3 60-42 8-21 1-38z" fill={yellow} />
    <path d="M81 17 85 8l10 2 2 9z" fill={warm} /><path d="M25 80q14 14 35 4m-11 10q35-10 44-47" fill="none" stroke={warm} strokeWidth="3" />
    <Eyes x={79} y={54} gap={12} small /><path d="M74 72q9 4 15-7" fill="none" /><path d="m85 29-2 9" stroke={paper} strokeWidth="3" /><path d="m19 70 5 2" strokeWidth="3" />
  </>,
  blimp: <>
    <path d="M50 76 54 91m29-15-5 15" fill="none" /><path d="M50 89h33l-4 15H54z" fill={blue} /><path d="M59 93h5v6h-5zm11 0h5v6h-5z" fill={paper} strokeWidth="1.4" />
    <path d="m23 41-17-9 5 18-5 18 18-9" fill={blue} /><path d="M16 49q0-31 47-31 44 1 45 31-2 29-45 29-45 0-47-29z" fill={pink} />
    <path d="M42 22q-17 26-1 51m42-51q16 26 0 51M22 35q39-13 78 1" fill="none" stroke={rose} strokeWidth="2" /><path d="M48 25q12-3 24-1" stroke={paper} strokeWidth="3" fill="none" />
    <Eyes x={55} y={45} gap={22} /><path d="M59 65q11 6 21-1" fill="none" /><path d="M67 104v7m-8-1h16M10 86h15m-8 7h18" fill="none" stroke={slate} strokeWidth="1.8" />
  </>,
  centaur: <>
    <path d="m55 79 1 26 9 5m28-31-2 26 10 5" fill="none" stroke={warm} strokeWidth="6" /><path d="M94 69q18-14 16 5l-4 10" fill="none" stroke={red} strokeWidth="5" />
    <path d="M34 62h53q17 0 16 17l-5 11H40q-13-1-10-15z" fill={red} /><path d="m40 84-8 24H21m62-23 6 24h13" fill="none" strokeWidth="5" />
    <path d="M31 65V45q0-12 18-12 20 0 21 14v22z" fill={blue} /><path d="m35 47-17 9m48-9 17-8" fill="none" strokeWidth="4" /><path d="M36 14q4-12 18-10 17 3 15 19l-3 13H38z" fill={warm} />
    <path d="M38 17q-4-12 9-13 12-2 20 10L54 11l-10 8z" fill={red} /><Eyes x={46} y={24} gap={15} small /><path d="M45 36q8 4 15-1M40 51h19M43 64v-7" fill="none" strokeWidth="1.8" /><path d="M74 73h17" stroke={paper} strokeWidth="2" opacity=".6" />
  </>,
  cheerleader: <>
    <Feet x={47} y={94} gap={26} /><path d="m43 53-17-20m50 20 17-22" fill="none" strokeWidth="5" /><path d="m45 48-13 47h55L71 48z" fill={blue} /><path d="m42 57 17 10 17-10M37 84h45" stroke={paper} strokeWidth="3" fill="none" />
    <path d="M37 29q-2-21 23-22 24 1 23 22v15H38z" fill={warm} /><circle cx="59" cy="29" r="19" fill={pink} /><path d="M41 18q17-17 36 2l-18-5-18 8" fill={warm} />
    <Eyes x={51} y={28} gap={17} small /><path d="M51 42q8 5 16-2" fill="none" /><Blush x={44} y={38} gap={30} />
    <path d="m19 14 4 9 9-7-2 11 12 1-10 7 4 10-12-5-7 9-1-12-12-2 10-7-5-10zM96 12l3 11 12-5-6 11 10 6-12 2-1 12-8-9-11 5 4-12-10-7 12-1 1-11z" fill={red} /><path d="m16 29 11 8m-4-11-3 14m71-10 12 6m-7-12-3 16" stroke={paper} strokeWidth="1.5" />
  </>,
  coach: <>
    <Feet x={43} y={100} gap={33} /><path d="m30 65-16 12m76-12 16 11" fill="none" strokeWidth="4" /><path d="M29 56q31-13 60 0l5 46H24z" fill={blue} /><path d="M34 59v40m49-41v41" stroke={paper} strokeWidth="2" opacity=".75" />
    <path d="M37 31q0-23 24-22 25 0 23 23v22H37z" fill={yellow} /><path d="M33 24q2-18 26-17 25 0 25 17z" fill={red} /><path d="M31 24h57l16 7H76" fill={red} /><path d="M56 11v9" stroke={paper} strokeWidth="2" />
    <Eyes x={50} y={38} gap={22} small /><path d="M50 52q10 5 21-1m-24 9 14 22 13-22" fill="none" /><circle cx="61" cy="83" r="7" fill={paper} /><path d="m59 81 4-1v4h-4zM41 69h8v10h-8z" fill={yellow} strokeWidth="1.4" />
  </>,
  copycat: <>
    <path d="M23 85q-17 5-16-13" fill="none" stroke={blue} strokeWidth="5" /><path d="M20 61V21l18 13 20-14v43q0 23-19 23T20 61z" fill={blue} /><path d="m25 31 9 6m14-1 5-7" stroke={paper} opacity=".55" strokeWidth="2" /><Eyes x={30} y={49} gap={18} small /><path d="m34 65 5 3 5-4M23 67l-10-3m11 9-11 3" fill="none" />
    <path d="M93 96q18 1 16-14" fill="none" stroke={pink} strokeWidth="5" /><path d="M51 83V41l20 13 22-13v44q0 22-21 22T51 83z" fill={pink} /><path d="m57 52 11 6m15-2 6-6" stroke={rose} strokeWidth="2" /><Eyes x={62} y={76} gap={20} small /><path d="m68 91 5 3 5-4m-5 4v6m-20-7-10-2m49 1 11-2" fill="none" /><path d="M58 107v7m27-7v7" strokeWidth="4" />
  </>,
  dicemonger: <>
    <path d="m36 99-8 12H17m58-13 7 13h12M28 60 12 68m84-10 14-8" fill="none" strokeWidth="3" />
    <path d="m26 30 51-14 23 22v51l-54 15-20-22z" fill={yellow} /><path d="m26 30 20 23 54-15M46 53v51" fill="none" /><path d="m30 39 11 13v42L30 81z" fill={warm} stroke="none" />
    <g fill={red} strokeWidth="1.6"><circle cx="42" cy="33" r="3" /><circle cx="69" cy="26" r="3" /><circle cx="76" cy="40" r="3" /></g><Eyes x={63} y={65} gap={20} small /><path d="M62 84q11 6 22-4" fill="none" /><path d="m53 57 2 5m33-15 5-2" stroke={paper} strokeWidth="3" /><circle cx="35" cy="68" r="3" fill={red} />
  </>,
  duelist: <>
    <Feet x={46} y={96} gap={26} /><path d="M55 45h11v12H55z" fill={warm} /><path d="m43 52-10 43h53L73 52z" fill={red} /><path d="m43 54-20 16m52-13 17 7" fill="none" strokeWidth="4" />
    <path d="M39 29q0-23 21-23 19 2 19 23L75 48H43z" fill={paper} /><path d="M43 18q14-10 29-2M41 44l33 1" fill="none" stroke={slate} strokeWidth="2" /><Eyes x={49} y={31} gap={19} small /><path d="M53 45h14" strokeWidth="1.7" />
    <path d="m49 57 9 8 12-8m-12 8v26M39 84h40" fill="none" stroke={paper} strokeWidth="2" /><circle cx="59" cy="76" r="2" fill={yellow} />
    <path d="m91 64 18-34m-22 28 12 7M22 70 12 40m-6 3 14-5" fill="none" stroke={slate} strokeWidth="3" /><path d="m90 66 4-7m-71 13-2-7" stroke={warm} strokeWidth="5" />
  </>,
  egg: <>
    <path d="m30 94-15 14H6m83-14 13 14h9" fill="none" strokeWidth="3" /><path d="M60 10C46 10 23 48 23 75c0 42 74 42 74 0C97 48 74 10 60 10z" fill={paper} />
    <path d="M29 78q1 21 30 25 22 0 30-17" fill="none" stroke={warm} strokeWidth="3" opacity=".55" /><path d="m24 70 16-8 15 12 15-10 26 10" fill="none" />
    <Eyes x={46} y={43} gap={25} /><path d="M51 88q10 7 20-2" fill="none" /><Blush x={36} y={57} gap={46} /><path d="M45 27q-5 6-7 12" fill="none" stroke={warm} strokeWidth="2" opacity=".65" /><circle cx="74" cy="89" r="1.4" fill={warm} stroke="none" />
  </>,
  'flip-flop': <>
    <path d="M32 64 16 72m75-6 15-12" fill="none" strokeWidth="3" /><path d="M48 11q32-7 39 24l11 48q5 24-22 29-22 3-31-17L27 52Q15 20 48 11z" fill={green} />
    <path d="M34 45q-5-21 14-26 25-6 31 18l11 48q3 16-14 18-15 1-22-14z" fill="none" stroke={paper} strokeWidth="2" opacity=".7" /><path d="m35 37 28 13 19-23m-19 23 8 40" fill="none" stroke={red} strokeWidth="7" />
    <Eyes x={48} y={65} gap={25} small /><path d="M52 84q7 8 16 5" fill="none" /><path d="m42 27 3 3m4-7 3 3m24 67 4 4m1-10 4 4" stroke={slate} strokeWidth="1.4" opacity=".6" />
  </>,
  genius: <>
    <Feet x={44} y={97} gap={30} /><path d="M32 62h57l-6 37H40z" fill={yellow} /><path d="M32 61Q14 59 18 42q-7-18 13-23 8-17 25-10 17-13 30 5 22-2 22 20 9 17-11 28z" fill={pink} />
    <path d="M36 24q-12 4-6 15m16-20q10 7 2 15m22-14q-11 6-1 15m18-9q12 4 8 15M56 12v37M28 49q10-6 17 2m19-4q12 8 26-1" fill="none" stroke={rose} strokeWidth="2" />
    <Eyes x={48} y={74} gap={25} small /><path d="M53 89q8 3 15-1" fill="none" /><path d="m34 66 3 17m45-16-2 17" stroke={paper} strokeWidth="2" /><circle cx="25" cy="22" r="2" fill={paper} stroke="none" />
  </>,
  gunk: <>
    <path d="M27 94Q8 91 18 76 7 54 24 48 17 29 36 30 34 13 50 20 66 1 77 22 99 15 96 36 114 45 101 64 113 82 94 89 97 106 79 101 61 114 49 101 31 108 27 94z" fill={green} />
    <path d="M27 50q-6 8-4 14m15-28q3-5 8-5m41 48q8-5 8-10M41 96l9-2" stroke={paper} strokeWidth="3" fill="none" opacity=".75" />
    <Eyes x={44} y={49} gap={28} /><path d="M40 74q19 22 38 0-17 6-38 0z" fill={red} /><path d="M47 78h23" stroke={paper} strokeWidth="2" /><g fill={blue} strokeWidth="1.2"><circle cx="32" cy="35" r="3" /><circle cx="91" cy="71" r="3" /><circle cx="42" cy="92" r="2.4" /><circle cx="79" cy="29" r="2" /></g>
  </>,
  hare: <>
    <path d="M36 50Q14 8 29 7q14-4 25 35M65 43Q68 1 83 8q11 8-4 44" fill={yellow} /><path d="M30 17q6 14 11 25m36-24-5 25" stroke={pink} strokeWidth="5" fill="none" />
    <path d="M27 76q-4-34 30-34 34-1 36 31 6 33-29 32-35 2-37-29z" fill={yellow} /><ellipse cx="62" cy="96" rx="16" ry="8" fill={paper} stroke="none" />
    <Eyes x={46} y={62} gap={25} /><path d="m55 77 7 4 7-5m-7 5v8m-13-2 13 3 12-4M36 99l-15 12h26m31-11 19 11H73" fill="none" /><path d="m31 68-15 4m16 3-15 6m71-13 15-5m-15 12 17 2" fill="none" strokeWidth="1.6" /><Blush x={35} y={79} gap={50} />
  </>,
  heckler: <>
    <path d="M33 78 27 107H15m44-22v25h14" fill="none" strokeWidth="4" /><path d="M19 41v29l57 19V22z" fill={red} /><path d="M24 45v21l42 14" fill="none" stroke={paper} strokeWidth="2" opacity=".6" />
    <ellipse cx="79" cy="55" rx="16" ry="34" fill={yellow} /><ellipse cx="81" cy="55" rx="9" ry="26" fill={warm} /><ellipse cx="84" cy="55" rx="4" ry="16" fill={ink} />
    <Eyes x={36} y={49} gap={17} small /><path d="M29 68q12 7 24-2" fill="none" /><path d="M9 44v22m92-34 10-7m-9 31h13m-13 23 10 7" fill="none" /><path d="m37 84 9 4-3 12-9-3z" fill={blue} />
  </>,
  'huge-baby': <>
    <path d="M32 78 12 88m77-11 17 13M47 101l-7 11H29m41-11 8 11h11" fill="none" strokeWidth="4" /><path d="m32 78 13 27h30l13-28" fill={blue} />
    <path d="M22 47q-3-34 37-34 43-1 41 34 2 38-40 39-41-1-38-39z" fill={pink} /><path d="M53 14q-9-14 5-12m8 12q15-10 13-2" fill="none" strokeWidth="2" />
    <Eyes x={43} y={42} gap={33} /><Blush x={32} y={60} gap={56} /><path d="M46 66q15 14 30-2" fill={paper} /><path d="M59 68v5" strokeWidth="1.5" /><circle cx="60" cy="94" r="4" fill={yellow} /><path d="M40 85l6 6m35-6-6 6" stroke={paper} strokeWidth="2" />
  </>,
  hypnotist: <>
    <Feet x={45} y={99} gap={30} /><path d="m31 43 11-27h39l12 27-5 58H35z" fill={blue} /><path d="m42 17 18-9 15 9m-32 65 18 11 17-11" fill={yellow} />
    <circle cx="61" cy="49" r="25" fill={paper} /><path d="M61 48q1-5 6-2 7 7-3 12-15 4-17-9-2-17 17-18 21 1 20 22" fill="none" strokeWidth="2.3" /><path d="M41 76q20 14 38-2m12-5 15 6-11 25" fill="none" /><circle cx="95" cy="104" r="7" fill={yellow} /><path d="m93 100 2-1" stroke={paper} strokeWidth="2" /><path d="M41 32l-3 10m43 40-1 10" stroke={paper} opacity=".5" strokeWidth="2" />
  </>,
  inchworm: <>
    <path d="M20 86v19m14-20v20m16-21v21m16-21v21m17-21v21m16-21v21" fill="none" strokeWidth="3" />
    <path d="M12 86q-4-22 15-22 1-26 22-22 12-23 30-9 23-7 25 16l-2 38z" fill={green} /><path d="M28 65v21m21-43v43m29-51v51" fill="none" strokeWidth="2" />
    <path d="M78 47V34q-3-20 15-19 18 0 15 20v14z" fill={green} /><Eyes x={86} y={31} gap={15} small /><path d="M89 46q7 4 12-1m-12-28-3-8m15 9 5-8" fill="none" /><circle cx="86" cy="8" r="2" fill={yellow} /><circle cx="106" cy="9" r="2" fill={yellow} /><path d="M17 75h5m12-18 7-4m16-14 9-2" stroke={paper} strokeWidth="3" />
  </>,
  lackey: <>
    <Feet x={40} y={95} gap={34} /><path d="M25 85q-4-29 29-29 34 1 40 40H44z" fill={blue} /><path d="M39 37q1-23 26-21 24 3 17 24l-6 23H42z" fill={yellow} />
    <path d="M41 24q9-14 25-10l9 6" fill={warm} /><Eyes x={49} y={37} gap={19} small /><path d="M48 51q8 4 16-1m-14 16L29 76 20 61m60 10 23-8-2-9" fill="none" />
    <path d="M7 57h29m48-5h27" strokeWidth="4" /><path d="M11 52q9-13 19 0zm78-5q9-13 17 0z" fill={paper} /><circle cx="20" cy="40" r="2" fill={yellow} /><circle cx="98" cy="35" r="2" fill={yellow} /><path d="m43 64 8 6 6-5m-6 5-2 16" fill="none" stroke={paper} strokeWidth="2" />
  </>,
  leaptoad: <>
    <path d="m42 78-25 14 12 17H11m66-31 26 12-11 19h18" fill="none" strokeWidth="5" /><path d="M29 65q-3-32 32-30 35 0 32 31L76 86H44z" fill={green} /><circle cx="41" cy="36" r="16" fill={green} /><circle cx="82" cy="36" r="16" fill={green} />
    <Eyes x={41} y={33} gap={41} small /><path d="M44 79q16-11 31-1l-5 7H49z" fill={yellow} stroke="none" /><path d="M40 60q21 20 41-1M34 70l-16 1m67 0 18-2" fill="none" /><path d="M54 69h13" stroke={red} strokeWidth="4" /><g fill={yellow} stroke="none"><circle cx="35" cy="51" r="2" /><circle cx="88" cy="54" r="2" /><circle cx="29" cy="62" r="1.6" /></g><path d="m16 105-6 4m90-4 9 5" fill="none" strokeWidth="2" />
  </>,
  legs: <>
    <path d="m38 37-4 60-20 9q-6 8 28 5l12-72m14-2 10 59 21 10q12 8-15 6L58 39" fill={pink} /><path d="M37 88h9m29-1 9-2" stroke={paper} strokeWidth="5" /><path d="m32 99 11 3-2 9H15q-4-7 17-12zm46-1 10-1 12 11q5 6-16 4z" fill={paper} />
    <path d="M32 16q27-15 48 2l-8 25H42z" fill={blue} /><path d="M38 16h37" stroke={paper} strokeWidth="3" /><Eyes x={47} y={28} gap={19} small /><path d="M54 40h11M31 26 17 35m65-10 16 8" fill="none" /><path d="M22 108h15m49 0h9" stroke={slate} strokeWidth="1.4" />
  </>,
  'lovable-loser': <>
    <Feet x={45} y={101} gap={28} /><path d="m36 60-10 42h65L79 60z" fill={blue} /><path d="M34 36q-1-27 27-27 28 2 28 28-2 26-28 26-27-1-27-27z" fill={pink} />
    <Eyes x={48} y={33} gap={23} small /><path d="M48 51q13-9 23 1m-28-31 11 3m14-1 12-5" fill="none" /><Blush x={40} y={47} gap={38} />
    <path d="m38 71 17 10m25-10 16 15M46 65l13 9 14-10" fill="none" /><path d="M59 75h22l-5 17H64z" fill={yellow} /><path d="m68 76 6 7-4 9m-2 0v7m-7 0h14" fill="none" strokeWidth="1.8" /><path d="M56 78q-10 0-5 8l10 3m22-10q10-2 6 6l-10 3" fill="none" stroke={yellow} strokeWidth="3" /><path d="m44 37-5 4m1-5 5 5" stroke={paper} strokeWidth="2" />
  </>,
  magician: <>
    <path d="m43 79-16 29h65L78 79" fill={blue} /><path d="m31 86-17-9m72 9 15-23" fill="none" strokeWidth="4" /><path d="M40 48h43v32H40z" fill={yellow} />
    <path d="M40 48 35 16h49l-3 32z" fill={ink} /><path d="m39 34 43-1v11H40z" fill={red} /><path d="M27 49h70" strokeWidth="6" /><path d="m43 21 2 8" stroke={paper} opacity=".6" strokeWidth="2" />
    <Eyes x={50} y={62} gap={22} small /><path d="M50 76q10 4 20-1" fill="none" /><path d="m51 82 10 6 10-6v12l-10-6-10 6z" fill={red} /><circle cx="61" cy="101" r="2" fill={yellow} />
    <path d="m98 70 12-26" strokeWidth="4" /><path d="m107 50 3-6" stroke={paper} strokeWidth="4" /><path d="m14 25 2-7 3 7 7 3-7 2-3 7-2-7-7-2z" fill={yellow} /><circle cx="25" cy="13" r="2" fill={red} stroke="none" />
  </>,
  mastermind: <>
    <Feet x={43} y={88} gap={32} /><path d="M27 32h67v56H27z" fill={red} /><path d="m36 31-8-15m25 15V10m22 21V10m12 21 10-15" fill="none" />
    <g fill={yellow}><circle cx="27" cy="13" r="5" /><circle cx="53" cy="9" r="5" /><circle cx="75" cy="9" r="5" /><circle cx="98" cy="13" r="5" /></g>
    <path d="M33 39h55v32H33z" fill={pink} /><Eyes x={46} y={54} gap={28} /><path d="M45 78h33" strokeWidth="2" /><path d="M27 50H16v25h10m68-25h12v25H95" fill="none" strokeWidth="4" /><circle cx="17" cy="76" r="4" fill={yellow} /><circle cx="105" cy="76" r="4" fill={yellow} /><g fill={paper} stroke="none"><circle cx="32" cy="83" r="1.5" /><circle cx="89" cy="83" r="1.5" /></g>
  </>,
  mouth: <>
    <path d="m34 91-9 18H13m66-16 11 16h14" fill="none" strokeWidth="3" /><path d="M13 55q15-30 45-12 33-21 51 10-12 43-49 44-34-3-47-42z" fill={red} />
    <path d="M20 57q38-13 81-2-12 27-42 27-25 1-39-25z" fill={paper} /><path d="M37 56v15m17-17v23m17-23v22m16-21v15M21 58q38 16 79-3" fill="none" strokeWidth="1.8" /><path d="M24 46q9-6 18-2m39 1q8-4 14 2" stroke={paper} strokeWidth="2" fill="none" opacity=".65" />
    <path d="M44 38v-8m29 7v-9" strokeWidth="3" /><Eyes x={44} y={25} gap={29} small /><path d="m22 80-11-4m89 3 11-5" fill="none" />
  </>,
  'party-animal': <>
    <path d="M29 39 16 25l-3 29 18 9m56-24 19-13-2 28-18 9" fill={blue} /><path d="M29 40q31-21 59 0v44q0 24-29 22-30-1-30-22z" fill={yellow} />
    <path d="m39 32 20-28 23 28z" fill={red} /><path d="m48 19 20 9" stroke={paper} strokeWidth="4" /><circle cx="59" cy="5" r="3" fill={yellow} />
    <Eyes x={45} y={54} gap={29} /><ellipse cx="60" cy="79" rx="17" ry="13" fill={pink} /><path d="m54 74 6 6 7-6m-7 6v6M29 73 12 85m77-12 18 11" fill="none" /><path d="m49 97 11 6 11-6" fill="none" stroke={blue} strokeWidth="3" /><path d="m12 9 2 7m88-8-3 8M17 101l6 4m78-9 6 3" stroke={red} strokeWidth="3" />
  </>,
  'rocket-scientist': <>
    <path d="M43 64 26 91h18m34-27 17 27H78" fill={red} /><path d="M43 31 61 7l18 24v58H43z" fill={paper} /><path d="M43 31h36L61 7z" fill={red} /><path d="M47 35v43" stroke={slate} strokeWidth="2" opacity=".5" />
    <circle cx="61" cy="53" r="18" fill={yellow} /><Eyes x={53} y={51} gap={16} small /><path d="M53 64q8 4 16-1" fill="none" /><path d="M44 80h34v9H44z" fill={blue} /><path d="m48 91 3 20 10-10 9 10 5-20" fill={yellow} /><path d="m57 93 4 10 4-10" fill={red} stroke="none" /><path d="M18 18v10m-5-5h10m78 13v8m-4-4h8" stroke={blue} strokeWidth="2" />
  </>,
  romantic: <>
    <path d="M48 91 41 111H30m41-20 7 20h11M36 79 19 91m66-12 15 9" fill="none" strokeWidth="3" /><path d="M60 96 20 52Q4 25 31 15q18-6 29 13 11-19 29-13 28 10 12 37z" fill={pink} />
    <path d="M26 39q-4-12 8-16m2 0 6 1" fill="none" stroke={paper} strokeWidth="3" /><Eyes x={46} y={43} gap={27} /><path d="M47 65q13 14 26-2" fill="none" /><Blush x={35} y={60} gap={50} />
    <path d="m99 91-3-28m1 15-8-8" stroke={green} strokeWidth="3" fill="none" /><path d="M98 76q8-11 14-6-3 9-14 8z" fill={green} strokeWidth="1.4" /><path d="M88 55q-1-10 9-8 10-5 14 4 4 10-7 14-12 3-16-10z" fill={red} /><path d="M96 52q10-2 8 6l-5 1-3-4" fill="none" strokeWidth="1.5" />
  </>,
  scoocher: <>
    <path d="M39 87v20H27m54-20v20h15" fill="none" strokeWidth="4" /><path d="M30 43q-6-34 18-33 27 0 23 33v29H30z" fill={blue} /><path d="M32 71h55q15 0 12 18H31z" fill={yellow} />
    <path d="M36 73h45q8 0 10 6" stroke={paper} strokeWidth="2" fill="none" /><Eyes x={42} y={37} gap={18} small /><path d="M40 57q9 7 19-2M29 51 16 60m55-6 15-12" fill="none" /><path d="M84 42h21" strokeWidth="5" /><path d="M37 18q5-4 11-3" stroke={paper} strokeWidth="2" fill="none" opacity=".55" /><path d="M8 96h12m-10 10h10m83-11h9" stroke={slate} strokeWidth="2" fill="none" />
  </>,
  sisyphus: <>
    <path d="M10 109h101L93 81z" fill={green} /><path d="M22 106 87 87m-41 18 7-2m28-4 8-2" stroke={paper} strokeWidth="2" opacity=".6" />
    <path d="M75 18q27-5 31 21 6 30-18 35-28 5-32-21-5-24 19-35z" fill={blue} /><path d="m72 28 11-3m13 18 3 12m-27 9 8 3" stroke={paper} strokeWidth="2" fill="none" /><path d="m82 25 10 10-3 8 9 8" fill="none" stroke={slate} strokeWidth="1.5" />
    <path d="m37 77-9 17 22 4m-20-5-15 14m34-9 8 9" fill="none" strokeWidth="4" /><circle cx="36" cy="61" r="16" fill={yellow} /><Eyes x={30} y={58} gap={13} small /><path d="M32 72h12m-3 7 16-15m-16 17 22-7" fill="none" /><circle cx="59" cy="64" r="3" fill={yellow} /><circle cx="64" cy="74" r="3" fill={yellow} />
  </>,
  skipper: <>
    <path d="m45 94-15 15H18m56-15 15 15h14" fill="none" strokeWidth="3" /><path d="M32 59q27-17 55 0l6 36H27z" fill={blue} /><path d="M38 33q-1-22 23-21 24 0 23 22v23H38z" fill={yellow} />
    <path d="M34 23q26-15 55 0l-6 10H40z" fill={paper} /><path d="M46 12h30v13H46z" fill={paper} /><path d="M38 29h47" stroke={blue} strokeWidth="3" /><path d="m61 16 2 4-3 2-3-2 1-4" fill={yellow} strokeWidth="1.2" />
    <Eyes x={51} y={42} gap={21} small /><path d="M53 54q9 3 18-1m-29 9 19 12 18-12M30 69 14 78m76-9 15 9" fill="none" /><path d="M61 78v13m-8-5q8 11 16 0m-12-5h8" stroke={paper} fill="none" strokeWidth="2" /><path d="M34 91h17m22 0h12" stroke={paper} strokeWidth="1.8" />
  </>,
  stickler: <>
    <path d="M43 101v12H31m40-12v12h12M31 63 15 76m70-13 16 12" fill="none" strokeWidth="3" /><path d="M33 13h51v90H31z" fill={yellow} /><path d="M34 13h28v18H34" fill={blue} /><path d="M38 42h9m-9 12h5m-5 13h9m-9 12h5m-5 13h9" strokeWidth="1.8" />
    <Eyes x={59} y={50} gap={15} small /><path d="M58 72h15m-16 9h16" fill="none" strokeWidth="1.7" /><path d="M36 17h6m3 0h4m3 0h4" stroke={paper} strokeWidth="1.4" />
    <path d="M88 18h19v33H88z" fill={paper} /><path d="m92 27 4 4 7-8m-11 17h10m-10 5h7" fill="none" strokeWidth="1.5" /><path d="M92 17v-3h10v3" fill={slate} />
  </>,
  suckerfish: <>
    <path d="m23 55-15-14v36l17-15M45 35l-1-13q15-6 31 10m-21 50 3 12 17-12" fill={pink} /><path d="M24 54q21-24 52-21 19 1 20 23 1 26-22 28-29-1-50-22z" fill={blue} />
    <path d="m34 55 11 8-8 9" fill={pink} /><path d="M46 87l-5 13m34-14 4 14" fill="none" /><Eyes x={67} y={50} gap={17} small /><ellipse cx="98" cy="66" rx="10" ry="15" fill={yellow} /><ellipse cx="100" cy="66" rx="4" ry="9" fill={pink} /><path d="m50 41 7-2m-5 38 8 1" stroke={paper} strokeWidth="2" opacity=".65" />
  </>,
  'third-wheel': <>
    <path d="M37 33q-5-24 18-24 26 0 23 24z" fill={blue} /><Eyes x={47} y={23} gap={18} small /><path d="m21 66-14 5m90-6 14 5M39 105l-12 9m47-9 12 9" fill="none" strokeWidth="3" />
    <circle cx="58" cy="70" r="37" fill={red} /><circle cx="58" cy="70" r="25" fill={paper} /><path d="M58 46v18m-21 17 16-9m27 9-17-9" fill="none" strokeWidth="4" /><circle cx="58" cy="70" r="7" fill={yellow} /><circle cx="58" cy="70" r="2" fill={ink} stroke="none" />
    <path d="M30 57q4-10 13-15m38 8 4 6M36 93l6 5" fill="none" stroke={paper} strokeWidth="2" opacity=".75" /><path d="M47 108h22" stroke={slate} strokeWidth="1.5" />
  </>,
  twin: <>
    <path d="M25 97v13H15m30-13v13h8m25-13v13H68m30-13v13h11" fill="none" strokeWidth="3" /><path d="M13 65q-3-37 24-37 26-1 25 37l-7 33H20z" fill={pink} /><path d="M61 65q0-37 27-37 25 0 23 37l-7 33H68z" fill={blue} />
    <Eyes x={27} y={50} gap={16} small /><Eyes x={78} y={50} gap={16} small /><path d="M29 71q9 7 18-1m32 1q9 7 18-1M62 80v12" fill="none" /><path d="m22 83 31 2m19-2 29 2" stroke={paper} strokeWidth="3" /><circle cx="36" cy="88" r="3" fill={blue} /><circle cx="86" cy="88" r="3" fill={pink} />
    <path d="M33 16h58m-58 0 6-5m-6 5 6 5m52-5-6-5m6 5-6 5" stroke={red} fill="none" strokeWidth="2" />
  </>,
};
