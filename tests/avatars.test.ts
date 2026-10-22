import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Avatar, AVATAR_IDS } from '../src/client/avatars.js';
import { CHARACTERS } from '../src/shared/characters.js';
import { SECOND_WIND_CHARACTERS } from '../src/shared/second-wind.js';
import { FAN_CHARACTERS } from '../src/shared/fan-expansions.js';
import { WURSTII_CHARACTERS } from '../src/shared/wurstii.js';

test('all playable racers have distinct flat vector portraits without raster or model dependencies',()=>{
  assert.equal(AVATAR_IDS.length,CHARACTERS.length);assert.deepEqual([...AVATAR_IDS].sort(),CHARACTERS.map(character=>character.id).sort());
  const drawings = new Set<string>();
  for(const character of CHARACTERS){
    const svg=renderToStaticMarkup(createElement(Avatar,{id:character.id}));
    assert.match(svg,/^<svg /);assert.match(svg,/viewBox="0 0 120 120"/);assert.match(svg,/stroke="#191919"/);assert.match(svg,/stroke-width="3.2"/);
    assert(!/<(?:img|image|filter|linearGradient|radialGradient)\b/.test(svg),'flat shapes only; no model-render image or shading');
    assert((svg.match(/<(?:path|circle|ellipse|rect|polygon)\b/g)??[]).length>=6,character.id);
    drawings.add(svg.replace(/data-character-id="[^"]*"/g,''));
  }
  assert.equal(drawings.size,CHARACTERS.length,'every character has its own silhouette and accessories');
});

test('published SVG portraits match live drawings and the model registry points to the same assets',async()=>{
  for(const [pack, characters] of [
    ['second-wind', SECOND_WIND_CHARACTERS],
    ['extra-mile', FAN_CHARACTERS.filter(c=>c.edition==='extra-mile')],
    ['leaf', FAN_CHARACTERS.filter(c=>c.edition==='leaf')],
    ['wurstii', WURSTII_CHARACTERS],
  ] as const){
  const manifest=JSON.parse(await readFile(new URL(`../public/models/${pack}/manifest.json`,import.meta.url),'utf8'));
  for(const character of characters){
    const svg=await readFile(new URL(`../public/avatars/${pack}/${character.id}.svg`,import.meta.url),'utf8');
    assert.match(svg,/xmlns="http:\/\/www.w3.org\/2000\/svg"/);assert(!/<(?:img|image)\b/.test(svg));
    const live=renderToStaticMarkup(createElement(Avatar,{id:character.id}));
    assert.equal(svg.trim().replace(' xmlns="http://www.w3.org/2000/svg" width="120" height="120"',''),live);
    const model=manifest.models.find((value:{id:string})=>value.id===character.id);assert.equal(model.avatar,`/avatars/${pack}/${character.id}.svg`);
    assert.equal(model.avatarStyle,'flat-cartoon-svg');
    assert(!/url\(|href=|<script\b/.test(svg),'standalone vector with no external requests');
    assert(Buffer.byteLength(svg)<9000,`${character.id}: small avatar byte budget`);
  }
  }
});
