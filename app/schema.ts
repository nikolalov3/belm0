/**
 * Structured data for belmont.cafe (JSON-LD rendered by app/Shell.tsx), per language.
 * Carried over from the previous site and kept in step with the page copy
 * (app/copy.ts), so what AI assistants and search engines read matches what the page shows.
 * aggregateRating is the real Google rating (4.6, 436 reviews) — never invent it.
 */

import { copy, plain, type Lang } from './copy';

const SITE = 'https://belmont.cafe';
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Belmont%2C%20ul.%20Berka%20Joselewicza%2012%2C%20Krak%C3%B3w';

const offer = (price: string) => ({ '@type': 'Offer', price, priceCurrency: 'PLN' });
const item = (name: string, price: string) => ({ '@type': 'MenuItem', name, offers: offer(price) });

const text = {
  pl: {
    description:
      'Matcha bar i kawiarnia specialty na Kazimierzu w Krakowie, kawałek od Placu Nowego i blisko centrum. Własna matcha Yume sprowadzana z regionu Uji, matcha latte, iced matcha i matcha tonic, kawa specialty i onigiri robione na miejscu.',
    cuisine: ['Matcha', 'Kawa specialty', 'Onigiri'],
    knowsAbout: ['Matcha', 'Matcha ceremonialna', 'Yume matcha', 'Kawa specialty', 'Onigiri', 'Hojicha'],
    plantMilk: 'Mleko roślinne (Oatly, Sproud)',
    coFounder: 'Współzałożyciel',
    sections: {
      matcha: 'Matcha Yume',
      autumn: 'Menu jesienne 2026',
      hot: 'Kawa na ciepło',
      cold: 'Kawa na zimno',
      food: 'Onigiri i śniadania',
    },
    usucha: (grade: string) => `Tradycyjna matcha na wodzie (usucha, czarka chawan) – Yume ${grade}`,
    path: '/',
  },
  en: {
    description:
      'Matcha bar and specialty coffee shop in Kazimierz, Kraków, a short walk from Plac Nowy and close to the centre. Our own Yume matcha from the Uji region, matcha latte, iced matcha and matcha tonic, specialty coffee and onigiri made on site.',
    cuisine: ['Matcha', 'Specialty coffee', 'Onigiri'],
    knowsAbout: ['Matcha', 'Ceremonial matcha', 'Yume matcha', 'Specialty coffee', 'Onigiri', 'Hojicha'],
    plantMilk: 'Plant-based milk (Oatly, Sproud)',
    coFounder: 'Co-founder',
    sections: {
      matcha: 'Yume Matcha',
      autumn: 'Autumn menu 2026',
      hot: 'Hot coffee',
      cold: 'Cold coffee',
      food: 'Onigiri and breakfast',
    },
    usucha: (grade: string) => `Traditional matcha on water (usucha, chawan bowl) – Yume ${grade}`,
    path: '/en/',
  },
} as const;

/** Menu lines from the page copy as MenuItems; the usucha line is split into its three grades. */
function menuItems(items: { name: string; price: string }[]) {
  return items
    .filter((m) => !m.price.includes('/'))
    .map((m) => item(m.name, m.price.replace(/\D/g, '')));
}

export function schemaFor(lang: Lang) {
  const t = text[lang];
  const c = copy[lang];

  const business = {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${SITE}/#business`,
    mainEntityOfPage: `${SITE}${t.path}`,
    name: 'Café Belmont',
    description: t.description,
    url: SITE,
    telephone: '+48501405700',
    email: 'cafebelmontkrk@gmail.com',
    priceRange: '20–40 zł',
    currenciesAccepted: 'PLN',
    image: `${SITE}/img/wall/10Belmont.jpg`,
    servesCuisine: t.cuisine,
    knowsAbout: t.knowsAbout,
    brand: { '@type': 'Brand', name: 'Yume Matcha', url: 'https://yumematcha.pl', sameAs: 'https://yumematcha.pl' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '436',
      bestRating: '5',
      worstRating: '1',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'ul. Berka Joselewicza 12',
      postalCode: '31-051',
      addressLocality: 'Kraków',
      addressRegion: 'Kazimierz',
      addressCountry: 'PL',
    },
    areaServed: [
      { '@type': 'Place', name: 'Kazimierz, Kraków' },
      { '@type': 'Place', name: 'Stare Miasto, Kraków' },
      { '@type': 'Place', name: 'Centrum Krakowa' },
    ],
    geo: { '@type': 'GeoCoordinates', latitude: 50.0544581, longitude: 19.9460358 },
    hasMap: MAPS_URL,
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Pet friendly', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Wi-Fi', value: true },
      { '@type': 'LocationFeatureSpecification', name: t.plantMilk, value: true },
    ],
    founder: [
      { '@type': 'Person', name: 'Bartek', jobTitle: t.coFounder },
      { '@type': 'Person', name: 'Kacper', jobTitle: t.coFounder },
    ],
    employee: [
      { '@type': 'Person', name: 'Malina', jobTitle: 'Social Media' },
      { '@type': 'Person', name: 'Maja', jobTitle: 'Barista' },
      { '@type': 'Person', name: 'Zosia', jobTitle: 'Barista' },
      { '@type': 'Person', name: 'Janek', jobTitle: 'Barista' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    hasMenu: {
      '@type': 'Menu',
      '@id': `${SITE}${t.path}#menu`,
      inLanguage: lang,
      hasMenuSection: [
        {
          '@type': 'MenuSection',
          name: t.sections.matcha,
          hasMenuItem: [
            ...menuItems(c.menu.matcha.items),
            item(t.usucha('Asa'), '16'),
            item(t.usucha('Hana'), '19'),
            item(t.usucha('Hoshi'), '24'),
          ],
        },
        {
          '@type': 'MenuSection',
          name: t.sections.autumn,
          hasMenuItem: menuItems(c.autumn.items),
        },
        {
          '@type': 'MenuSection',
          name: t.sections.hot,
          // Batch Brew is 14 / 17 zł (small / large): the small price is listed
          hasMenuItem: [...menuItems(c.menu.coffee.hotItems), item('Batch Brew', '14')],
        },
        {
          '@type': 'MenuSection',
          name: t.sections.cold,
          hasMenuItem: [...menuItems(c.menu.coffee.coldItems), item('Cold Brew', '15')],
        },
        {
          '@type': 'MenuSection',
          name: t.sections.food,
          hasMenuItem: menuItems(c.menu.food.items),
        },
      ],
    },
    sameAs: [
      'https://instagram.com/cafe_belmont',
      'https://www.facebook.com/p/Cafe-Belmont-61578865151844/',
      'https://maps.google.com/?cid=15239785840468434850',
    ],
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${SITE}${t.path}#faq`,
    inLanguage: lang,
    about: { '@id': `${SITE}/#business` },
    mainEntity: c.faq.items.map(([name, answer]) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: { '@type': 'Answer', text: plain(answer) },
    })),
  };

  // Site + page entities tie the two language versions and the business/FAQ together for AI crawlers.
  const site = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE}/#website`,
        url: `${SITE}/`,
        name: 'Café Belmont',
        inLanguage: ['pl', 'en'],
        publisher: { '@id': `${SITE}/#business` },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE}${t.path}#webpage`,
        url: `${SITE}${t.path}`,
        name: lang === 'pl' ? 'Café Belmont — matcha bar i kawa specialty na Kazimierzu' : 'Café Belmont — matcha bar & specialty coffee in Kazimierz',
        description: t.description,
        inLanguage: lang,
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@id': `${SITE}/#business` },
        mainEntity: { '@id': `${SITE}/#business` },
        primaryImageOfPage: { '@type': 'ImageObject', url: `${SITE}/img/wall/10Belmont.jpg` },
        dateModified: '2026-10-24',
        // the other language version of the same page
        workTranslation: lang === 'pl' ? { '@id': `${SITE}/en/#webpage` } : undefined,
        translationOfWork: lang === 'en' ? { '@id': `${SITE}/#webpage` } : undefined,
      },
    ],
  };

  return { business, faq, site };
}
