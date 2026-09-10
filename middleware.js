/* Vercel Edge Middleware — wykrywa boty AI czytajace strone i loguje je do toodip stats.
   Serwuje stronę normalnie (brak zwrotu = przejscie dalej). Nie dotyczy ludzi (JS to liczy). */

const SITE_ID = '0c511152-cd70-41dc-961c-f5704fdab10f';
const ENDPOINT = 'https://stats.toodip.com/api/bot';

export const config = {
  // tylko strony, bez assetow i api
  matcher: '/((?!_next|api|.*\\.[a-zA-Z0-9]+$).*)'
};

function detectBot(ua) {
  const m = {
    'GPTBot': /GPTBot/i, 'OAI-SearchBot': /OAI-SearchBot/i, 'ChatGPT-User': /ChatGPT-User/i,
    'ClaudeBot': /ClaudeBot/i, 'Claude-Web': /Claude-Web/i, 'anthropic-ai': /anthropic-ai/i,
    'PerplexityBot': /PerplexityBot/i, 'Perplexity-User': /Perplexity-User/i,
    'CCBot': /CCBot/i, 'Google-Extended': /Google-Extended/i, 'Applebot-Extended': /Applebot-Extended/i,
    'Bytespider': /Bytespider/i, 'Amazonbot': /Amazonbot/i, 'Meta-ExternalAgent': /Meta-ExternalAgent/i
  };
  for (const name in m) { if (m[name].test(ua)) return name; }
  return null;
}

export default function middleware(request, context) {
  try {
    const ua = request.headers.get('user-agent') || '';
    const bot = detectBot(ua);
    if (bot) {
      const path = new URL(request.url).pathname;
      const p = fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: SITE_ID, bot: bot, path: path })
      }).catch(function () {});
      if (context && typeof context.waitUntil === 'function') context.waitUntil(p);
    }
  } catch (e) {}
  // brak zwrotu -> request leci dalej i serwuje stronę normalnie
}
