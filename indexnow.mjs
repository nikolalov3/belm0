#!/usr/bin/env node
// IndexNow submitter — powiadamia Bing/Yandex/Seznam o zmienionych URL-ach.
// Użycie:
//   node indexnow.mjs                      # wysyła domyślne URL-e (cała strona)
//   node indexnow.mjs https://www.belmont.cafe/visit/   # wybrane URL-e
//
// Klucz jest publiczny (hostowany jako <key>.txt w rootcie) — to zgodne z protokołem.

const KEY = '9d9cf5c57e46e7a9f2ceebedc68504ee';
const HOST = 'www.belmont.cafe';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

const DEFAULT_URLS = [
  `https://${HOST}/`,
  `https://${HOST}/en/`,
  `https://${HOST}/visit/`,
];

const urls = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_URLS;

const body = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urls,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log(`IndexNow -> HTTP ${res.status} ${res.statusText}`);
console.log(`Wysłane URL-e (${urls.length}):`);
urls.forEach((u) => console.log('  ' + u));
if (res.status === 200 || res.status === 202) {
  console.log('OK — zaakceptowane.');
} else {
  const txt = await res.text().catch(() => '');
  console.log('Uwaga — nie 200/202. Body:', txt);
  process.exit(1);
}
