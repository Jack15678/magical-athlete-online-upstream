import type { ReactNode } from 'react';
import { Eyes, Feet, yellow, red, blue, pink, green, paper, ink, orange, purple, brown, grey } from './expansion-portrait-parts.js';

export const WURSTII_PORTRAITS: Record<string, ReactNode> = {
  'wurstii-bart-simpson': <>
    <path d="m32 66-8 30h65L80 66z" fill={red} /><path d="M33 40V13l8 6 5-13 8 12 8-12 6 12 10-11 2 14 9-3v42q-5 21-28 17-28 1-28-21z" fill={yellow} />
    <Eyes x={47} y={38} gap={25} /><path d="M61 49h21q6 9-9 12M46 65q14 7 25-1" fill="none" /><path d="M28 79 12 91m74-12 15 12" stroke={yellow} strokeWidth="8" /><path d="M31 94h52v14H61v-8H52v8H31z" fill={blue} /><Feet x={41} y={107} gap={33} />
  </>,
  'wurstii-bucky-ohare': <>
    <path d="M35 34 30 8q6-13 13 0l7 24m16 0 7-24q7-12 12 1l-7 25" fill={green} /><path d="m34 70-9 37h65L79 70z" fill={red} /><path d="M30 39q28-17 56 0v24q-27 23-54-1z" fill={green} />
    <path d="M28 35h62v8H28z" fill={purple} /><circle cx="33" cy="39" r="5" fill={red} /><Eyes x={44} y={47} gap={29} small /><ellipse cx="60" cy="65" rx="18" ry="11" fill={paper} /><path d="m53 56 7 5 7-5M55 66h11v10H55z" fill={paper} /><path d="M30 87 14 92m71-5 17 5M29 96h58" fill="none" /><rect x="53" y="91" width="13" height="10" fill={yellow} /><Feet x={40} y={107} gap={34} />
  </>,
  'wurstii-bullet-bill': <>
    <path d="M29 29h42q37 0 39 30-2 33-39 33H29z" fill={ink} /><path d="M24 25h14v71H24z" fill={grey} /><path d="M11 40h8M5 54h14M9 69h10M4 83h15" stroke={blue} strokeWidth="4" />
    <Eyes x={68} y={47} gap={23} small /><path d="m59 33 17 7m6-2 14-9" stroke={paper} /><path d="M72 70q12 7 22-2" fill="none" stroke={paper} /><path d="M45 67q-16-14-23 0-5 13 9 17h17l8-9-5-10z" fill={paper} /><path d="M34 68v9m8-10v10" strokeWidth="2" />
  </>,
  'wurstii-chip-n-dale': <>
    <path d="M13 72q-8-26 9-42 22-8 34 13v56H16z" fill={brown} /><circle cx="19" cy="26" r="10" fill={brown} /><circle cx="49" cy="27" r="10" fill={brown} /><path d="M17 28V12h30v16M10 29h45" fill={brown} /><Eyes x={26} y={44} gap={19} small /><ellipse cx="35" cy="63" rx="17" ry="12" fill={paper} /><circle cx="35" cy="55" r="5" fill={ink} /><path d="M29 63h12v10H29z" fill={paper} /><Feet x={23} y={99} gap={25} />
    <path d="M65 52q-5-27 18-30 27-3 24 33v44H65z" fill={orange} /><circle cx="66" cy="29" r="10" fill={orange} /><circle cx="104" cy="29" r="10" fill={orange} /><Eyes x={76} y={45} gap={20} small /><ellipse cx="86" cy="64" rx="18" ry="12" fill={paper} /><circle cx="86" cy="55" r="6" fill={red} /><path d="M79 64h13v9H79z" fill={paper} /><path d="M65 78h41v21H65z" fill={red} /><path d="M71 85h9m12 7h8" stroke={yellow} /><Feet x={73} y={99} gap={25} />
  </>,
  'wurstii-diddy-kong': <>
    <path d="M83 91q26 11 21-20-2-13-10-10" fill="none" stroke={brown} strokeWidth="8" /><path d="M35 71h46l5 33H28z" fill={red} /><circle cx="25" cy="46" r="11" fill={brown} /><circle cx="92" cy="46" r="11" fill={brown} /><ellipse cx="59" cy="46" rx="31" ry="29" fill={brown} /><path d="M33 38q24-18 51 0v21q-24 21-48-1z" fill={paper} /><Eyes x={46} y={42} gap={24} small />
    <path d="M27 28q2-27 32-23 28 0 29 23zm1 0h70" fill={red} strokeWidth="5" /><ellipse cx="60" cy="62" rx="23" ry="12" fill={paper} /><path d="M51 63q10 4 19-1M30 83 15 97m69-14 12 14" fill="none" /><path d="m58 80 5 8 10 2-8 6 2 10-9-5-9 5 2-10-8-6 10-2z" fill={yellow} /><Feet x={39} y={104} gap={33} />
  </>,
  'wurstii-dixie-kong': <>
    <path d="M75 28q31-24 30 18 15 31-5 52l-12-6q13-23 5-39-8-10-19 0z" fill={yellow} /><path d="M33 73h47l5 31H28z" fill={pink} /><circle cx="23" cy="48" r="11" fill={brown} /><circle cx="86" cy="48" r="11" fill={brown} /><ellipse cx="55" cy="48" rx="30" ry="29" fill={brown} /><path d="M31 39q25-19 47 0v23q-24 19-45-2z" fill={paper} />
    <path d="M24 28q8-25 37-19 31 3 23 22z" fill={pink} /><path d="m28 32 52-1" stroke={purple} strokeWidth="6" /><Eyes x={42} y={44} gap={23} small /><ellipse cx="55" cy="63" rx="21" ry="11" fill={paper} /><path d="M46 65q9 5 18-1M29 84l-15 12m66-12 14 12" fill="none" /><Feet x={38} y={104} gap={31} />
  </>,
  'wurstii-dr-wily': <>
    <path d="M32 66 20 110h77L81 66z" fill={paper} /><path d="M31 42 11 34l16-7-12-11 21 3 6-14 15 13 19-11 1 16 21-2-9 13 19 8-23 11" fill={paper} />
    <ellipse cx="59" cy="43" rx="28" ry="26" fill={pink} /><Eyes x={45} y={39} gap={28} small /><path d="m33 27 19 6m12 0 19-7" fill="none" stroke={paper} strokeWidth="6" /><path d="m58 55-14-4-14 11 27 1 7 2 25-4-14-11z" fill={paper} /><path d="M52 65h17m-27 9 17 17 17-18" fill="none" /><path d="m60 77-5 10 6 16 6-16z" fill={ink} /><path d="m27 86-14 9m77-9 15 9" stroke={pink} strokeWidth="7" />
  </>,
  'wurstii-dry-bones': <>
    <ellipse cx="72" cy="79" rx="27" ry="30" fill={grey} /><path d="m66 54-8 20 9 21 18-3m-27-18 34-1" fill="none" /><path d="M32 61q21-9 35 6v29H32z" fill={paper} /><path d="M33 32q-1-25 23-25 28-1 28 27l-8 23H43z" fill={paper} />
    <ellipse cx="49" cy="31" rx="8" ry="12" fill={ink} /><ellipse cx="71" cy="29" rx="8" ry="12" fill={ink} /><path d="M43 43q-16-5-17 7-3 16 28 17h22l-1-16z" fill={paper} /><path d="M36 51v2m13-2v2m-5 9v5m12-5v5m-20 9h29m-28 9h27M32 73 19 84m50-10 12 10" fill="none" /><Feet x={39} y={97} gap={34} />
  </>,
  'wurstii-eric': <>
    <path d="M33 71h51l9 36H25z" fill={blue} /><path d="M31 37q26-17 52 0v28q-28 22-52-1z" fill={pink} /><path d="M29 32q2-24 30-24 29 0 28 24z" fill={grey} /><path d="M30 25 17 23 11 8l10-4 4 12 12 2m48 8 16-4 5-15 9 2-3 21-22 8" fill={paper} />
    <Eyes x={44} y={42} gap={29} small /><path d="m37 52 20 5 20-5 4 18-12 27-12-15-11 14-13-26z" fill={red} /><path d="m48 60 10 3 12-4" fill="none" /><path d="M25 96h67" stroke={ink} strokeWidth="7" /><rect x="54" y="91" width="13" height="10" fill={yellow} /><path d="m29 80-15 12m73-12 15 12" stroke={pink} strokeWidth="9" /><Feet x={38} y={107} gap={39} />
  </>,
  'wurstii-falco-lombardi': <>
    <path d="m34 69-10 39h65L79 68z" fill={paper} /><path d="M33 35 28 8l18 13 24-8-3 16q21 10 14 31-26 23-51-2z" fill={blue} /><Eyes x={44} y={39} gap={28} small /><path d="m35 27 19 6m10-2 18-8" stroke={red} strokeWidth="5" />
    <path d="M55 50 90 57 61 70 43 59z" fill={yellow} /><path d="m42 73 14 17 14-17" fill="none" /><path d="m57 76 9 3-3 27-10-10z" fill={red} /><path d="M25 84 13 98m75-14 15 13" stroke={blue} strokeWidth="8" /><Feet x={39} y={108} gap={34} />
  </>,
  'wurstii-frogger': <>
    <path d="M27 65q-3-28 32-29 37 0 34 30L75 89H43z" fill={green} /><circle cx="38" cy="33" r="19" fill={green} /><circle cx="84" cy="33" r="19" fill={green} /><Eyes x={38} y={31} gap={46} />
    <path d="M35 57q26 18 51-2" fill="none" /><path d="M42 72q18 8 34-2l-7 16H49z" fill={yellow} /><path d="M35 77 15 86l11 18-16 5m74-32 20 9-10 18 17 5M35 65 12 58m73 7 23-8" fill="none" strokeWidth="5" /><path d="m10 105-6 7m8-3v6m97-10 6 7m-8-3v6" fill="none" /><path d="M12 23 7 17m99 5 6-6" stroke={blue} />
  </>,
  'wurstii-hoagie': <>
    <path d="M22 61q-8-47 35-47 43 0 41 52l-15 13H34z" fill={ink} /><ellipse cx="60" cy="42" rx="24" ry="27" fill={pink} /><path d="M34 25q0-22 29-20 24 1 23 19zm-9 1h62" fill={blue} strokeWidth="5" /><Eyes x={49} y={40} gap={23} small /><path d="M49 57q12 6 22-1" fill="none" />
    <path d="M26 68q34-8 67 0l7 34H19z" fill={ink} /><path d="M22 77 10 94m84-17 14 16" stroke={pink} strokeWidth="12" /><path d="M31 101h53v13H65v-7H51v7H31z" fill={blue} /><circle cx="60" cy="82" r="11" fill={paper} /><path d="m48 88 24 10m-25 0 24-10" stroke={paper} strokeWidth="4" /><circle cx="56" cy="80" r="2" fill={ink} /><circle cx="64" cy="80" r="2" fill={ink} />
  </>,
  'wurstii-jason-vorhees': <>
    <path d="m32 68-9 41h66L80 68z" fill={purple} /><path d="M28 42q-1-35 32-35 34 0 34 35v32H28z" fill={ink} /><ellipse cx="61" cy="43" rx="28" ry="34" fill={green} /><Eyes x={49} y={35} gap={24} small />
    <g fill={ink} stroke="none"><circle cx="51" cy="18" r="2" /><circle cx="61" cy="15" r="2" /><circle cx="71" cy="18" r="2" /><circle cx="43" cy="50" r="2" /><circle cx="44" cy="60" r="2" /><circle cx="78" cy="50" r="2" /><circle cx="76" cy="60" r="2" /></g>
    <path d="m57 48 4-5 4 5M55 61h12" fill="none" /><path d="m49 45-7 3m29-3 8 3" stroke={red} /><path d="M28 84 14 93m72-10 13 8" stroke={green} strokeWidth="8" /><path d="M100 82v29h12l-5-29z" fill={grey} /><path d="M101 79v10" strokeWidth="6" /><Feet x={37} y={108} gap={37} />
  </>,
  'wurstii-knuckles': <>
    <path d="M29 40q-5-26 28-28 34-1 36 29l7 29-18-8-8-25M32 29 18 67l16-6 9-27" fill={red} /><path d="M35 29q22-12 43 0v29q-22 20-44-1z" fill={red} /><Eyes x={45} y={37} gap={25} small /><ellipse cx="57" cy="56" rx="20" ry="11" fill={paper} /><ellipse cx="57" cy="49" rx="7" ry="5" fill={ink} /><path d="M47 62h20" />
    <path d="M36 68h42l10 33H28z" fill={red} /><path d="m38 74 20 12 19-12-5 15H45z" fill={paper} /><path d="M33 78 19 87m61-9 16 9" stroke={red} strokeWidth="9" />
    <path d="M11 83q9-8 20 0l-2 15H12zm76 0q10-8 21 0l-2 15H89z" fill={paper} /><path d="m15 84 4-13 5 13m69 0 4-13 5 13" fill={paper} /><path d="M31 106h20m15 0h20" stroke={green} strokeWidth="7" /><Feet x={39} y={107} gap={37} />
  </>,
  'wurstii-lakitu': <>
    <ellipse cx="72" cy="58" rx="24" ry="28" fill={green} /><path d="M35 41q-2-25 23-27 27-1 29 25l-6 36H39z" fill={yellow} /><path d="m56 14 3-11 5 10" fill={brown} /><Eyes x={46} y={37} gap={25} /><circle cx="46" cy="37" r="13" fill="none" stroke={green} strokeWidth="5" /><circle cx="71" cy="35" r="13" fill="none" stroke={green} strokeWidth="5" /><path d="M48 58q12 6 23-1m-36 6-15 10m64-10 13 10" fill="none" />
    <path d="M22 106q-18-2-14-18 2-10 15-10-3-22 17-20 11 0 15 15 18-26 32-6 5-1 11 6 21-2 17 18-1 19-20 17z" fill={paper} /><circle cx="49" cy="87" r="3" fill={green} /><circle cx="71" cy="87" r="3" fill={green} /><path d="M49 98q12 8 23-1" fill="none" stroke={green} />
  </>,
  'wurstii-lizzie': <>
    <path d="M80 88q26 19 27-10l9 18q-10 23-40 7" fill={green} /><path d="M37 61q-10 15-9 39h58q2-24-10-39z" fill={green} /><ellipse cx="57" cy="83" rx="16" ry="24" fill={yellow} /><path d="m77 57 13 9-9 8 14 9-11 9" fill={paper} />
    <path d="M31 27q25-20 50 0l-1 20q25 12 7 24-32 6-57-9z" fill={green} /><Eyes x={42} y={29} gap={28} /><path d="M37 51h3m19 0h3M36 63q19 4 36-1" fill="none" /><path d="M32 77 13 86m71-9 17 8" stroke={green} strokeWidth="11" /><Feet x={38} y={103} gap={38} />
  </>,
  'wurstii-magikarp': <>
    <path d="m80 52 28-22-4 31 5 30-29-16M43 33l8-24 11 12L74 9l-2 27M44 89l9 20 18-23" fill={yellow} /><ellipse cx="57" cy="62" rx="37" ry="33" fill={orange} /><path d="m49 54 28 12-23 16z" fill={paper} /><Eyes x={31} y={47} gap={26} small /><ellipse cx="23" cy="70" rx="15" ry="17" fill={paper} /><ellipse cx="22" cy="70" rx="8" ry="10" fill={red} />
    <path d="M16 81Q3 102 9 105m21-23q2 17 13 18" fill="none" stroke={yellow} strokeWidth="4" /><path d="m69 43 6 4m3 35 5-4" strokeWidth="2" />
  </>,
  'wurstii-mario': <>
    <path d="m32 69-8 30h65L81 68z" fill={red} /><path d="M33 34q24-17 50 0v25q-25 22-49 0z" fill={pink} /><path d="M28 28q0-24 30-24 32 0 32 24zm-3 1h73" fill={red} strokeWidth="5" />
    <circle cx="59" cy="17" r="10" fill={paper} /><path d="M53 22V13l6 5 6-5v9" fill="none" stroke={red} strokeWidth="2.5" /><Eyes x={46} y={39} gap={25} small /><path d="M40 56q8 15 18 7 12 9 21-7l-20-7z" fill={ink} /><ellipse cx="59" cy="50" rx="11" ry="8" fill={pink} />
    <path d="M39 70v17h36V70m-37 16-5 22h22v-9h10v9h22l-8-22" fill={blue} strokeWidth="6" /><circle cx="42" cy="87" r="4" fill={yellow} /><circle cx="75" cy="87" r="4" fill={yellow} /><circle cx="20" cy="96" r="10" fill={paper} /><circle cx="96" cy="96" r="10" fill={paper} /><Feet x={43} y={108} gap={33} />
  </>,
  'wurstii-mr-game-and-watch': <>
    <path d="m48 88-20 22h-9m46-22 19 22h13M43 60 28 78 16 54m56 7 17 17 17-20" strokeWidth="10" fill="none" /><path d="M42 51h32v28q0 17-16 17-16 0-16-17z" fill={ink} /><circle cx="58" cy="29" r="22" fill={ink} /><ellipse cx="80" cy="30" rx="16" ry="9" fill={ink} /><circle cx="14" cy="47" r="11" fill={ink} /><circle cx="108" cy="51" r="10" fill={ink} /><path d="M7 89h18m70-67h15" stroke={blue} strokeWidth="3" /><path d="m8 82 4-7m90-59 5-6" stroke={blue} />
  </>,
  'wurstii-olaf': <>
    <path d="m28 66-12 40h63L71 65z" fill={green} /><ellipse cx="49" cy="43" rx="27" ry="29" fill={pink} /><path d="M22 30q0-22 28-22 28 0 29 22z" fill={grey} /><path d="M23 24 11 20 7 6l10-2 4 13 9 2m45 6 11-6 3-13 10 2-6 20-14 6" fill={yellow} />
    <Eyes x={36} y={40} gap={25} small /><path d="m27 50 22 6 22-6-5 39-17 10-16-10z" fill={yellow} /><path d="M39 61q10 5 19-1" fill="none" /><path d="M18 99h59" stroke={ink} strokeWidth="7" /><Feet x={29} y={106} gap={35} />
    <ellipse cx="96" cy="78" rx="18" ry="32" fill={brown} /><ellipse cx="96" cy="78" rx="13" ry="26" fill={paper} /><path d="M89 55v46m14-45v45" stroke={brown} strokeWidth="3" /><circle cx="96" cy="78" r="7" fill={grey} />
  </>,
  'wurstii-pitfall-harry': <>
    <path d="M25 64h52l10 44H18z" fill={green} /><path d="M29 30q24-14 44 0v27q-23 21-44-1z" fill={pink} /><path d="M25 27 32 9h35l10 18M17 29h69" fill={green} strokeWidth="5" /><Eyes x={39} y={39} gap={24} small /><path d="M39 58q11 6 22-1M31 69l19 14 18-15" fill="none" />
    <path d="M30 83h13v13H30zm29 0h13v13H59z" fill={blue} /><path d="M22 102h61" stroke={brown} strokeWidth="5" /><path d="m25 78-13 11m64-11 20-18" stroke={pink} strokeWidth="8" /><path d="M105 5q-22 36-8 77" fill="none" stroke={brown} strokeWidth="5" /><path d="m102 22-11-6m8 21 13-7m-13 24-11-3" stroke={green} strokeWidth="5" /><Feet x={32} y={108} gap={36} />
  </>,
  'wurstii-simon-belmont': <>
    <path d="M28 62V29q0-25 28-24 30-1 30 29v34z" fill={brown} /><path d="M36 28q20-11 40 0v29q-20 21-40-1z" fill={pink} /><Eyes x={45} y={38} gap={23} small /><path d="M34 25h45" stroke={yellow} strokeWidth="6" /><path d="M47 57q10 5 19-1" fill="none" />
    <path d="m34 66-9 40h63L76 66z" fill={brown} /><path d="m39 69 32 35" stroke={yellow} strokeWidth="7" /><path d="M27 97h59" stroke={ink} strokeWidth="7" /><path d="m29 79-16 12m69-12 14 12" stroke={pink} strokeWidth="9" /><Feet x={38} y={107} gap={34} />
    <path d="m98 83 7-11m-5 7q22 15 10 26-13 9-14-6" fill="none" stroke={brown} strokeWidth="4" /><circle cx="13" cy="91" r="6" fill={paper} />
  </>,
  'wurstii-tails': <>
    <path d="M74 80q29-48 35-17 6 26-25 35M76 89q40-5 30 17-12 15-34-3" fill={orange} /><path d="M97 58q19 1 10 23l-12-7zm-2 40 13 4q-1 14-15 10z" fill={paper} />
    <path d="M28 36 25 12l20 16 22-19 4 26q22 24-5 41l14 28H29L36 76Q13 60 28 36z" fill={orange} /><path d="m30 32 1-12 9 10m20-1 6-10 1 13" fill={paper} /><Eyes x={38} y={41} gap={27} small /><path d="m25 51 28 7 23-9-3 18-22 10-22-11z" fill={paper} /><ellipse cx="52" cy="56" rx="6" ry="4" fill={ink} /><path d="M42 68q10 5 19-2" fill="none" /><ellipse cx="53" cy="88" rx="13" ry="17" fill={paper} /><path d="M27 107h20m18 0h16" stroke={red} strokeWidth="8" />
  </>,
  'wurstii-yoshi': <>
    <path d="m76 36 14 6-8 10 15 5-10 10 12 7-15 10" fill={red} /><path d="M38 66q-14 15-9 37h54q7-24-14-38z" fill={green} /><ellipse cx="57" cy="86" rx="17" ry="23" fill={paper} /><path d="M36 36q-6-25 8-27 10-2 12 20Q57 5 71 9q13 7 7 31z" fill={green} /><Eyes x={44} y={26} gap={24} small />
    <path d="M31 35q24-10 46 4 14 15-5 29-26 9-48-4-16-18 7-29z" fill={green} /><path d="M31 46v2m14-2v2M29 61q18 9 36-1" fill="none" /><path d="M31 78 15 91m66-13 17 12" stroke={green} strokeWidth="10" /><path d="M25 108h25m14 0h24" stroke={orange} strokeWidth="11" />
  </>,
  'wurstii-rollercoaster-tycoon-guest': <>
    <path d="m34 67-11 34h64L77 67z" fill={green} /><path d="M35 29q21-15 42 0v29q-22 21-43-1z" fill={pink} /><path d="M31 31q-9-23 21-25 33-6 28 26l-13-8-7-9-19 14z" fill={brown} /><Eyes x={45} y={39} gap={23} small /><path d="M45 58q10 5 21-1M39 69l16 17 16-17" fill="none" />
    <path d="M31 99h49v14H61v-8H51v8H31z" fill={blue} /><path d="m28 80-15 13m69-13 18 11" stroke={pink} strokeWidth="9" /><path d="M95 91 91 55" fill="none" /><ellipse cx="90" cy="35" rx="17" ry="23" fill={yellow} /><path d="m86 57 5-6 5 7z" fill={yellow} /><path d="m85 20-3 7" stroke={paper} strokeWidth="4" />
  </>,
  'wurstii-spot': <>
    <ellipse cx="58" cy="55" rx="27" ry="36" fill={red} /><path d="M34 46h20l5 6 6-6h20l-3 17H65l-6-8-5 8H37z" fill={ink} /><path d="m40 49 8 4m23-3 6 4" stroke={paper} strokeWidth="2" />
    <path d="M49 77q10 6 19-1m-35-18-17-9-6 7m75 4 18-17M47 90l-5 19m27-19 7 19" fill="none" strokeWidth="5" /><ellipse cx="38" cy="110" rx="12" ry="6" fill={paper} /><ellipse cx="80" cy="110" rx="12" ry="6" fill={paper} /><circle cx="104" cy="41" r="7" fill={paper} /><path d="M105 49v43" strokeWidth="2" /><circle cx="105" cy="98" r="7" fill={red} />
  </>,
  'wurstii-rockford': <>
    <path d="m33 68-9 37h59L75 68z" fill={pink} /><path d="M32 31h45v29q-21 22-44-1z" fill={pink} /><path d="M24 30q-2-25 30-25 31 0 31 25zM20 31h69" fill={pink} strokeWidth="5" /><path d="M34 16h9m21 0h9" strokeWidth="5" />
    <path d="M44 43v10m22-10v10M45 63h19" fill="none" strokeWidth="5" /><path d="m38 73 15 23 15-23" fill="none" strokeWidth="6" /><circle cx="54" cy="101" r="5" fill={ink} /><path d="M28 82 13 92m66-10 14 9" stroke={pink} strokeWidth="9" /><Feet x={37} y={105} gap={32} /><path d="m98 82 13 10-7 15H90l-3-12z" fill={blue} />
  </>,
  'wurstii-burt': <>
    <ellipse cx="59" cy="79" rx="34" ry="32" fill={blue} /><path d="M42 56 38 99m19-43v53m16-53 7 43" stroke={paper} strokeWidth="8" /><path d="M28 53q34-10 62 0L78 65H40z" fill={paper} />
    <path d="M30 30q0-22 28-22 30 0 31 22l-7 21q-23 13-48-1z" fill={yellow} /><Eyes x={45} y={26} gap={28} small /><ellipse cx="34" cy="40" rx="6" ry="8" fill={pink} stroke="none" /><ellipse cx="84" cy="39" rx="6" ry="8" fill={pink} stroke="none" /><path d="M44 46q15 8 28-1M47 9 41 2m21 6V1m12 9V3" fill="none" /><path d="m26 75-12 17m77-17 13 16" stroke={blue} strokeWidth="10" /><Feet x={42} y={108} gap={34} />
  </>,
  'wurstii-piranha-plant': <>
    <path d="M57 92V58" stroke={green} strokeWidth="12" /><path d="M52 81q-24 1-27-21 24-2 27 21zm12 3q2-22 29-20-5 22-29 20z" fill={green} /><path d="M31 93h56l-6 20H37zM27 87h64v12H27z" fill={green} />
    <circle cx="59" cy="36" r="30" fill={red} /><path d="M33 22q20 3 47-3 7 29-24 40-20-8-23-37z" fill={ink} /><path d="m36 24 8 16 7-15 10 15 7-16 9 13 3-15M44 50l6-12 8 15 7-15 8 7" fill={paper} />
    <circle cx="34" cy="41" r="4" fill={paper} stroke="none" /><circle cx="66" cy="10" r="4" fill={paper} stroke="none" /><circle cx="83" cy="43" r="4" fill={paper} stroke="none" />
  </>,
  'wurstii-fluffin-puffins': <>
    <ellipse cx="69" cy="60" rx="28" ry="35" fill={ink} /><ellipse cx="70" cy="66" rx="20" ry="28" fill={paper} /><circle cx="68" cy="28" r="24" fill={paper} /><Eyes x={58} y={24} gap={22} small /><path d="m62 36 27-3-13 15-15-4z" fill={orange} /><path d="M43 53q-17 10-14 28l17-11m48-16q19 14 12 29L91 72" fill={paper} />
    <ellipse cx="27" cy="89" rx="18" ry="23" fill={ink} /><ellipse cx="28" cy="94" rx="13" ry="17" fill={paper} /><circle cx="27" cy="70" r="15" fill={paper} /><Eyes x={21} y={68} gap={13} small /><path d="m23 78 17-2-9 9z" fill={orange} />
    <ellipse cx="88" cy="99" rx="16" ry="17" fill={paper} /><circle cx="87" cy="84" r="13" fill={paper} /><circle cx="82" cy="82" r="2" fill={ink} /><circle cx="93" cy="82" r="2" fill={ink} /><path d="m84 90 16-2-10 8z" fill={orange} />
    <ellipse cx="56" cy="104" rx="12" ry="12" fill={ink} /><circle cx="56" cy="91" r="11" fill={paper} /><circle cx="52" cy="89" r="2" fill={ink} /><circle cx="61" cy="89" r="2" fill={ink} /><path d="m52 96 13-2-6 7z" fill={orange} /><path d="M15 113h12m6 0h10m7 1h12m15 0h11m6 0h10" stroke={orange} strokeWidth="5" />
  </>,
};
