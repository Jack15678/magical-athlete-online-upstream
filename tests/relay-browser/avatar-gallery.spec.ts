import { test, expect } from '@playwright/test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mkdirSync } from 'node:fs';
import { Avatar } from '../../src/client/avatars.js';
import { CHARACTER_BY_ID } from '../../src/shared/characters.js';
import { SECOND_WIND_CHARACTERS } from '../../src/shared/second-wind.js';
import { FAN_CHARACTERS } from '../../src/shared/fan-expansions.js';
import { WURSTII_CHARACTERS } from '../../src/shared/wurstii.js';

test('all expansion SVG portraits match the original palette at lobby and mobile sizes',async({page})=>{
  const originals=['banana','hare','gunk','egg','copycat','magician'];
  const card=(id:string)=>`<article><div class="portrait-frame">${renderToStaticMarkup(createElement(Avatar,{id}))}</div><strong>${CHARACTER_BY_ID[id]!.nameZh}</strong><small>${CHARACTER_BY_ID[id]!.nameEn}</small><div class="small-frame">${renderToStaticMarkup(createElement(Avatar,{id}))}</div></article>`;
  await page.setViewportSize({width:1280,height:1230});
  await page.setContent(`<html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;background:#fffdf4;color:#191919;font:14px system-ui;padding:25px 38px}h1{font-size:24px;margin:0 0 6px}p{font-size:12px;margin:0 0 18px;color:#52664c}section{display:grid;grid-template-columns:repeat(6,1fr);gap:8px 22px}h2{margin:18px 0 8px;font-size:14px;border-top:2px solid #191919;padding-top:9px}article{text-align:center;position:relative;min-width:0;height:141px}.portrait-frame{height:91px;width:91px;margin:auto;background:#eff2dd;border:2px solid #536b52;border-radius:50%;padding:2px}.avatar{display:block;width:100%;height:100%}.sw-avatar{border-radius:50%;clip-path:circle(50% at 50% 50%);overflow:hidden}strong{display:block;font-size:12px;margin-top:5px}small{font-size:10px;display:block;color:#69745e}.small-frame{position:absolute;left:calc(50% + 37px);top:70px;width:28px;height:28px;border:1px solid #536b52;border-radius:50%;background:#eff2dd;padding:1px}</style></head><body><h1>二维卡通头像 · 同一套运动会画风</h1><p>原作参考与 36 位 Second Wind 角色。右下角小头像为手机显示尺寸。</p><h2>原作画风参考</h2><section>${originals.map(card).join('')}</section><h2>Second Wind · 36 张独立手绘 SVG</h2><section>${SECOND_WIND_CHARACTERS.map(character=>card(character.id)).join('')}</section></body></html>`);
  await expect(page.locator('svg.sw-avatar')).toHaveCount(72);await expect(page.locator('img,image')).toHaveCount(0);
  mkdirSync('docs/qa/second-wind',{recursive:true});await page.screenshot({path:'docs/qa/second-wind/cartoon-avatar-contact-sheet.png',fullPage:true});
  mkdirSync('docs/qa/expansion-svg',{recursive:true});
  await page.setViewportSize({width:1280,height:720});
  for(const [pack,label,characters] of [
    ['extra-mile','Extra Mile',FAN_CHARACTERS.filter(c=>c.edition==='extra-mile')],
    ['leaf','Leaf’s Fan Expansion',FAN_CHARACTERS.filter(c=>c.edition==='leaf')],
    ['wurstii','Wurstii A',WURSTII_CHARACTERS],
  ] as const){
    await page.locator('body>p').evaluate((el,count)=>{el.textContent=`原作画风参考与 ${count} 位扩展角色。右下角为手机尺寸。`;},characters.length);
    await page.locator('h2').last().evaluate((el,text)=>{el.textContent=text;},`${label} · ${characters.length} 张扁平 SVG`);
    await page.locator('section').last().evaluate((el,html)=>{el.innerHTML=html;},characters.map(c=>card(c.id)).join(''));
    await expect(page.locator('svg.fan-avatar')).toHaveCount(characters.length*2);
    await expect(page.locator('img,image')).toHaveCount(0);
    await page.screenshot({path:`docs/qa/expansion-svg/${pack}.png`,fullPage:true});
  }
});
