# belmont.cafe — poradnik indeksowania (Google, Bing, AI)

Stan: nowy front Next.js (PL `/`, EN `/en/`, `/visit/`, `/visit/autumn/`). Wszystkie adresy URL,
canonical, hreflang, `@id` w JSON-LD, sitemap i klucz IndexNow są takie same jak na starej stronie,
więc Google nie musi niczego "uczyć się od nowa" — zgłaszamy tylko, żeby przyspieszyć odświeżenie.

## 0. Domena w Vercel — zrobione (2026-10-25)

Przez API Vercel: `belmont.cafe` jest domeną główną (200), `www.belmont.cafe` przekierowuje 308 na
`belmont.cafe`. Canonical, sitemap, schema i IndexNow wskazują spójnie wersję **bez www**.

Sprawdzenie: `curl -I https://belmont.cafe/` → `200`, `curl -I https://www.belmont.cafe/` → `308`.

## 1. Szybki test po wdrożeniu (2 minuty)

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://belmont.cafe/            # 200
curl -s -o /dev/null -w "%{http_code}\n" https://belmont.cafe/en/         # 200
curl -s -o /dev/null -w "%{http_code} -> %{redirect_url}\n" -H "Accept-Language: en-US" https://belmont.cafe/   # 302 -> /en/
curl -s -o /dev/null -w "%{http_code}\n" -A "Googlebot" -H "Accept-Language: en" https://belmont.cafe/          # 200 (boty bez przekierowania)
curl -s https://belmont.cafe/robots.txt | head -3
curl -s https://belmont.cafe/sitemap.xml | grep "<loc>"
curl -s https://belmont.cafe/llms.txt | head -5
curl -s https://belmont.cafe/llms-full.txt | head -3
curl -s https://belmont.cafe/9d9cf5c57e46e7a9f2ceebedc68504ee.txt       # klucz IndexNow
```

Walidacja danych strukturalnych (3 bloki JSON-LD: firma, FAQ, WebSite/WebPage):
- https://search.google.com/test/rich-results → wklej `https://belmont.cafe/` i `https://belmont.cafe/en/`
- https://validator.schema.org/ → to samo (pokaże też `brand: Yume Matcha` i `aggregateRating`)

## 2. Google Search Console

Usługa: najlepiej **domena** (`belmont.cafe`) — obejmuje www i bez www, http i https.

1. **Sitemaps** → `https://belmont.cafe/sitemap.xml` → Prześlij (jeśli już jest, kliknij ponownie,
   żeby pobrało świeży `lastmod`).
2. **Sprawdzanie adresu URL** (lupa u góry) → kolejno:
   - `https://belmont.cafe/`
   - `https://belmont.cafe/en/`
   - `https://belmont.cafe/visit/`
   Dla każdego: *Testuj wersję online* → *Poproś o zindeksowanie*. Limit ~10 zgłoszeń dziennie.
3. Po 2–5 dniach: **Indeksowanie → Strony** — `/` i `/en/` powinny być "Zindeksowane".
   Jeśli `/en/` wpadnie w "Strona z przekierowaniem" albo "Duplikat" — sprawdź, czy
   `rel="alternate" hreflang` jest na obu stronach (jest w `<head>` i w sitemapie).
4. **Ulepszenia → Pytania i odpowiedzi (FAQ)** oraz **Fragmenty rozszerzone**: powinny wykryć
   FAQPage i LocalBusiness/CafeOrCoffeeShop. Błędy = najczęściej zmiana cen w `app/copy.ts`
   bez przebudowy — schema generuje się z tego samego pliku, więc wystarczy deploy.
5. **Linki**: nie ruszać, stary profil linków zostaje (te same URL-e).

Raz w tygodniu przez pierwszy miesiąc: *Skuteczność* → filtr "Strona" `/en/` — czy pojawiają się
zapytania angielskie (matcha Krakow, matcha Kazimierz, best matcha Krakow).

## 3. Bing Webmaster Tools (to z niego korzysta ChatGPT Search i Copilot)

1. https://www.bing.com/webmasters → **Import from GSC** (jeśli jeszcze nie) albo dodaj
   `https://belmont.cafe`.
2. **Sitemaps** → prześlij `https://belmont.cafe/sitemap.xml`.
3. **URL Submission** → wklej `/`, `/en/`, `/visit/` (limit 10/dzień dla nowych usług).
4. **IndexNow** — z terminala, po każdym wdrożeniu:
   ```bash
   node indexnow.mjs
   ```
   (domyślnie wysyła `/`, `/en/`, `/visit/`; `node indexnow.mjs https://belmont.cafe/visit/autumn/`
   dla pojedynczych adresów). Odpowiedź `200`/`202` = przyjęte. Bing dzieli to z Yandex/Seznam.
5. Po ~tygodniu: **Site Explorer** → czy `/en/` jest w indeksie; **SEO Reports** → ewentualne
   uwagi (zwykle "missing H1" nie dotyczy — H1 jest).

## 4. AI / GEO (ChatGPT, Perplexity, Claude, Gemini)

Nie ma "zgłoszenia do indeksu" — modele czytają to, co zwraca strona i wyszukiwarki. Co mamy:
- `robots.txt` jawnie wpuszcza GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot/Claude-User/
  Claude-SearchBot, PerplexityBot/Perplexity-User, Google-Extended, Applebot, Meta, Amazonbot,
  DuckAssistBot, MistralAI-User, CCBot.
- `llms.txt` (skrót PL+EN) i `llms-full.txt` (cała treść strony PL+EN) — modele, które ich szukają,
  dostają gotowe fakty: adres, godziny, ceny, gatunki Yume, Uji, ocena 4,6/436.
- JSON-LD: `CafeOrCoffeeShop` (z `brand: Yume Matcha`, `aggregateRating`, menu z cenami),
  `FAQPage` (12 pytań, osobno PL i EN), `WebSite`+`WebPage` (wersje językowe powiązane).
- Treść widoczna bez JS (SSR) — crawlery AI nie wykonują skryptów.
- Boty AI są logowane w toodip (middleware) — w panelu widać, kto czyta stronę.

Co robić, żeby AI cytowało częściej:
1. **Bing = ChatGPT.** Zindeksowanie w Bing (punkt 3) ma największy wpływ na ChatGPT Search.
2. **Google Business Profile**: link do strony = `https://belmont.cafe/` (bez www), te same godziny
   (9–19 codziennie), ten sam telefon i adres co w JSON-LD (spójność NAP).
3. **Testy co 2–3 tygodnie** — zapytaj ChatGPT (z włączonym wyszukiwaniem), Perplexity i Gemini:
   - "gdzie na matchę w Krakowie", "best matcha Krakow", "matcha tonic Kraków",
     "matcha bar Kazimierz", "Café Belmont godziny otwarcia".
   Jeśli odpowiedź myli fakty — poprawka idzie do `app/copy.ts` (strona + schema + llms-full
   z jednego źródła) i `public/llms.txt`.
4. **Nie zmieniać URL-i.** Każda zmiana adresu to utrata cytowań i ponowne crawlowanie.
5. Opinie Google z frazami "matcha", "Kazimierz" realnie pomagają — modele je czytają z Map.

## 5. Po każdej zmianie treści/cen

```bash
node scripts-llms-full.mjs     # odświeża public/llms-full.txt z app/copy.ts
git add -A && git commit -m "..." && git push    # Vercel wdraża automatycznie
node indexnow.mjs              # Bing/Yandex od razu
```
+ w GSC "Sprawdzanie adresu URL" → "Poproś o zindeksowanie" dla zmienionej strony,
+ w `public/sitemap.xml` podbij `<lastmod>`.

Ceny w `app/copy.ts` są jednym źródłem dla strony, JSON-LD i llms-full; `public/llms.txt`
(skrót) edytuje się ręcznie — przy zmianie cen poprawić też tam.

## 6. Gdyby coś poszło nie tak

- Vercel → Deployments → poprzednie wdrożenie → **Instant Rollback** (stara strona statyczna wraca
  w kilkanaście sekund, URL-e te same).
- Albo `git revert` ostatniego commita na `main` i push.
