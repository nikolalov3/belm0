import type { Metadata } from 'next';
import type { Lang } from './copy';

export const SITE = 'https://belmont.cafe';
export const TOODIP_SITE_ID = '0c511152-cd70-41dc-961c-f5704fdab10f';

const OG_IMAGE = `${SITE}/images/og-belmont.jpg`;

const text = {
  pl: {
    title: 'Café Belmont | Matcha Bar & Specialty Coffee • Kraków, Kazimierz',
    description:
      'Matcha bar i kawiarnia specialty na Kazimierzu w Krakowie. Własna matcha Yume sprowadzana z regionu Uji, autorskie menu jesienne i onigiri robione na miejscu.',
    ogTitle: 'Café Belmont — Matcha Bar & Specialty Coffee',
    ogDescription: 'Matcha z Uji, specialty coffee & onigiri w Krakowie.',
    ogAlt: 'Wnętrze Café Belmont na Kazimierzu w Krakowie',
    twTitle: 'Café Belmont — matcha bar na Kazimierzu',
    twDescription: 'Matcha Yume jako latte, iced i tonic, kawa specialty i onigiri. Kazimierz, kawałek od Placu Nowego.',
    locale: 'pl_PL',
    path: '/',
  },
  en: {
    title: 'Café Belmont | Matcha Bar & Specialty Coffee • Kraków, Kazimierz',
    description:
      'Matcha bar and specialty coffee shop in Kazimierz, Kraków. Our own Yume matcha from the Uji region, a seasonal autumn menu and onigiri made on site.',
    ogTitle: 'Café Belmont — Matcha Bar & Specialty Coffee',
    ogDescription: 'Uji matcha, specialty coffee & onigiri in Kraków.',
    ogAlt: 'Inside Café Belmont in Kazimierz, Kraków',
    twTitle: 'Café Belmont — matcha bar in Kazimierz',
    twDescription: 'Yume matcha as latte, iced and tonic, specialty coffee and onigiri. Kazimierz, a short walk from Plac Nowy.',
    locale: 'en_US',
    path: '/en/',
  },
} as const;

/** Per-language <head> metadata; hreflang pairs stay identical on both pages. */
export function metadataFor(lang: Lang): Metadata {
  const t = text[lang];
  const other = lang === 'pl' ? 'en_US' : 'pl_PL';
  return {
    metadataBase: new URL(SITE),
    title: t.title,
    description: t.description,
    alternates: {
      canonical: `${SITE}${t.path}`,
      languages: {
        pl: `${SITE}/`,
        en: `${SITE}/en/`,
        'x-default': `${SITE}/`,
      },
    },
    openGraph: {
      title: t.ogTitle,
      description: t.ogDescription,
      url: `${SITE}${t.path}`,
      siteName: 'Café Belmont',
      locale: t.locale,
      alternateLocale: [other],
      type: 'website',
      images: [{ url: OG_IMAGE, alt: t.ogAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.twTitle,
      description: t.twDescription,
      images: [OG_IMAGE],
    },
    icons: {
      // "B" from the logotype on matcha green (design/favicons/2-b-matcha.svg)
      icon: [
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon.ico', sizes: 'any' },
      ],
      apple: '/img/icon-180.png',
    },
    manifest: '/site.webmanifest',
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  };
}
