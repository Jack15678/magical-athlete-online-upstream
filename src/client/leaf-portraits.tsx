import type { ReactNode } from 'react';
import { Eyes, Feet, yellow, red, blue, pink, green, paper, ink, orange, purple, brown, grey } from './expansion-portrait-parts.js';

export const LEAF_PORTRAITS: Record<string, ReactNode> = {
  'leaf-catfish': <>
    <path d="M82 88q36-6 20-48l-9-13 19-15q-29-6-34 13l10 32-21 13z" fill={blue} /><path d="M20 49 14 23l27 13q22-10 41 7 25 40-9 59-40 10-54-17z" fill={blue} />
    <path d="M32 70q31-14 48 5 1 26-21 27-24-2-27-32z" fill={paper} /><Eyes x={34} y={48} gap={28} /><ellipse cx="52" cy="65" rx="7" ry="5" fill={pink} /><path d="m43 72-29-6m29 13-26 9m45-16 28-7M61 79l26 10" stroke={paper} strokeWidth="4" /><path d="m37 96-12 13h16m29-13 12 13H67" fill="none" />
  </>,
  'leaf-crash-dummy': <>
    <path d="M35 61h48l-5 31H41z" fill={orange} /><circle cx="60" cy="30" r="23" fill={orange} /><Eyes x={49} y={28} gap={23} small /><path d="M52 44h17" />
    <path d="m35 68-17 17 7 17m59-34 18 16-7 19M46 94l-6 17m34-17 8 17" stroke={orange} strokeWidth="10" /><g fill={grey}><circle cx="35" cy="67" r="6" /><circle cx="84" cy="67" r="6" /><circle cx="18" cy="85" r="5" /><circle cx="102" cy="84" r="5" /><circle cx="46" cy="94" r="6" /><circle cx="74" cy="94" r="6" /></g>
    <circle cx="60" cy="76" r="12" fill={yellow} /><path d="M60 64v24m-12-12h24M60 64a12 12 0 0 1 12 12H60zm0 24a12 12 0 0 1-12-12h12z" fill={ink} />
  </>,
  'leaf-dark-horse': <>
    <path d="M82 74q28-2 25 23L95 88l-8 10" fill={ink} /><path d="M32 60h48q16 1 10 29H33z" fill={blue} /><path d="M34 76 29 108h-9m30-24-5 24h10m19-24 4 24h12" fill="none" strokeWidth="7" />
    <path d="M29 62 19 43l6-28 14 9 16-14 6 30-10 37z" fill={blue} /><path d="m55 21 18 14-10 5 9 12-11 4 4 15-13-3z" fill={ink} /><Eyes x={31} y={36} gap={19} small /><ellipse cx="37" cy="61" rx="17" ry="12" fill={grey} /><path d="M30 58v3m14-3v3m-16 10h15" />
  </>,
  'leaf-filmmaker': <>
    <path d="m37 69-10 29h57L75 68z" fill={paper} /><path d="M36 32q20-14 41 0v27q-21 20-42-1z" fill={pink} /><path d="m33 32-3-18 17 5L59 7l8 13 17-7-6 25-15-12-13 9z" fill={green} /><Eyes x={45} y={41} gap={23} small /><path d="M44 59q11 6 23-2" fill="none" />
    <path d="M32 95h48v17H62v-11H49v11H32z" fill={blue} /><path d="M28 112h20m17 0h21" stroke={yellow} strokeWidth="8" /><path d="M28 78 14 68m64 7 12-17" strokeWidth="5" />
    <path d="M74 39h31v28H74zM105 46l10-6v26l-10-7z" fill={grey} /><circle cx="80" cy="32" r="9" fill={grey} /><circle cx="99" cy="31" r="10" fill={grey} /><circle cx="80" cy="32" r="3" fill={ink} /><circle cx="99" cy="31" r="3" fill={ink} />
  </>,
  'leaf-kangaroo': <>
    <path d="M66 87q20 22 44 20-16 15-47-2" fill={orange} /><path d="M40 40 27 13q-4-16 9-8l17 30m8 2 3-29q10-12 13 2l-4 34" fill={orange} />
    <path d="M35 41q12-15 34-6 18 10 8 29l10 24-15 17H35L24 84l13-23z" fill={orange} /><Eyes x={43} y={43} gap={23} small /><ellipse cx="49" cy="59" rx="20" ry="11" fill={paper} /><circle cx="31" cy="56" r="5" fill={ink} />
    <path d="M39 79h35q0 24-18 21-17-2-18-21z" fill={paper} /><path d="M45 77q9-14 22 0m-33-10-17 7m59-9 16 7" fill="none" /><path d="M38 102 22 112h30m20-10 17 10H62" fill={orange} />
  </>,
  'leaf-loan-shark': <>
    <path d="M36 54 11 65l18 14m56-24 25 14-24 9" fill={blue} /><path d="M29 37q10-25 33-20 29 6 31 35l-7 48H30z" fill={blue} /><path d="M32 27 39 9h16l11 5 18-4 5 17M23 29h78" fill={red} strokeWidth="5" />
    <Eyes x={44} y={40} gap={30} small /><path d="M28 57q30-6 64 0L79 82H43z" fill={orange} /><path d="m32 58 9 13 9-14 10 15 10-15 10 14 10-13m-46 22 7-10 9 11 10-11 8 10" fill={paper} /><path d="m31 95 21 6 14-7 20 7-8 12H41z" fill={blue} />
  </>,
  'leaf-lonely-wolf': <>
    <path d="M83 83q32 1 25-25l-16 9-7-10" fill={grey} /><path d="M35 68h46q15 6 10 28H32z" fill={grey} /><path d="m28 35-8-23 23 11 24-13-5 27 10 21-25 23-23-19z" fill={grey} />
    <path d="m29 58 14 7 18-8-2 14 10 6-19 20-19-12-9-19z" fill={paper} /><Eyes x={33} y={39} gap={23} small /><path d="m37 54 8-5 8 5-8 7z" fill={ink} /><path d="m34 65 10 4 12-5" fill="none" /><Feet x={37} y={95} gap={42} /><path d="M10 32q-5 14 0 22" fill="none" stroke={blue} />
  </>,
  'leaf-nepo-baby': <>
    <path d="M37 76h47l6 23-27 14-30-14z" fill={paper} /><path d="m40 80 23 21 18-21" fill="none" /><circle cx="23" cy="49" r="10" fill={pink} /><circle cx="96" cy="49" r="10" fill={pink} /><ellipse cx="60" cy="46" rx="33" ry="31" fill={pink} />
    <path d="M26 29q-2-24 33-24 32 0 34 24z" fill={pink} /><path d="M26 29h67M35 16v12m12-16v16m12-18v18m12-16v16m12-12v12" fill="none" stroke={purple} /><Eyes x={45} y={42} gap={29} small />
    <ellipse cx="60" cy="63" rx="16" ry="10" fill={orange} /><circle cx="60" cy="65" r="6" fill={paper} /><path d="M38 75q22 27 44 0" fill="none" stroke={yellow} strokeWidth="5" /><circle cx="61" cy="88" r="6" fill={yellow} /><path d="m31 84-15 10m72-10 16 10" stroke={pink} strokeWidth="9" />
  </>,
  'leaf-philanthropist': <>
    <path d="M43 38q17-12 32 0v27q-12 18-32-1z" fill={brown} /><path d="M42 30V8h35v22m-45 2h55" fill={blue} strokeWidth="5" /><path d="M44 23h31" stroke={pink} strokeWidth="6" /><Eyes x={49} y={45} gap={19} small /><path d="M49 61q10 6 19-2" fill="none" />
    <path d="M42 70h34l6 39H35z" fill={blue} /><path d="m47 70 12 17 12-17M59 87v21" fill="none" /><circle cx="66" cy="94" r="2" fill={yellow} /><path d="M39 79 20 90l-10-5m70-6 19 11 11-5" fill="none" strokeWidth="5" />
    <path d="M12 72q-8-12 2-14 7-1 9 6 4-8 10-3 8 8-14 18z" fill={pink} /><circle cx="99" cy="75" r="9" fill={yellow} /><Feet x={44} y={108} gap={27} />
  </>,
  'leaf-race-car': <>
    <path d="M28 33h65v14H28z" fill={red} /><path d="M39 47 28 85h65L80 47z" fill={red} /><path d="M44 49h31l7 20H38z" fill={blue} /><Eyes x={48} y={58} gap={23} small />
    <g fill={ink}><rect x="14" y="46" width="17" height="24" rx="6" /><rect x="89" y="46" width="17" height="24" rx="6" /><rect x="10" y="81" width="22" height="29" rx="7" /><rect x="89" y="81" width="22" height="29" rx="7" /></g>
    <path d="m45 69-8 31h47L73 69z" fill={red} /><path d="M22 98h76v11H22z" fill={red} /><path d="M53 75h14l-3 18h-8z" fill={yellow} /><path d="M6 30h19m-13-9h14m68 96h4" stroke={blue} />
  </>,
  'leaf-revolutionary': <>
    <path d="m33 63-11 45h64L73 63z" fill={purple} /><path d="M33 35q21-18 44-1v26q-22 20-44 0z" fill={pink} /><path d="M22 34 49 8q9-8 20 3l26 6-8 17-18-12-11 14z" fill={purple} /><Eyes x={43} y={43} gap={24} small /><path d="M44 62q12 6 22-1" fill="none" />
    <path d="m41 68 13 21 11-20M54 89v17" fill="none" /><circle cx="66" cy="90" r="3" fill={yellow} /><path d="M25 82 12 92m67-11 19-12M97 109V49q0-12 10-9" fill="none" strokeWidth="5" /><Feet x={35} y={107} gap={35} />
  </>,
  'leaf-sole-survivor': <>
    <path d="M31 31q26-13 52 0v33q-26 15-51 0z" fill={orange} /><path d="M25 31q0-29 33-27 33 1 34 27z" fill={green} /><path d="M21 33h76M60 5v23" fill="none" /><Eyes x={44} y={43} gap={28} small />
    <path d="M57 56Q38 46 29 65l30 4 27-4q-7-19-27-9z" fill={brown} /><path d="m39 58 4 8m7-12 3 13m13-13-3 13m12-10-4 10" stroke={yellow} strokeWidth="2" /><path d="M40 69h37l5 22H34z" fill={orange} />
    <path d="m34 87-9 22 13-4 10 7 11-7 11 7 12-7 11 3-13-21z" fill={green} /><path d="m42 90-4 15m15-15-5 17m18-17 4 17m5-17 7 15" fill="none" /><path d="M101 109V30m-68 47-18 11m64-9 22-12" strokeWidth="5" /><path d="m101 9-8 22h16z" fill={grey} />
  </>,
  'leaf-sore-loser': <>
    <path d="M31 67h54l5 28H27z" fill={orange} /><path d="M32 90h55v18H64v-10H52v10H32z" fill={blue} /><ellipse cx="59" cy="42" rx="29" ry="31" fill={orange} /><Eyes x={43} y={32} gap={29} small /><path d="m33 21 18 5m13-1 18-7" fill="none" />
    <path d="M47 44q25-21 43-1 8 18-14 19H46z" fill={orange} /><path d="M45 67q13-10 29-2M30 79 15 62l5-21m66 37 17-16-5-21" fill="none" strokeWidth="6" />
    <path d="M12 43V29l7-2 4 8 3-7 7 5-3 15zm95 0V29l-7-2-4 8-3-7-7 5 3 15z" fill={orange} /><Feet x={40} y={107} gap={36} />
  </>,
  'leaf-spiteful-spirit': <>
    <path d="M28 105Q2 85 22 49l4 21Q43 43 36 13l18 23Q69 19 65 5q29 16 21 45l12-13q24 40 5 65l-23 11-20-9-13 10z" fill={orange} />
    <path d="M39 99q-14-18 6-47l9 15 17-34q17 22 8 41l13-8q9 31-19 42z" fill={yellow} stroke="none" /><path d="m30 66 24 9-5 9-16-6z" fill={paper} /><path d="m69 75 24-9-3 12-17 6z" fill={paper} /><path d="m44 75 2 5m34-5-2 5" strokeWidth="5" /><path d="m39 94 13-5 8 8 9-8 14 4-10 13-15-5-11 4z" fill={red} />
  </>,
  'leaf-thespian': <>
    <path d="m39 64-20 48h72L75 63z" fill={red} /><path d="M35 31q21-17 45 0v27L59 77 34 56z" fill={orange} /><path d="m35 28-7-19 19 10L59 5l11 14 16-10-6 19z" fill={yellow} /><Eyes x={45} y={40} gap={24} small />
    <path d="m39 53 11 5 9-3 10 3 10-6-3 16-16 14-20-15z" fill={brown} /><path d="M46 61q13 6 23-1" fill="none" stroke={paper} /><path d="m32 70 10 3 3 10 12-3 10 4 9-8 9-4-5 15-21 7-22-8z" fill={paper} />
    <path d="M98 79v32" stroke={brown} strokeWidth="5" /><path d="M84 44q15 7 29-2v22q-2 20-15 20-13-3-14-20z" fill={blue} /><path d="m90 56 5 3m9-3 5-3M92 73q6-12 13-1" fill="none" stroke={paper} /><Feet x={37} y={108} gap={36} />
  </>,
  'leaf-toucan': <>
    <path d="M24 68q-4-35 22-44 28-7 35 20l-8 48-19 17-26-18z" fill={pink} /><path d="M34 37q13-18 32-8l13 19-12 17H37z" fill={yellow} /><Eyes x={44} y={41} gap={22} small />
    <path d="M69 44q19-22 43-8 3 23-43 29z" fill={blue} /><path d="M97 31q12-1 17 7-2 13-16 18z" fill={orange} /><path d="m73 54 28-10M34 69q20-2 28 14L37 97z" fill="none" /><Feet x={40} y={101} gap={23} /><path d="m25 85-13 14 19 2" fill={pink} />
  </>,
  'leaf-triangle-man': <>
    <path d="m60 8 48 88H12z" fill={yellow} /><path d="m60 8 48 88H91z" fill={green} /><Eyes x={46} y={56} gap={26} /><path d="M46 76q13 8 26-2M25 72 11 81m87-9 12 9" fill="none" />
    <path d="m59 87-13-7v18l13-8 13 8V80z" fill={pink} /><circle cx="59" cy="89" r="4" fill={pink} /><Feet x={38} y={98} gap={40} />
  </>,
  'leaf-zombie': <>
    <path d="m32 68-9 28 16-3 9 8 15-6 20 5 9-31z" fill={blue} /><path d="M32 35q-1-22 23-23h25l7 25-4 27q-27 22-50-2z" fill={green} /><path d="M52 14q-4-11 8-9 6-9 14-1 15-1 14 12l-7 10H53z" fill={pink} /><path d="m63 7-4 12m13-12-3 16m10-10-4 8" fill="none" strokeWidth="2" />
    <Eyes x={44} y={40} gap={30} small /><path d="M44 62 74 58l-4 13H48z" fill={ink} /><path d="M50 62h7v8h-7m14-10h6v7h-6" fill={paper} /><path d="M30 75 12 62l-6 5m80 8 22-13 6 5" fill="none" stroke={green} strokeWidth="8" /><path d="M36 95h45v16H65v-9H52v9H36z" fill={brown} />
  </>,
};
