import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';

/**
 * 1. Language: a visitor whose browser does not prefer Polish is sent from "/"
 *    to "/en/". The PL/EN switch links carry ?lang=…, which is remembered in a
 *    cookie for a year and wins over the browser language. Crawlers are never
 *    redirected, so "/" stays the Polish x-default page for them.
 * 2. AI crawlers are logged to toodip stats (the "AI reads the site" signal).
 *    Humans are counted by s.js in the browser; bots never run it, so they are
 *    detected here by user-agent and reported server-side.
 */

const SITE_ID = '0c511152-cd70-41dc-961c-f5704fdab10f';
const ENDPOINT = 'https://stats.toodip.com/api/bot';
const LANG_COOKIE = 'bm_lang';
const YEAR = 60 * 60 * 24 * 365;

export const config = {
  // pages only, no assets and no api
  matcher: '/((?!_next|api|.*\\.[a-zA-Z0-9]+$).*)',
};

const AI_BOTS: Array<[string, RegExp]> = [
  ['GPTBot', /GPTBot/i],
  ['OAI-SearchBot', /OAI-SearchBot/i],
  ['ChatGPT-User', /ChatGPT-User/i],
  ['ClaudeBot', /ClaudeBot/i],
  ['Claude-Web', /Claude-Web/i],
  ['anthropic-ai', /anthropic-ai/i],
  ['PerplexityBot', /PerplexityBot/i],
  ['Perplexity-User', /Perplexity-User/i],
  ['CCBot', /CCBot/i],
  ['Google-Extended', /Google-Extended/i],
  ['Applebot-Extended', /Applebot-Extended/i],
  ['Bytespider', /Bytespider/i],
  ['Amazonbot', /Amazonbot/i],
  ['Meta-ExternalAgent', /Meta-ExternalAgent/i],
];

// any crawler / link preview: no language redirect for these
const ANY_BOT = /bot|crawl|spider|slurp|lighthouse|preview|facebookexternalhit|whatsapp|telegram|skype|perplexity|anthropic-ai|claude-(user|web)/i;

function detectAiBot(ua: string): string | null {
  for (const [name, re] of AI_BOTS) if (re.test(ua)) return name;
  return null;
}

/** 'pl' when the first (most preferred) language is Polish or the header is missing, otherwise 'en'. */
function langFromHeader(acceptLanguage: string | null): 'pl' | 'en' {
  if (!acceptLanguage) return 'pl';
  const first = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.find((p) => p.trim().startsWith('q='));
      return { tag: tag.trim().toLowerCase(), q: q ? parseFloat(q.split('=')[1]) : 1 };
    })
    .filter((l) => l.tag && !Number.isNaN(l.q))
    .sort((a, b) => b.q - a.q)[0];
  if (!first) return 'pl';
  return first.tag === 'pl' || first.tag.startsWith('pl-') ? 'pl' : 'en';
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const ua = request.headers.get('user-agent') || '';
  const { pathname, searchParams } = request.nextUrl;

  try {
    const bot = detectAiBot(ua);
    if (bot) {
      event.waitUntil(
        fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: SITE_ID, bot, path: pathname }),
        }).catch(() => {}),
      );
    }
  } catch {}

  // PL/EN switch: remember the choice, then show the clean URL
  const chosen = searchParams.get('lang');
  if (chosen === 'pl' || chosen === 'en') {
    const url = request.nextUrl.clone();
    url.searchParams.delete('lang');
    const res = NextResponse.redirect(url, 302);
    res.cookies.set(LANG_COOKIE, chosen, { maxAge: YEAR, path: '/', sameSite: 'lax' });
    return res;
  }

  if (pathname === '/' && !ANY_BOT.test(ua)) {
    const cookie = request.cookies.get(LANG_COOKIE)?.value;
    const want = cookie === 'pl' || cookie === 'en' ? cookie : langFromHeader(request.headers.get('accept-language'));
    if (want === 'en') {
      // absolute URL built by hand: nextUrl drops the trailing slash on Vercel, which cost an extra 308 hop
      const url = new URL('/en/', request.url);
      url.search = request.nextUrl.search;
      const res = NextResponse.redirect(url, 302);
      res.headers.set('Vary', 'Accept-Language, Cookie');
      return res;
    }
  }
  // no return: the request continues and the page is served normally
}
