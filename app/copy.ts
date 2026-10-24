/**
 * All visible copy of the home page, PL and EN.
 * Rich text in strings uses **bold** and _italic_ (see rich.tsx); schema.ts strips the markers.
 * Prices are shared and must match app/schema.ts (the JSON-LD menu).
 */

export type Lang = 'pl' | 'en';

export interface MenuItemCopy {
  name: string;
  price: string;
  sub?: string;
  badge?: string;
  highlight?: boolean;
  combo?: boolean;
}

export interface GradeCopy {
  grade: string;
  name: string;
  extra: string;
  extraClass?: 'accent' | 'gold';
  text: string;
  meta: string;
  img: string;
  alt: string;
  href: string;
  link: string;
}

export interface Copy {
  lang: Lang;
  switchTo: { code: Lang; href: string; label: string; title: string };
  marquee: string[];
  nav: { menu: string; autumn: string; yume: string; reviews: string; visit: string; visitWifi: string; faq: string; main: string; quick: string };
  /** [label, detail] — the detail ("DO 19:00") is hidden on narrow phones */
  status: { checking: string; open: [string, string]; closed: [string, string] };
  hero: {
    kicker: string;
    h1: string[];
    leadBefore: string;
    yumeTitle: string;
    leadAfter: string;
    lead2: string;
    ctaMenu: string;
    ctaAutumn: string;
    ctaVisit: string;
    artAlt: string;
    artTags: [string, string];
  };
  autumn: {
    badgeJp: string;
    badgeText: string;
    headline: string;
    sub: string;
    open: string;
    close: string;
    items: { name: string; price: string; desc: string }[];
    flyerNote: string;
    flyerBtn: string;
    dialogLabel: string;
    posterAlt: string;
    closeLabel: string;
  };
  menu: {
    tag: string;
    title: string;
    desc: string;
    matcha: { kanji: string; name: string; note: string; items: MenuItemCopy[]; infoLabel: string; info: string[] };
    coffee: { kanji: string; name: string; note: string; hot: string; cold: string; hotItems: MenuItemCopy[]; coldItems: MenuItemCopy[] };
    food: { kanji: string; name: string; note: string; items: MenuItemCopy[] };
  };
  craft: {
    tag: string;
    titleBefore: string;
    subtitle: string;
    desc: string;
    pillTitle: string;
    grades: GradeCopy[];
    dotsLabel: string;
    /** "{n}" is replaced with the grade number (plain strings only: copy crosses the server → client boundary) */
    dotLabel: string;
    noteTitle: string;
    noteText: string;
    shopLead: string;
    shopDomain: string;
  };
  reviews: { tag: string; title: string; desc: string; items: { text: string; author: string }[]; link: string };
  visit: {
    tag: string;
    title: string;
    rows: [string, string][];
    wifiLabel: string;
    wifiReveal: string;
    wifiCopied: string;
    /** "{pass}" is replaced with the Wi-Fi password */
    toastCopied: string;
    toastPlain: string;
    links: { label: string; href: string }[];
  };
  faq: { tag: string; title: string; desc: string; items: [string, string][] };
  footer: { address: string; hours: string; copy: string };
}

const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=Caf%C3%A9%20Belmont%2C%20ul.%20Berka%20Joselewicza%2012%2C%20Krak%C3%B3w';
const APPLE_MAPS_URL = 'https://maps.apple.com/place?place-id=I53E928FE9A7B0A5D';
const IG_URL = 'https://instagram.com/cafe_belmont';

export const YUME_SHOP = 'https://yumematcha.pl';
const YUME_PRODUCTS = {
  asa: `${YUME_SHOP}/produkt/asa-puszka/`,
  hana: `${YUME_SHOP}/produkt/hana-matcha-yume-premium/`,
  hoshi: `${YUME_SHOP}/produkt/hoshi/`,
};
const GRADE_IMG = {
  asa: '/images/matcha/yume_asa_tin.webp',
  hana: '/images/matcha/yume_hana_tin.webp',
  hoshi: '/images/matcha/yume_hoshi_tin.webp',
};

const pl: Copy = {
  lang: 'pl',
  switchTo: { code: 'en', href: '/en/?lang=en', label: 'EN', title: 'English version' },
  marquee: [
    'KRAKÓW · KAZIMIERZ · BERKA JOSELEWICZA 12',
    'FLAGSHIP DLA YUME MATCHA (UJI, JAPONIA)',
    'KAWA SPECIALTY & ONIGIRI',
    'PON–ND 9:00–19:00',
    'ŚNIADANIA DO 12:00',
  ],
  nav: {
    menu: 'Menu',
    autumn: "Jesień '26",
    yume: 'Matcha Yume',
    reviews: 'Opinie',
    visit: 'Wizyta',
    visitWifi: 'Wizyta & WiFi',
    faq: 'FAQ',
    main: 'Główna nawigacja',
    quick: 'Szybka nawigacja mobilna',
  },
  status: { checking: 'SPRAWDZANIE...', open: ['OTWARTE', 'DO 19:00'], closed: ['ZAMKNIĘTE', 'OD 9:00'] },
  hero: {
    kicker: 'KAZIMIERZ · BERKA JOSELEWICZA 12',
    h1: ['MATCHA BAR I KAWA SPECIALTY', 'NA KAZIMIERZU.'],
    leadBefore:
      'Matcha bar i kawiarnia specialty na Kazimierzu w Krakowie, kawałek od Placu Nowego. Matcha jest u nas punktem wyjścia, nie dodatkiem do kawy: trzy gatunki naszej własnej ',
    yumeTitle: 'Yume – nasza własna matcha. Oficjalny sklep yumematcha.pl',
    leadAfter: ' prosto z regionu Uji, do tego rzemieślnicze espresso i onigiri robione na miejscu.',
    lead2:
      'Café Belmont to miejsce, w którym dzień zaczyna się od dobrze zrobionej matchy i kawy specialty. Matchę ubijamy na gładką piankę, żeby smak był pełny i słodkawy, a nie gorzki. Do tego proste japońskie jedzenie: onigiri i śniadania do południa.',
    ctaMenu: 'Zobacz Menu ↓',
    ctaAutumn: "🍁 Menu Jesienne '26",
    ctaVisit: 'Wizyta & Dojazd ➔',
    artAlt: 'Café Belmont — autorski plakat z parasolami, ilustracja @tycjano',
    artTags: ['AUTUMN MENU 2026', 'ILUSTRACJA: @TYCJANO'],
  },
  autumn: {
    badgeJp: '秋の限定メニュー',
    badgeText: 'AUTUMN DROP 2026 · CIEPŁE LUB MROŻONE',
    headline: 'Szarlotkowa Matcha, Chai & Pieczone Jabłka',
    sub: 'Autorska karta jesienna Café Belmont z syropem daktylowo-imbirowym, cynamonem, opalaną pianką i japońską prażoną hojichą.',
    open: 'Rozwiń menu jesienne',
    close: 'Zwiń menu jesienne',
    items: [
      { name: 'Szarlotkowa Matcha Latte', price: '24 zł', desc: 'Prażone jabłka, syrop klonowy, syrop cynamonowy, mleko i matcha Yume' },
      { name: 'Chai Matcha', price: '22 zł', desc: 'Matcha Yume połączona z korzennym syropem chai i mlekiem' },
      { name: 'Daktylowo-Imbirowe Latte', price: '21 zł', desc: 'Syrop daktylowo-imbirowy, mleko i espresso specialty (zero białego cukru)' },
      { name: 'Orzechowo-Karmelowe Latte z opalaną pianką', price: '23 zł', desc: 'Sos orzechowo-karmelowy, mleko, pianki marshmallow opalane palnikiem, espresso' },
      { name: 'Banana Bread & Maple Foam Iced Latte', price: '25 zł', desc: 'Zimna pianka cynamonowo-klonowa, syrop cynamonowy, puree bananowe, mleko, espresso' },
      { name: 'Hazelnut Hojicha', price: '23 zł', desc: 'Japońska prażona herbata hojicha z sosem orzechowo-karmelowym i mlekiem (low caffeine)' },
    ],
    flyerNote: 'Projekt graficzny menu jesiennego: **@tycjano** dla @cafe_belmont',
    flyerBtn: 'Obejrzyj pełen plakat menu ↗',
    dialogLabel: 'Plakat Menu Jesiennego 2026 Café Belmont',
    posterAlt: 'Oficjalny plakat Autumn Menu 2026 Café Belmont',
    closeLabel: 'Zamknij podgląd',
  },
  menu: {
    tag: 'お品書き · MENU GŁÓWNE',
    title: 'MENU BELMONT',
    desc: 'Wszystkie pozycje przygotowujemy na bieżąco. Mleko krowie lub roślinne (Oatly, Sproud).',
    matcha: {
      kanji: '抹茶',
      name: 'MATCHA YUME',
      note: 'Matcha z Uji ubijana chasenem na gęstą piankę',
      items: [
        { name: 'Matcha Latte', price: '20 zł', sub: 'Ciepłe, kremowe latte ubite z wybranym mlekiem' },
        { name: 'Ice Matcha Latte', price: '22 zł', sub: 'Dwuwarstwowa matcha podawana na lodzie i mleku' },
        { name: 'Ice Matcha Tonic', price: '22 zł', badge: 'HIT', highlight: true, sub: 'Matcha lana na tonik premium z lodem i cytrusem. Lekka, musująca, orzeźwiająca.' },
        { name: 'Jasmine Yuzu Honey Matcha Iced Tea', price: '24 zł', sub: 'Herbata jaśminowa, japoński owoc yuzu, miód, lód, matcha' },
        { name: 'Pina Colada Iced Matcha', price: '26 zł', sub: 'Matcha z pulpą ananasową i mlekiem kokosowym na lodzie' },
        { name: 'Yuzu Passion Fruit Matcha Fizz', price: '26 zł', sub: 'Musujący napój z matchą, cytrusami yuzu i marakują' },
        { name: 'Tradycyjna Matcha na Wodzie (Miska Chawan)', price: '16 / 19 / 24 zł', sub: 'Czysty tradycyjny napar usucha: Asa (16 zł) · Hana (19 zł) · Hoshi (24 zł)' },
      ],
      infoLabel: 'GATUNKI MATCHY DO WYBORU:',
      info: [
        '• **Yume Asa** — w cenie (łagodna, codzienna, słodki finisz)',
        '• **Yume Hana** — +3 zł (wyrazistsza, głęboka zieleń, bogata w l-teaninę)',
        '• **Yume Hoshi** — +8 zł (Master’s Blend, najwyższy gatunek, czyste umami)',
      ],
    },
    coffee: {
      kanji: '珈琲',
      name: 'KAWA SPECIALTY',
      note: 'Single origin i espresso z europejskich palarni',
      hot: 'NA CIEPŁO',
      cold: 'NA ZIMNO',
      hotItems: [
        { name: 'House Espresso', price: '10 zł' },
        { name: 'Cortado', price: '13 zł' },
        { name: 'Flat White', price: '15 zł' },
        { name: 'Cappuccino', price: '15 zł' },
        { name: 'Latte', price: '18 zł' },
        { name: 'Batch Brew', price: '14 / 17 zł' },
        { name: 'Drip V60', price: '18 zł' },
      ],
      coldItems: [
        { name: 'Ice Espresso', price: '10 zł' },
        { name: 'Orange Espresso', price: '18 zł', highlight: true, sub: 'Świeżo wyciskany sok pomarańczowy z espresso' },
        { name: 'Ice Flat White', price: '16 zł' },
        { name: 'Ice Latte', price: '19 zł' },
        { name: 'Cold Brew', price: '15 / 18 zł' },
        { name: 'Ice Drip', price: '19 zł' },
        { name: 'Espresso Tonic', price: '19 zł' },
      ],
    },
    food: {
      kanji: '軽食',
      name: 'ONIGIRI & ŚNIADANIA',
      note: 'Świeże trójkąty ryżowe. Zestawy śniadaniowe do 12:00',
      items: [
        { name: 'Onigiri Sweet Tofu', price: '16 zł', sub: 'Słodko-wytrawne marynowane tofu, szczypiorek, prażony sezam, nori' },
        { name: 'Onigiri Tuna Mayo', price: '15 zł', sub: 'Tuńczyk z japońskim majonezem Kewpie, prażony sezam, nori' },
        { name: 'Onigiri Umeboshi', price: '17 zł', sub: 'Tradycyjna japońska kiszona śliwka umeboshi (kwaśno-słona nuta)' },
        { name: 'Zestaw: Onigiri + Kawa (do 12:00)', price: '25 zł', combo: true, sub: 'Dowolne onigiri z wybraną ciepłą kawą specialty' },
        { name: 'Zestaw: Onigiri + Matcha (do 12:00)', price: '29 zł', combo: true, sub: 'Dowolne onigiri z Matcha Latte na Yume Asa' },
      ],
    },
  },
  craft: {
    tag: '宇治・京都 · NASZA WŁASNA MARKA · BEZPOŚREDNI IMPORT',
    titleBefore: 'TU PIJESZ',
    subtitle: 'Naszą własną matchę z regionu Uji',
    desc:
      'Yume to nasza własna marka matchy. Prowadzimy ją razem z Café Belmont i sprowadzamy prosto z Uji, najsłynniejszego regionu matchy w Japonii, bez pośredników. Tę samą matchę, którą dostajesz u nas w czarce, kupisz do domu w sklepie Yume.',
    pillTitle: 'Yume – oficjalny sklep yumematcha.pl',
    grades: [
      {
        grade: 'GRADE 01 · 朝',
        name: 'YUME ASA',
        extra: 'W cenie bazy napoju',
        text: 'Codzienna, łagodna i czysta. Świeży roślinny profil z delikatną słodyczą. Najlepsza pod latte i wersje na lodzie.',
        meta: 'UJI, KYOTO · SPRING HARVEST',
        img: GRADE_IMG.asa,
        alt: 'Puszka Yume Asa Matcha z Uji, Kioto',
        href: YUME_PRODUCTS.asa,
        link: 'Zobacz w sklepie Yume ↗',
      },
      {
        grade: 'GRADE 02 · 花',
        name: 'YUME HANA',
        extra: '+3 zł do napoju',
        extraClass: 'accent',
        text: 'Głębsza, intensywniejsza zieleń i wyższy poziom l-teaniny. Wyraźnie przebija się przez kremowość mleka, dając słodki finisz.',
        meta: 'UJI, KYOTO · FIRST FLUSH',
        img: GRADE_IMG.hana,
        alt: 'Puszka Yume Hana Matcha z Uji',
        href: YUME_PRODUCTS.hana,
        link: 'Zobacz w sklepie Yume ↗',
      },
      {
        grade: 'GRADE 03 · 星',
        name: 'YUME HOSHI',
        extra: '+8 zł Master’s Blend',
        extraClass: 'gold',
        text: 'Master’s Blend, najwyższy gatunek Yume. Mielona powoli na kamiennych żarnach. Gęsta, kremowa, potężne umami — polecana solo na wodzie.',
        meta: 'SINGLE ESTATE · MASTER’S BLEND',
        img: GRADE_IMG.hoshi,
        alt: 'Puszka Yume Hoshi Matcha (Master’s Blend)',
        href: YUME_PRODUCTS.hoshi,
        link: 'Zobacz w sklepie Yume ↗',
      },
    ],
    dotsLabel: 'Wybierz odmianę matchy',
    dotLabel: 'Przejdź do gatunku {n}',
    noteTitle: 'Co wyróżnia matchę najwyższego gatunku',
    noteText:
      'Krzewy herbaty na kilka tygodni przed zbiorem chowa się w cieniu, co podnosi poziom chlorofilu i l-teaniny, a ścina goryczkę. Zbiera się tylko najmłodsze listki, usuwa z nich żyłki i mieli na kamiennych żarnach na puder drobniejszy od mąki. Dlatego dobra matcha jest żywo zielona, gładka i pełna umami, a nie płaska i gorzka. Przygotowuje się ją przez ubijanie, nie zalewanie, i pije w całości, razem z liściem.',
    shopLead: 'Oficjalny sklep online',
    shopDomain: 'yumematcha.pl ↗',
  },
  reviews: {
    tag: 'GOOGLE MAPS · 4.6 ★★★★★',
    title: 'CO MÓWIĄ O NAS GOŚCIE',
    desc: 'Ponad 430 zweryfikowanych opinii na krakowskim Kazimierzu.',
    items: [
      { text: '„Najlepsza matcha na Kazimierzu, obsługa zawsze uśmiechnięta. Wracam za każdym razem, gdy jestem w Krakowie.”', author: 'Ola K. · Google Maps' },
      { text: '„Onigiri robione na miejscu i świetna kawa specialty — kombinacja, której nie znajdziesz nigdzie indziej w okolicy.”', author: 'Marcin W. · Google Maps' },
      { text: '„Klimatyczne miejsce, ciche kąty do pracy i naprawdę wybitna matcha Yume. Ice matcha tonic to absolutna poezja.”', author: 'Julia S. · Google Maps' },
    ],
    link: 'Zobacz wszystkie opinie na Google Maps ➔',
  },
  visit: {
    tag: 'KAZIMIERZ · PRAKTYCZNE DANE',
    title: 'ODWIEDŹ BELMONT',
    rows: [
      ['ADRES', 'ul. Berka Joselewicza 12, 31-051 Kraków'],
      ['GODZINY', 'Poniedziałek – Niedziela · 9:00 – 19:00'],
      ['ŚNIADANIA', 'Codziennie do 12:00 (Onigiri + Napój)'],
      ['PUPIL', 'Pet friendly · miska ze świeżą wodą 🐾'],
    ],
    wifiLabel: 'WI-FI',
    wifiReveal: 'Pokaż & Kopiuj',
    wifiCopied: 'Skopiowano ✓',
    toastCopied: 'Hasło WiFi „{pass}” skopiowane!',
    toastPlain: 'Hasło WiFi: {pass}',
    links: [
      { label: 'Otwórz w Google Maps', href: MAPS_URL },
      { label: 'Otwórz w Apple Maps', href: APPLE_MAPS_URL },
      { label: 'Instagram @cafe_belmont', href: IG_URL },
    ],
  },
  faq: {
    tag: 'よくある質問 · PYTANIA I ODPOWIEDZI',
    title: 'CZĘSTE PYTANIA',
    desc: 'Wszystko o naszej matchy, onigiri i rytuale w Café Belmont.',
    items: [
      [
        'Gdzie napić się dobrej matchy w Krakowie?',
        'W Café Belmont na Kazimierzu (ul. Berka Joselewicza 12). To matcha bar, w którym rzemieślnicza matcha Yume sprowadzana bezpośrednio z regionu Uji jest podstawą menu: tradycyjna usucha w czarce chawan, matcha latte, iced matcha oraz orzeźwiający matcha tonic.',
      ],
      [
        'Jaką matchę podajecie?',
        'Matchę Yume w trzech czystych gatunkach: **Yume Asa** (codzienna, łagodna z naturalną słodyczą), **Yume Hana** (głębsza zieleń i bogactwo l-teaniny) oraz **Yume Hoshi** (Master’s Blend, najwyższy gatunek, mielona na kamiennych żarnach, o głębokim profilu umami).',
      ],
      [
        'Gdzie w Krakowie napić się matcha tonic?',
        'Nasz autorski Ice Matcha Tonic jest w stałym menu Café Belmont na Kazimierzu (22 zł). Przygotowujemy go na bazie toniku premium, lodu i świeżo ubitej matchy Yume z plastrem cytrusa.',
      ],
      [
        'Czy zjem u Was śniadanie?',
        'Tak! Codziennie do 12:00 serwujemy zestawy śniadaniowe: świeże trójkąty ryżowe onigiri w zestawie z wybraną ciepłą kawą specialty (25 zł) lub z Matcha Latte na Yume Asa (29 zł).',
      ],
      [
        'Czy jest mleko roślinne?',
        'Tak, serwujemy mleka roślinne Oatly (owsiane) oraz Sproud (z białka grochu) do każdej matchy i kawy. Mamy także tradycyjne mleko krowie wysokiej jakości.',
      ],
      [
        'Co zamówić na pierwszy raz?',
        'Na start polecamy Matcha Latte na Yume Asa – aksamitne i delikatne. Jeśli szukasz czegoś orzeźwiającego, wybierz Ice Matcha Tonic. Do tego koniecznie onigiri Tuna Mayo albo marynowane Sweet Tofu robione na bieżąco na miejscu.',
      ],
      [
        'Czym różni się matcha latte od matcha tonic?',
        'Matcha latte to matcha ubita z wybranym mlekiem – kremowa, gęsta i kojąca. Matcha tonic to dwuwarstwowa matcha lana na gazowany tonik z lodem – lekka, cytrusowa, musująca i wybitnie gasząca pragnienie.',
      ],
      [
        'Czy macie kawę specialty?',
        'Tak, całe nasze menu kawowe to starannie wyselekcjonowane ziarna single origin specialty z europejskich palarni: espresso, cortado, flat white, cappuccino, latte, batch brew, drip V60, cold brew i espresso tonic.',
      ],
      [
        'Czym jest onigiri?',
        'Tradycyjne japońskie trójkąty z lekko doprawionego ryżu z wytrawnym nadzieniem, owinięte chrupiącym płatkiem alg nori. Przygotowujemy wersje Sweet Tofu, Tuna Mayo oraz Umeboshi (z tradycyjną kiszoną śliwką).',
      ],
      [
        'Czy matcha ma dużo kofeiny?',
        'Matcha naturalnie zawiera kofeinę, ale w parze z nią występuje wysokie stężenie l-teaniny. Dzięki tej synergii matcha uwalnia energię stopniowo i stabilnie przez 4–6 godzin, bez roztrzęsienia i bez nagłego popołudniowego spadku energii, jak to bywa po espresso.',
      ],
      [
        'Czy matchę się parzy?',
        'Nie. Matchy się nie parzy jak herbaty liściastej — nie zalewa się jej wrzątkiem i nie naciąga. Sproszkowany liść tencha ubija się bambusowym chasenem w odrobinie wody lub w mleku, aż powstanie aksamitna mikropianka, i pije w całości. Dlatego u nas mówimy, że matchę się _ubija_ albo _przygotowuje_, a nie parzy.',
      ],
      [
        'Gdzie dokładnie znajduje się Café Belmont?',
        'Na krakowskim Kazimierzu przy ul. Berka Joselewicza 12 (31-051 Kraków), zaledwie minutę spacerem od ulicy Miodowej i Placu Nowego.',
      ],
    ],
  },
  footer: {
    address: 'ul. Berka Joselewicza 12 · 31-051 Kraków, Kazimierz',
    hours: 'Codziennie · 9:00 – 19:00',
    copy: '© 2026 CAFÉ BELMONT · KRAKÓW',
  },
};

const en: Copy = {
  lang: 'en',
  switchTo: { code: 'pl', href: '/?lang=pl', label: 'PL', title: 'Wersja polska' },
  marquee: [
    'KRAKÓW · KAZIMIERZ · BERKA JOSELEWICZA 12',
    'FLAGSHIP BAR OF YUME MATCHA (UJI, JAPAN)',
    'SPECIALTY COFFEE & ONIGIRI',
    'MON–SUN 9:00–19:00',
    'BREAKFAST UNTIL 12:00',
  ],
  nav: {
    menu: 'Menu',
    autumn: "Autumn '26",
    yume: 'Yume Matcha',
    reviews: 'Reviews',
    visit: 'Visit',
    visitWifi: 'Visit & WiFi',
    faq: 'FAQ',
    main: 'Main navigation',
    quick: 'Quick mobile navigation',
  },
  status: { checking: 'CHECKING...', open: ['OPEN', 'UNTIL 19:00'], closed: ['CLOSED', 'OPENS 9:00'] },
  hero: {
    kicker: 'KAZIMIERZ · BERKA JOSELEWICZA 12',
    h1: ['MATCHA BAR & SPECIALTY COFFEE', 'IN KAZIMIERZ, KRAKÓW.'],
    leadBefore:
      'A matcha bar and specialty coffee shop in Kazimierz, Kraków, a short walk from Plac Nowy. Here matcha is the starting point, not an add-on to coffee: three grades of our own ',
    yumeTitle: 'Yume – our own matcha. Official shop yumematcha.pl',
    leadAfter: ' straight from the Uji region, plus craft espresso and onigiri made on site.',
    lead2:
      'Café Belmont is a place where the day starts with a properly made matcha and specialty coffee. We whisk the matcha into a smooth foam so the taste is full and gently sweet, not bitter. Alongside it we serve simple Japanese food: onigiri and breakfast sets until noon.',
    ctaMenu: 'See the Menu ↓',
    ctaAutumn: "🍁 Autumn Menu '26",
    ctaVisit: 'Visit & Directions ➔',
    artAlt: 'Café Belmont — original umbrella poster, illustration by @tycjano',
    artTags: ['AUTUMN MENU 2026', 'ILLUSTRATION: @TYCJANO'],
  },
  autumn: {
    badgeJp: '秋の限定メニュー',
    badgeText: 'AUTUMN DROP 2026 · HOT OR ICED',
    headline: 'Apple Pie Matcha, Chai & Baked Apples',
    sub: "Café Belmont's own autumn menu with ginger-date syrup, cinnamon, torched marshmallow foam and Japanese roasted hojicha.",
    open: 'Show the autumn menu',
    close: 'Hide the autumn menu',
    items: [
      { name: 'Apple Pie Matcha Latte', price: '24 zł', desc: 'Roasted apples, maple syrup, cinnamon syrup, milk and Yume matcha' },
      { name: 'Chai Matcha', price: '22 zł', desc: 'Yume matcha with spiced chai syrup and milk' },
      { name: 'Ginger Date Latte', price: '21 zł', desc: 'Ginger-date syrup, milk and specialty espresso (no white sugar)' },
      { name: "Hazelnut S'Mores Latte with torched foam", price: '23 zł', desc: 'Hazelnut-caramel sauce, milk, torched marshmallows, espresso' },
      { name: 'Banana Bread & Maple Foam Iced Latte', price: '25 zł', desc: 'Cold cinnamon-maple foam, cinnamon syrup, banana purée, milk, espresso' },
      { name: 'Hazelnut Hojicha', price: '23 zł', desc: 'Japanese roasted hojicha tea with hazelnut-caramel sauce and milk (low caffeine)' },
    ],
    flyerNote: 'Autumn menu artwork: **@tycjano** for @cafe_belmont',
    flyerBtn: 'See the full menu poster ↗',
    dialogLabel: 'Café Belmont Autumn Menu 2026 poster',
    posterAlt: 'Official Autumn Menu 2026 poster of Café Belmont',
    closeLabel: 'Close preview',
  },
  menu: {
    tag: 'お品書き · MAIN MENU',
    title: 'BELMONT MENU',
    desc: 'Everything is made to order. Cow milk or plant-based (Oatly, Sproud).',
    matcha: {
      kanji: '抹茶',
      name: 'YUME MATCHA',
      note: 'Uji matcha whisked with a chasen into a thick foam',
      items: [
        { name: 'Matcha Latte', price: '20 zł', sub: 'Warm, creamy latte whisked with the milk of your choice' },
        { name: 'Iced Matcha Latte', price: '22 zł', sub: 'Two-layer matcha served over ice and milk' },
        { name: 'Iced Matcha Tonic', price: '22 zł', badge: 'HIT', highlight: true, sub: 'Matcha poured over premium tonic with ice and citrus. Light, fizzy, refreshing.' },
        { name: 'Jasmine Yuzu Honey Matcha Iced Tea', price: '24 zł', sub: 'Jasmine tea, Japanese yuzu, honey, ice, matcha' },
        { name: 'Pina Colada Iced Matcha', price: '26 zł', sub: 'Matcha with pineapple pulp and coconut milk over ice' },
        { name: 'Yuzu Passion Fruit Matcha Fizz', price: '26 zł', sub: 'Sparkling matcha with yuzu citrus and passion fruit' },
        { name: 'Traditional Matcha on Water (Chawan Bowl)', price: '16 / 19 / 24 zł', sub: 'Pure traditional usucha: Asa (16 zł) · Hana (19 zł) · Hoshi (24 zł)' },
      ],
      infoLabel: 'MATCHA GRADES TO CHOOSE FROM:',
      info: [
        '• **Yume Asa** — included (mild, everyday, sweet finish)',
        '• **Yume Hana** — +3 zł (more expressive, deep green, rich in l-theanine)',
        '• **Yume Hoshi** — +8 zł (Master’s Blend, the top grade, pure umami)',
      ],
    },
    coffee: {
      kanji: '珈琲',
      name: 'SPECIALTY COFFEE',
      note: 'Single origin and espresso from European roasters',
      hot: 'HOT',
      cold: 'COLD',
      hotItems: [
        { name: 'House Espresso', price: '10 zł' },
        { name: 'Cortado', price: '13 zł' },
        { name: 'Flat White', price: '15 zł' },
        { name: 'Cappuccino', price: '15 zł' },
        { name: 'Latte', price: '18 zł' },
        { name: 'Batch Brew', price: '14 / 17 zł' },
        { name: 'Drip V60', price: '18 zł' },
      ],
      coldItems: [
        { name: 'Iced Espresso', price: '10 zł' },
        { name: 'Orange Espresso', price: '18 zł', highlight: true, sub: 'Freshly squeezed orange juice with espresso' },
        { name: 'Iced Flat White', price: '16 zł' },
        { name: 'Iced Latte', price: '19 zł' },
        { name: 'Cold Brew', price: '15 / 18 zł' },
        { name: 'Iced Drip', price: '19 zł' },
        { name: 'Espresso Tonic', price: '19 zł' },
      ],
    },
    food: {
      kanji: '軽食',
      name: 'ONIGIRI & BREAKFAST',
      note: 'Fresh rice triangles. Breakfast sets until 12:00',
      items: [
        { name: 'Onigiri Sweet Tofu', price: '16 zł', sub: 'Sweet-savoury marinated tofu, chives, toasted sesame, nori' },
        { name: 'Onigiri Tuna Mayo', price: '15 zł', sub: 'Tuna with Japanese Kewpie mayo, toasted sesame, nori' },
        { name: 'Onigiri Umeboshi', price: '17 zł', sub: 'Traditional Japanese pickled plum umeboshi (sour-salty note)' },
        { name: 'Set: Onigiri + Coffee (until 12:00)', price: '25 zł', combo: true, sub: 'Any onigiri with a hot specialty coffee of your choice' },
        { name: 'Set: Onigiri + Matcha (until 12:00)', price: '29 zł', combo: true, sub: 'Any onigiri with a Matcha Latte on Yume Asa' },
      ],
    },
  },
  craft: {
    tag: '宇治・京都 · OUR OWN BRAND · DIRECT IMPORT',
    titleBefore: "YOU'RE DRINKING",
    subtitle: 'Our own matcha from the Uji region',
    desc:
      'Yume is our own matcha brand. We run it together with Café Belmont and bring it straight from Uji, Japan’s most renowned matcha region, with no middlemen. The same matcha you get here in a bowl you can buy for home in the Yume shop.',
    pillTitle: 'Yume – official shop yumematcha.pl',
    grades: [
      {
        grade: 'GRADE 01 · 朝',
        name: 'YUME ASA',
        extra: 'Included in the drink price',
        text: 'Everyday, mild and clean. A fresh, grassy profile with gentle sweetness. The best base for lattes and iced versions.',
        meta: 'UJI, KYOTO · SPRING HARVEST',
        img: GRADE_IMG.asa,
        alt: 'Tin of Yume Asa matcha from Uji, Kyoto',
        href: YUME_PRODUCTS.asa,
        link: 'See it in the Yume shop ↗',
      },
      {
        grade: 'GRADE 02 · 花',
        name: 'YUME HANA',
        extra: '+3 zł per drink',
        extraClass: 'accent',
        text: 'Deeper, more intense green and a higher level of l-theanine. Cuts clearly through the creaminess of milk, with a sweet finish.',
        meta: 'UJI, KYOTO · FIRST FLUSH',
        img: GRADE_IMG.hana,
        alt: 'Tin of Yume Hana matcha from Uji',
        href: YUME_PRODUCTS.hana,
        link: 'See it in the Yume shop ↗',
      },
      {
        grade: 'GRADE 03 · 星',
        name: 'YUME HOSHI',
        extra: '+8 zł Master’s Blend',
        extraClass: 'gold',
        text: 'Master’s Blend, the top Yume grade. Slowly stone-ground. Thick, creamy, powerful umami — best enjoyed on water alone.',
        meta: 'SINGLE ESTATE · MASTER’S BLEND',
        img: GRADE_IMG.hoshi,
        alt: 'Tin of Yume Hoshi matcha (Master’s Blend)',
        href: YUME_PRODUCTS.hoshi,
        link: 'See it in the Yume shop ↗',
      },
    ],
    dotsLabel: 'Choose a matcha grade',
    dotLabel: 'Go to grade {n}',
    noteTitle: 'What sets the top grade apart',
    noteText:
      'For a few weeks before harvest the tea bushes are shaded, which raises chlorophyll and l-theanine and cuts the bitterness. Only the youngest leaves are picked, de-veined and stone-ground into a powder finer than flour. That is why good matcha is vivid green, smooth and full of umami, not flat and bitter. You whisk it rather than steep it, and drink the whole leaf.',
    shopLead: 'Official online shop',
    shopDomain: 'yumematcha.pl ↗',
  },
  reviews: {
    tag: 'GOOGLE MAPS · 4.6 ★★★★★',
    title: 'WHAT GUESTS SAY',
    desc: 'Over 430 verified reviews in Kazimierz, Kraków.',
    items: [
      { text: '“Best matcha in Kazimierz, always smiling staff. I come back every time I’m in Kraków.”', author: 'Ola K. · Google Maps' },
      { text: '“Onigiri made on-site and great specialty coffee — a combination you won’t find anywhere else nearby.”', author: 'Marcin W. · Google Maps' },
      { text: '“A cosy place, quiet corners to work and truly outstanding Yume matcha. The iced matcha tonic is pure poetry.”', author: 'Julia S. · Google Maps' },
    ],
    link: 'See all reviews on Google Maps ➔',
  },
  visit: {
    tag: 'KAZIMIERZ · PRACTICAL INFO',
    title: 'VISIT BELMONT',
    rows: [
      ['ADDRESS', 'ul. Berka Joselewicza 12, 31-051 Kraków'],
      ['HOURS', 'Monday – Sunday · 9:00 – 19:00'],
      ['BREAKFAST', 'Daily until 12:00 (Onigiri + Drink)'],
      ['PETS', 'Pet friendly · bowl of fresh water 🐾'],
    ],
    wifiLabel: 'WI-FI',
    wifiReveal: 'Show & Copy',
    wifiCopied: 'Copied ✓',
    toastCopied: 'WiFi password “{pass}” copied!',
    toastPlain: 'WiFi password: {pass}',
    links: [
      { label: 'Open in Google Maps', href: MAPS_URL },
      { label: 'Open in Apple Maps', href: APPLE_MAPS_URL },
      { label: 'Instagram @cafe_belmont', href: IG_URL },
    ],
  },
  faq: {
    tag: 'よくある質問 · QUESTIONS & ANSWERS',
    title: 'FAQ',
    desc: 'Everything about our matcha, onigiri and the ritual at Café Belmont.',
    items: [
      [
        'Where to drink good matcha in Kraków?',
        'At Café Belmont in Kazimierz (ul. Berka Joselewicza 12). It is a matcha bar where craft Yume matcha, brought directly from the Uji region, is the base of the menu: traditional usucha in a chawan bowl, matcha latte, iced matcha and a refreshing matcha tonic.',
      ],
      [
        'Which matcha do you serve?',
        'Yume matcha in three pure grades: **Yume Asa** (everyday, mild with natural sweetness), **Yume Hana** (deeper green and rich in l-theanine) and **Yume Hoshi** (Master’s Blend, the top grade, stone-ground, with a deep umami profile).',
      ],
      [
        'Where to get a matcha tonic in Kraków?',
        'Our signature Iced Matcha Tonic is on the regular menu at Café Belmont in Kazimierz (22 zł). We make it with premium tonic, ice and freshly whisked Yume matcha with a slice of citrus.',
      ],
      [
        'Do you serve breakfast?',
        'Yes! Every day until 12:00 we serve breakfast sets: fresh onigiri rice triangles with a hot specialty coffee of your choice (25 zł) or with a Matcha Latte on Yume Asa (29 zł).',
      ],
      [
        'Do you have plant-based milk?',
        'Yes, we serve Oatly (oat) and Sproud (pea protein) with any matcha or coffee. We also have high-quality cow milk.',
      ],
      [
        'What should I order first?',
        'Start with a Matcha Latte on Yume Asa – velvety and delicate. If you want something refreshing, go for the Iced Matcha Tonic. Add an onigiri Tuna Mayo or the marinated Sweet Tofu, made fresh on site.',
      ],
      [
        'What is the difference between matcha latte and matcha tonic?',
        'Matcha latte is matcha whisked with the milk of your choice – creamy, thick and soothing. Matcha tonic is two-layer matcha poured over sparkling tonic with ice – light, citrusy, fizzy and seriously thirst-quenching.',
      ],
      [
        'Do you have specialty coffee?',
        'Yes, our whole coffee menu is carefully selected single-origin specialty beans from European roasters: espresso, cortado, flat white, cappuccino, latte, batch brew, V60 drip, cold brew and espresso tonic.',
      ],
      [
        'What is onigiri?',
        'Traditional Japanese triangles of lightly seasoned rice with a savoury filling, wrapped in a crisp sheet of nori seaweed. We make Sweet Tofu, Tuna Mayo and Umeboshi (with traditional pickled plum).',
      ],
      [
        'Does matcha have a lot of caffeine?',
        'Matcha naturally contains caffeine, paired with a high concentration of l-theanine. Thanks to this synergy matcha releases energy gradually and steadily over 4–6 hours, without jitters and without the sudden afternoon crash you can get after espresso.',
      ],
      [
        'Is matcha brewed?',
        'No. Matcha is not brewed like loose-leaf tea — you don’t pour boiling water over it and let it steep. The powdered tencha leaf is whisked with a bamboo chasen in a little water or milk until a velvety micro-foam forms, and drunk whole. That is why we say matcha is _whisked_ or _prepared_, not brewed.',
      ],
      [
        'Where exactly is Café Belmont?',
        'In Kazimierz, Kraków, at ul. Berka Joselewicza 12 (31-051 Kraków), just a minute’s walk from Miodowa street and Plac Nowy.',
      ],
    ],
  },
  footer: {
    address: 'ul. Berka Joselewicza 12 · 31-051 Kraków, Kazimierz',
    hours: 'Daily · 9:00 – 19:00',
    copy: '© 2026 CAFÉ BELMONT · KRAKÓW',
  },
};

export const copy: Record<Lang, Copy> = { pl, en };

/** Strips the **bold** / _italic_ markers (for JSON-LD and attributes). */
export const plain = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/_(.+?)_/g, '$1');
