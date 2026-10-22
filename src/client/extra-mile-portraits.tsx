import type { ReactNode } from 'react';
import { Eyes, Feet, yellow, red, blue, pink, green, paper, ink, orange, purple, brown, grey } from './expansion-portrait-parts.js';

// Independently drawn silhouettes, using the model's identifying costume and props.
export const EXTRA_MILE_PORTRAITS: Record<string, ReactNode> = {
  'extra-mile-broken-clock': <>
    <Feet x={43} y={91} gap={33} /><circle cx="60" cy="61" r="38" fill={yellow} />
    <path d="M28 30h64M37 27V17q23-21 46 0v10" fill={ink} /><path d="m57 24-8 18 12 9-6 16M30 60h6m49 0h6M60 87v7" fill="none" />
    <Eyes x={44} y={51} gap={30} small /><path d="m60 61 4 10 15 5m-20-6q-13-9-20 4 12 10 21 1 9 9 20-1-8-12-20-4" fill={ink} /><path d="M22 62 10 73m88-11 12 10" fill="none" />
  </>,
  'extra-mile-cletus': <>
    <path d="m37 72-8 37h60l-9-39z" fill={red} /><path d="M37 30q-5-19 10-20h29l7 25" fill={brown} /><path d="M22 35q38-12 72 0" strokeWidth="7" />
    <path d="M34 39q24-8 48 0l2 20q-1 23-26 20-24-2-24-21z" fill={pink} /><Eyes x={46} y={47} gap={23} small /><path d="M56 59h26q4 12-15 13m-20-8h10" fill={pink} />
    <path d="m36 82 29 11 26-25m-20 22 18 10 22-46-9-5-19 39" fill={brown} /><path d="m91 71 15-31m-10 34 15-31" stroke={grey} strokeWidth="6" /><Feet x={43} y={106} gap={29} />
  </>,
  'extra-mile-doc-paradox': <>
    <ellipse cx="90" cy="61" rx="21" ry="44" fill={green} /><ellipse cx="90" cy="61" rx="12" ry="32" fill={blue} /><path d="m90 30 8 9-11 4m2 46-6-9 10-4" fill={yellow} />
    <path d="m28 67-9 39h54L62 68z" fill={paper} /><path d="M23 37 10 28l18-2-9-15 25 8L51 7l8 15 17-2-7 22" fill={paper} />
    <path d="M26 33q20-13 39 5v24q-17 19-38-1z" fill={blue} /><Eyes x={36} y={43} gap={21} small /><path d="M34 64q12 5 23-2m-25 9 12 19 13-20M21 81 10 73m59 9 13-18" fill="none" /><Feet x={35} y={106} gap={23} />
  </>,
  'extra-mile-doctor-dice': <>
    <Feet x={43} y={94} gap={32} /><path d="M26 32h65v63H26z" fill={paper} /><path d="M26 49 13 70m77-21 16 22" stroke={blue} strokeWidth="7" />
    <Eyes x={45} y={51} gap={27} small /><g fill={red} stroke="none"><circle cx="35" cy="38" r="3" /><circle cx="82" cy="38" r="3" /><circle cx="35" cy="84" r="3" /><circle cx="82" cy="84" r="3" /></g>
    <path d="M46 72q13 8 25-1M35 31v-9h48v9m-42 40v12q0 14 13 14 11 0 11-13V73" fill="none" /><circle cx="62" cy="21" r="12" fill={grey} /><circle cx="62" cy="21" r="4" fill={paper} /><circle cx="70" cy="75" r="5" fill={blue} />
  </>,
  'extra-mile-dom-and-gary': <>
    <path d="M42 91Q6 104 13 73q6-14 13-4" fill="none" stroke={orange} strokeWidth="10" /><path d="M27 83V35L22 14l24 13 20-14 5 24v46q-20 23-44 0z" fill={orange} />
    <Eyes x={38} y={44} gap={22} small /><path d="m42 60 6 5 7-6m-7 6v9m-16-11-17-3m47 2 14-6" fill="none" /><Feet x={35} y={91} gap={24} />
    <path d="M94 101q24 4 18-13" fill="none" stroke={grey} strokeWidth="5" /><ellipse cx="90" cy="87" rx="17" ry="20" fill={grey} /><circle cx="77" cy="65" r="11" fill={grey} /><circle cx="101" cy="65" r="11" fill={grey} /><Eyes x={84} y={79} gap={14} small /><circle cx="92" cy="89" r="4" fill={pink} /><path d="m82 106-5 7m21-7 7 5" />
  </>,
  'extra-mile-echo': <>
    <path d="M14 20q46-7 92 1m-28-2 15-9M49 20v15m20-15v15" fill="none" stroke={brown} strokeWidth="7" />
    <path d="M49 33Q18 40 14 78l19-8 10 18 16-7 17 7 10-18 20 8Q99 40 69 33z" fill={purple} /><path d="M49 33 38 66m31-33 13 32" fill="none" />
    <path d="m43 67-8 29 18-7 8 14 10-14 17 6-8-28z" fill={ink} /><Eyes x={51} y={76} gap={22} small /><path d="m51 91 7-2 6 2 7-4" fill="none" stroke={paper} /><path d="m56 90 2 6 4-6" fill={paper} />
  </>,
  'extra-mile-gingy': <>
    <path d="M41 43q-16-24 6-34 28-9 32 14 1 13-10 20l27 12q12 8 3 18l-22-9 7 34q0 18-15 14L58 89l-11 23q-15 3-15-11l7-36-22 9q-14-7-4-18z" fill={brown} />
    <Eyes x={48} y={27} gap={20} small /><path d="M46 41q13 8 23-2m-46 23 12-6m44 0 12 7M36 98l11 4m23-1 10-4" fill="none" stroke={paper} />
    <path d="m59 57-13-9v18l13-7 13 7V48z" fill={blue} /><circle cx="59" cy="73" r="4" fill={blue} /><circle cx="59" cy="86" r="4" fill={blue} /><path d="M102 100V47q0-15-12-12-10 4-3 13" stroke={paper} strokeWidth="7" fill="none" /><path d="m99 59 6 5m-6 10 6 5m-6 10 6 5m-16-55 6 4" stroke={red} />
  </>,
  'extra-mile-gluebert': <>
    <path d="M44 30 50 8h20l7 22" fill={orange} /><path d="M42 28h36v13q15 8 15 22v31q21 10 8 15-11 5-30-1-15 14-25 1-29 7-30-3-1-7 12-11V63q0-14 14-22z" fill={paper} />
    <path d="M32 62h57v28H32z" fill={orange} /><Eyes x={46} y={67} gap={28} small /><path d="M49 83q11 6 22-1m-40-15-18 8m76-7 15 8M49 34h21" fill="none" /><path d="M60 9v12" stroke={paper} />
  </>,
  'extra-mile-heads': <>
    <path d="M36 80 26 107H13m69-27 9 26h14M24 60 9 49m87 10 15-12" fill="none" strokeWidth="5" /><ellipse cx="59" cy="65" rx="43" ry="24" fill={brown} /><ellipse cx="59" cy="55" rx="43" ry="22" fill={orange} />
    <path d="M27 72v5m13 0v6m19-4v7m20-10v6m13-10v5" strokeWidth="2" /><path d="M43 46V25m29 22V23" strokeWidth="5" /><Eyes x={43} y={22} gap={29} /><path d="M44 58q16 12 32-2M25 52q6-8 14-9" fill="none" />
  </>,
  'extra-mile-honey-pot': <>
    <ellipse cx="28" cy="43" rx="17" ry="25" transform="rotate(-30 28 43)" fill={paper} /><ellipse cx="91" cy="43" rx="17" ry="25" transform="rotate(30 91 43)" fill={paper} />
    <ellipse cx="60" cy="62" rx="30" ry="39" fill={yellow} /><path d="M32 63h56m-53 16h50" strokeWidth="9" /><Eyes x={48} y={40} gap={24} /><path d="m48 23-9-13m33 12 10-13M51 58q10 5 18-2" fill="none" />
    <path d="m33 80 9 25h37l9-25z" fill={blue} /><path d="M38 80h46v10q-6 10-12-2-7 15-12 0-10 9-14-1z" fill={yellow} /><path d="M37 78 26 67m58 12 11-13" strokeWidth="5" />
  </>,
  'extra-mile-king-pete': <>
    <path d="m33 67-9 38h67L80 66z" fill={red} /><path d="M33 31q27-16 53 0v25q-2 25-27 22-26 0-26-22z" fill={blue} /><path d="m32 32-5-23 20 13L59 6l13 16L91 9l-5 23z" fill={yellow} />
    <Eyes x={46} y={45} gap={27} small /><path d="M47 64q12 10 24-2M32 81 17 73m62 11 18-16" fill="none" /><path d="M94 77 100 33q1-12 10-9 6 3 2 14L99 79z" fill={brown} /><path d="m58 81 4 8 9 1-7 5 2 9-8-5-8 5 2-9-7-5 9-1z" fill={yellow} /><Feet x={39} y={104} gap={35} />
  </>,
  'extra-mile-lazy-bones': <>
    <path d="M29 91V40q0-14 13-14h36q13 0 13 14v51" fill={red} /><path d="M16 70q0-11 13-8l8 19h46l8-19q15-3 15 8v34H16z" fill={red} />
    <path d="M43 34q0-19 19-19 20 0 20 20v14l-9 8H51l-8-8z" fill={paper} /><Eyes x={54} y={35} gap={18} small /><path d="m58 48 5-4 5 4m-17 9h24m-15 2v24m-14-17q15 10 29-1m-28 9q14 8 27-1M46 61 35 72l-12-1m51-10 13 10 11-1M58 85 44 98 25 109m43-24 13 13 15 11" fill="none" stroke={grey} strokeWidth="5" />
  </>,
  'extra-mile-marksman': <>
    <path d="M29 58q-6-33 17-39 22-4 24 22l-3 35-14 24H29z" fill={grey} /><path d="M65 35 96 47 64 54z" fill={yellow} /><Eyes x={42} y={34} gap={18} small /><path d="M34 69 57 80 77 60M33 99l-7 12H16m32-13 7 13h12" fill="none" />
    <path d="M89 20q38 39 0 82" fill="none" stroke={brown} strokeWidth="5" /><path d="M89 20v82M60 61h53m-9-6 9 6-9 6m-44-6-9-7m9 7-9 6" fill="none" />
  </>,
  'extra-mile-moneybags': <>
    <path d="M81 87q29 14 25-5-4-9-12-1" fill="none" stroke={pink} strokeWidth="6" /><path d="M28 64h62l4 36H25z" fill={green} /><path d="m36 29-6-12 18 5m26 0 17-7-3 17" fill={pink} /><ellipse cx="59" cy="48" rx="33" ry="28" fill={pink} />
    <path d="M39 22V7h38v15M29 24h60" fill={ink} /><path d="M40 16h36" stroke={blue} strokeWidth="5" /><Eyes x={46} y={40} gap={27} small /><ellipse cx="60" cy="57" rx="17" ry="11" fill={pink} /><path d="M54 55v4m12-4v4M29 74 14 84m76-11 13-11" />
    <circle cx="75" cy="40" r="11" fill="none" stroke={yellow} /><path d="m84 44 4 25" stroke={yellow} /><Feet x={40} y={100} gap={34} />
  </>,
  'extra-mile-mr-fox': <>
    <path d="m36 67-9 43h65L81 67z" fill={blue} /><path d="m28 40 3-30 23 20h15L91 9l2 33-30 35z" fill={orange} /><path d="m31 42 31 12 29-12-12 23-17 12-16-11z" fill={paper} /><Eyes x={45} y={37} gap={29} small /><path d="m55 53 9 1-4 8z" fill={ink} /><path d="m49 63 11 5 12-5m-24 11 13 15 14-16" fill="none" /><path d="m61 80-4 7 4 15 6-15z" fill={red} />
    <path d="M10 81h24v23H10zm6-1v-7h12v7" fill={brown} /><path d="M98 50v52m-13-37h27m-24 1-8 19h16zm20 0-8 19h16z" fill={yellow} strokeWidth="2.5" /><path d="m83 82 15-4" />
  </>,
  'extra-mile-oddball': <>
    <circle cx="60" cy="55" r="39" fill={paper} /><path d="M35 24q18 30-4 59m55-59Q69 54 89 82" stroke={red} fill="none" /><path d="m36 35 9-2m-7 13 9-2m-8 15 8 2m-13 11 8 3m39-36 8 3m-9 9 8 2m-8 10 8-1m-5 12 8-3" stroke={red} strokeWidth="2" />
    <Eyes x={47} y={48} gap={27} small /><path d="M34 37h25v24H34zm28 0h25v24H62zm-3 9h3" fill="none" strokeWidth="5" /><path d="M48 72q11 11 24 0" fill="none" /><path d="M53 72h14v13H53zm7 0v13" fill={paper} /><path d="M22 57 10 69m88-12 12 11" /><Feet x={43} y={93} gap={32} />
  </>,
  'extra-mile-pooh': <>
    <path d="m82 90 8-59m-7 58 20-69m-23 67-6-66" fill="none" strokeWidth="2" /><ellipse cx="74" cy="20" rx="12" ry="15" fill={red} /><ellipse cx="101" cy="22" rx="12" ry="16" fill={red} /><ellipse cx="88" cy="39" rx="11" ry="14" fill={red} />
    <ellipse cx="44" cy="79" rx="29" ry="29" fill={yellow} /><circle cx="25" cy="31" r="10" fill={yellow} /><circle cx="62" cy="31" r="10" fill={yellow} /><circle cx="43" cy="50" r="25" fill={yellow} /><Eyes x={33} y={45} gap={20} small /><ellipse cx="44" cy="58" rx="6" ry="4" fill={ink} /><path d="M35 66q9 7 18-1" fill="none" />
    <path d="m38 82 5 25h27l6-25z" fill={blue} /><path d="M39 82h35v9q-8 9-11-1-8 11-11 0-7 7-11-2z" fill={orange} /><path d="m25 79 15 9m28-16 14 9" strokeWidth="7" /><Feet x={30} y={103} gap={34} />
  </>,
  'extra-mile-robin-hood': <>
    <path d="m33 67-12 40h62L73 65z" fill={green} /><path d="M32 32q22-16 43 0v27q-20 20-42-1z" fill={grey} /><path d="M20 34 65 10l21 25z" fill={green} /><path d="M64 24 82 7q12-1 9 10L70 28" fill={red} />
    <Eyes x={43} y={42} gap={23} small /><path d="M43 59q12 7 22-1M39 70l12 13 13-14M26 91h53" fill="none" /><rect x="47" y="86" width="12" height="10" fill={yellow} /><Feet x={34} y={105} gap={34} />
    <path d="M95 29q32 36 0 75" fill="none" stroke={brown} strokeWidth="5" /><path d="M95 29v75M71 68h43m-7-6 7 6-7 6M72 79l20-11" fill="none" />
  </>,
  'extra-mile-saint-nick': <>
    <path d="M23 74q-23 35 11 37l12-23z" fill={brown} /><path d="m39 62-11 49h57L74 61z" fill={red} /><path d="M34 35V22L57 4l23 18v15z" fill={red} /><path d="M57 11v23m-9-12h18" stroke={yellow} strokeWidth="5" />
    <path d="M34 37h47v24L58 89 33 62z" fill={paper} /><Eyes x={45} y={44} gap={25} small /><ellipse cx="57" cy="57" rx="8" ry="6" fill={pink} /><path d="M45 64q12 8 25-1M56 90v18" fill="none" /><path d="M99 109V28q0-20 13-17 13 6 0 17" fill="none" stroke={yellow} strokeWidth="6" /><path d="M77 79 98 70M29 85l-13-5" strokeWidth="5" />
  </>,
  'extra-mile-school-bully': <>
    <path d="M28 59q-18 9-13 34l17 3 4-21m52-16q21 9 17 33l-17 4-3-21" fill={grey} /><path d="M31 45q-2-27 29-27 28 0 30 27v44H29z" fill={grey} />
    <path d="M29 34q0-27 30-25 26 0 29 20H48l-16 11-14-7z" fill={ink} /><Eyes x={45} y={44} gap={28} small /><ellipse cx="60" cy="62" rx="22" ry="15" fill={pink} /><path d="M46 66h28m-22-9h2m12 0h2" /><path d="M29 84h61v22H64V97h-9v9H29z" fill={blue} />
    <path d="m100 87-9-15m9 15 10-15m-10 15v21" stroke={brown} strokeWidth="6" /><path d="M91 72h19" fill="none" /><Feet x={38} y={105} gap={42} />
  </>,
  'extra-mile-scout': <>
    <path d="m34 70-9 36h63L78 68z" fill={red} /><path d="M32 34q25-17 49 0v27q-23 21-48-1z" fill={red} /><path d="M20 33h75M34 29l9-18h24l14 18" fill={yellow} strokeWidth="5" />
    <Eyes x={43} y={43} gap={26} small /><path d="M45 61q12 8 23-1m-31 12 19 10 18-12" fill="none" /><path d="m39 69 37 37" stroke={yellow} strokeWidth="10" /><g fill={blue}><circle cx="48" cy="80" r="3" /><circle cx="59" cy="91" r="3" /><circle cx="69" cy="101" r="3" /></g>
    <path d="M97 28v80m-68-23-16-8m71 7 13-9" fill="none" /><path d="M98 29h19l-7 13 7 12H98z" fill={green} /><Feet x={39} y={106} gap={33} />
  </>,
  'extra-mile-shuffler': <>
    <path d="m18 32 61-8 12 72-61 9z" fill={red} /><rect x="31" y="14" width="57" height="78" rx="7" fill={paper} /><path d="M46 33q-17 13-2 17 7 1 8-4-2 9-6 11h13q-5-4-5-11 10 10 16-1 3-5-13-18z" fill={ink} />
    <Eyes x={50} y={65} gap={24} small /><path d="M52 82q10 6 20-1M30 56 12 65m75-8 15 9" fill="none" stroke={blue} strokeWidth="5" /><Feet x={46} y={95} gap={28} /><path d="m88 74 18-8 10 27-18 8z" fill={red} /><path d="m94 78 13-6m-11 13 13-6" stroke={paper} />
  </>,
  'extra-mile-silly-goose': <>
    <path d="M29 102q-21-12-10-31l25-8 2-25q1-21 19-21 22 0 22 21L75 61l4 25q0 20-29 20z" fill={paper} /><path d="M80 34 109 44 79 52z" fill={yellow} />
    <path d="M46 34h16l4 5 4-6h15l-4 15H68l-4-8-3 9H48z" fill={ink} /><path d="m52 37 6 4m16-5 5 4" stroke={paper} strokeWidth="2" /><path d="M43 25q19-25 42-3z" fill={blue} /><path d="M64 14V6m-15 0h30" stroke={red} strokeWidth="4" />
    <path d="M28 78q13 20 32-3M41 105l-8 9H20m44-9 7 9h13" fill="none" /><path d="M91 78v9m-4-5h8" stroke={red} />
  </>,
  'extra-mile-snake-eyes': <>
    <path d="M80 88q-5-22-29-16-24 4-24 18 0 20 31 18 42 0 43-20" fill="none" stroke={green} strokeWidth="18" /><path d="M53 84V58q-23-3-22-24 1-22 26-22 25 0 27 22 1 18-17 23v27z" fill={green} />
    <path d="M36 34h18v18H36zm24 0h18v18H60z" fill={paper} /><g fill={ink} stroke="none"><circle cx="45" cy="43" r="3" /><circle cx="69" cy="43" r="3" /></g><path d="M44 58q13 5 28-1M60 64v14m0-1-6 6m6-6 6 6" fill="none" stroke={red} />
    <path d="M33 95q24 12 51-2" fill="none" stroke={paper} strokeWidth="6" /><path d="M43 21h3m20 0h3" strokeWidth="4" />
  </>,
  'extra-mile-snub': <>
    <ellipse cx="27" cy="46" rx="19" ry="27" fill={pink} /><ellipse cx="91" cy="46" rx="19" ry="27" fill={pink} /><path d="M29 51q-2-35 30-35 32 0 32 35v37H28z" fill={pink} /><Eyes x={44} y={40} gap={30} />
    <path d="M54 52v25q-1 17 13 16 16 0 13-16l-11 2q2 8-3 7V52" fill={pink} /><path d="M29 87h61v17H63V96h-9v8H29z" fill={red} /><path d="M35 89v12m9-12v12m28-12v12m9-12v12" stroke={paper} /><Feet x={40} y={104} gap={36} />
  </>,
  'extra-mile-terrible-toddler': <>
    <circle cx="22" cy="48" r="15" fill={pink} /><circle cx="96" cy="48" r="15" fill={pink} /><ellipse cx="59" cy="48" rx="35" ry="34" fill={pink} /><path d="M52 14q5-17 16-4" fill="none" />
    <Eyes x={44} y={38} gap={30} small /><path d="m34 25 15 4m18-1 17-6" fill="none" /><ellipse cx="60" cy="65" rx="15" ry="13" fill={ink} /><path d="M49 71q11-7 22 0" fill={red} /><path d="m34 48-6 11q6 9 12 0zm49-1-6 11q6 9 12 0z" fill={blue} stroke="none" />
    <path d="M38 79h43l7 22-29 12-28-12z" fill={paper} /><path d="m42 82 17 20 16-20M30 82 13 94m74-13 17 12" fill="none" /><circle cx="60" cy="96" r="4" fill={yellow} />
  </>,
  'extra-mile-thief': <>
    <path d="M85 66q31 15 21 42H78L72 81z" fill={brown} /><path d="m89 67-7-14 17 2-4 13" fill={brown} /><path d="m30 68-8 40h57L70 66z" fill={paper} /><path d="M29 79h45m-48 12h51m-50 12h50" strokeWidth="7" />
    <path d="M29 34q22-17 43 0v24q-23 22-44-1z" fill={green} /><path d="M27 31q-1-24 25-24 25 0 24 24z" fill={ink} /><path d="M30 37h44v18H30z" fill={ink} /><Eyes x={40} y={44} gap={22} small /><path d="M41 62q10 6 19-2m-34 20-14 9m64-8 13 4" fill="none" /><Feet x={35} y={107} gap={29} />
  </>,
  'extra-mile-toll-troll': <>
    <path d="m33 68-13 39 16-4 12 7 13-7 13 7 20-3-13-40z" fill={paper} /><path d="M32 37 12 25l6 24 17 8m49-20 22-12-7 25-16 6" fill={green} /><path d="M31 31q29-24 59 2v30q-26 22-58 0z" fill={green} />
    <path d="m29 32 4-22 13 10L58 5l10 15 17-9 6 24-16-8-12 6-14-6z" fill={brown} /><Eyes x={46} y={43} gap={29} small /><path d="M43 63q15 9 33-2" fill={ink} /><path d="m46 62 5-8 5 11m12-2 6-10 4 9" fill={paper} />
    <path d="M25 81 11 92m79-10 17 10" strokeWidth="7" /><circle cx="57" cy="88" r="10" fill={yellow} /><Feet x={38} y={106} gap={39} />
  </>,
  'extra-mile-totally-fair-ref': <>
    <path d="m31 69-9 41h72L81 69z" fill={paper} /><path d="M37 73v34m13-36v37m14-37v37m14-35v34" strokeWidth="7" /><path d="M32 29q-16 7-14 34l15-5m52-29q17 5 15 33l-15-5" fill={grey} />
    <path d="M31 29q26-19 53 0v29q-24 27-52 0z" fill={grey} /><path d="M30 28q-2-23 27-23 29 0 28 23zm-8 1h73" fill={ink} /><Eyes x={43} y={38} gap={29} small /><ellipse cx="58" cy="55" rx="19" ry="12" fill={paper} /><ellipse cx="58" cy="50" rx="9" ry="6" fill={ink} /><path d="M49 65h19M25 83 10 75m78 6 19-12" fill="none" /><path d="m57 76 11 3-5 11-11-4z" fill={yellow} />
  </>,
  'extra-mile-whisper': <>
    <path d="M22 99V45q0-35 36-35 39 0 39 35l8 62-18-10-13 16-14-13-18 12-10-16-18 11z" fill={purple} /><Eyes x={44} y={40} gap={30} />
    <path d="M45 68q15-10 31 0" fill="none" /><path d="M23 67 39 80l15-12-6-7-12 7-10-13m70 12L81 80 66 68l6-7 12 7 11-13" fill={purple} /><path d="M11 33v9m-5-5h10m91-20v10m-5-5h10" stroke={blue} />
  </>,
  'extra-mile-witch-hazel': <>
    <path d="m38 66-15 43h71L79 65z" fill={ink} /><path d="M34 36q24-12 48 0v16l19 10-21 7q-22 11-44-5z" fill={green} /><Eyes x={46} y={44} gap={26} small /><path d="M49 66q11 7 23-1" fill="none" />
    <path d="m29 34 19-19L47 4l25 9 13 21z" fill={ink} /><path d="M22 36h72" strokeWidth="6" /><path d="m43 24 34 1" stroke={purple} strokeWidth="7" /><path d="m19 103 85-60" stroke={brown} strokeWidth="6" /><path d="m20 96-12 3 3 16 15-2 8-9z" fill={yellow} /><path d="m13 104 8 7m-3-12 8 7" strokeWidth="2" /><path d="M35 80 23 68m57 13 15-18" stroke={green} strokeWidth="7" />
  </>,
};
