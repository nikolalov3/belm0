// Generates public/llms-full.txt from app/copy.ts (run: node scripts-llms-full.mjs after copy changes)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
execSync('npx tsc app/copy.ts --outDir .llms-tmp --module es2022 --target es2022 --moduleResolution bundler --skipLibCheck', { stdio: 'inherit' });
fs.renameSync('.llms-tmp/copy.js', '.llms-tmp/copy.mjs');
const { copy, plain } = await import('./.llms-tmp/copy.mjs');
const site = 'https://belmont.cafe';
const sect = (lang) => {
  const c = copy[lang]; const pl = lang === 'pl';
  const L = pl ? {
    title: '# Café Belmont — pełna treść strony (PL)', intro: 'Źródło: https://belmont.cafe/ (wersja angielska: https://belmont.cafe/en/). Ceny w PLN, stan na 2026-10-24.',
    hero: '## O miejscu', autumn: '## Menu jesienne 2026 (sezonowe, ciepłe lub mrożone)', menu: '## Menu', grades: '## Matcha Yume — gatunki', note: `## ${copy.pl.craft.noteTitle}`,
    reviews: '## Opinie gości (Google Maps, 4,6/5, 436 opinii)', visit: '## Wizyta', faq: '## Pytania i odpowiedzi', links: '## Linki',
  } : {
    title: '# Café Belmont — full site content (EN)', intro: 'Source: https://belmont.cafe/en/ (Polish version: https://belmont.cafe/). Prices in PLN, as of 2026-10-24.',
    hero: '## About the place', autumn: '## Autumn menu 2026 (seasonal, hot or iced)', menu: '## Menu', grades: '## Yume matcha — grades', note: `## ${copy.en.craft.noteTitle}`,
    reviews: '## Guest reviews (Google Maps, 4.6/5, 436 reviews)', visit: '## Visit', faq: '## Questions and answers', links: '## Links',
  };
  const items = (arr) => arr.map((m) => `- ${m.name}: ${m.price}${m.sub ? ` — ${m.sub}` : ''}`).join('\n');
  return [
    L.title, '', `> ${L.intro}`, '',
    L.hero, `${c.hero.h1.join(' ')}`, '', `${c.hero.leadBefore}Yume${c.hero.leadAfter}`, '', c.hero.lead2, '', c.marquee.join(' · '), '',
    L.autumn, c.autumn.sub, '', c.autumn.items.map((m) => `- ${m.name}: ${m.price} — ${m.desc}`).join('\n'), '',
    L.menu, c.menu.desc, '', `### ${c.menu.matcha.name}`, c.menu.matcha.note, items(c.menu.matcha.items), c.menu.matcha.info.map(plain).join('\n'), '',
    `### ${c.menu.coffee.name} — ${c.menu.coffee.hot}`, items(c.menu.coffee.hotItems), '', `### ${c.menu.coffee.name} — ${c.menu.coffee.cold}`, items(c.menu.coffee.coldItems), '',
    `### ${c.menu.food.name}`, c.menu.food.note, items(c.menu.food.items), '',
    L.grades, c.craft.desc, '', c.craft.grades.map((g) => `- ${g.name} (${g.grade}; ${g.extra}): ${g.text} ${g.meta}. ${g.href}`).join('\n'), '',
    L.note, c.craft.noteText, '',
    L.reviews, c.reviews.items.map((r) => `- ${r.text} (${r.author})`).join('\n'), '',
    L.visit, c.visit.rows.map(([k, v]) => `- ${k}: ${v}`).join('\n'), c.visit.links.map((l) => `- ${l.label}: ${l.href}`).join('\n'), '',
    L.faq, c.faq.items.map(([q, a]) => `**${q}**\n${plain(a)}`).join('\n\n'), '',
    L.links, `- ${site}/`, `- ${site}/en/`, `- ${site}/visit/`, `- https://yumematcha.pl`, `- https://instagram.com/cafe_belmont`, '',
  ].join('\n');
};
fs.writeFileSync('public/llms-full.txt', sect('pl') + '\n---\n\n' + sect('en'));
fs.rmSync('.llms-tmp', { recursive: true, force: true });
console.log('public/llms-full.txt', fs.statSync('public/llms-full.txt').size, 'bytes');
