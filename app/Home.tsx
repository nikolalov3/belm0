'use client';

import React, { useState, useEffect, useRef } from 'react';

import { YUME_SHOP, type Copy, type MenuItemCopy } from './copy';
import { rich, YumeMark } from './rich';

const WIFI_PASS = 'Belmont2026';

function ZenItem({ item }: { item: MenuItemCopy }) {
  const cls = ['zen-item', item.highlight && 'highlight-item', item.combo && 'combo-item'].filter(Boolean).join(' ');
  return (
    <li className={cls}>
      <div className="zi-main">
        <span className="zi-name">
          {item.name}
          {item.badge && (
            <>
              {' '}
              <span className="tag-badge">{item.badge}</span>
            </>
          )}
        </span>
        <span className="zi-dots"></span>
        <span className="zi-price">{item.price}</span>
      </div>
      {item.sub && <p className="zi-sub">{item.sub}</p>}
    </li>
  );
}

export default function Home({ t }: { t: Copy }) {
  // 1. Live Hours state (9:00 - 19:00 Europe/Warsaw)
  const [hours, setHours] = useState<'checking' | 'open' | 'closed'>('checking');
  const isOpenNow = hours === 'open';
  const liveStatus = hours === 'checking' ? [t.status.checking, ''] : t.status[hours];

  useEffect(() => {
    function checkHours() {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('pl-PL', {
        timeZone: 'Europe/Warsaw',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
      const parts = formatter.formatToParts(now);
      const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10);
      setHours(hour >= 9 && hour < 19 ? 'open' : 'closed');
    }
    checkHours();
    const interval = setInterval(checkHours, 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. Autumn Menu Drawer state
  const [isAutumnOpen, setIsAutumnOpen] = useState(false);

  // 3. Flyer Lightbox Dialog ref (Modern Web Guidance with closedby="any" & light dismiss)
  const flyerDialogRef = useRef<HTMLDialogElement>(null);

  const openFlyerModal = () => {
    flyerDialogRef.current?.showModal();
  };

  const closeFlyerModal = () => {
    flyerDialogRef.current?.close();
  };

  useEffect(() => {
    const dialog = flyerDialogRef.current;
    if (!dialog) return;

    // Fallback for browsers that do not yet support `closedby="any"`
    const handleDialogClick = (event: MouseEvent) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      const isInside =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;
      if (!isInside) {
        dialog.close();
      }
    };

    dialog.addEventListener('click', handleDialogClick);
    return () => dialog.removeEventListener('click', handleDialogClick);
  }, []);

  // 4. WiFi reveal & copy state
  const [isWifiRevealed, setIsWifiRevealed] = useState(false);
  const [wifiCopied, setWifiCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleWifiAction = async () => {
    if (!isWifiRevealed) {
      setIsWifiRevealed(true);
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(WIFI_PASS);
      } else {
        const ta = document.createElement('textarea');
        ta.value = WIFI_PASS;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setWifiCopied(true);
      showToast(t.visit.toastCopied.replace('{pass}', WIFI_PASS));
    } catch {
      showToast(t.visit.toastPlain.replace('{pass}', WIFI_PASS));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 5. Yume Carousel dots sync for mobile
  const carouselTrackRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const handleTrackScroll = () => {
    if (!carouselTrackRef.current) return;
    const track = carouselTrackRef.current;
    const firstChild = track.children[0] as HTMLElement | undefined;
    const step = firstChild ? firstChild.offsetWidth + 20 : 280;
    const index = Math.round(track.scrollLeft / step);
    setActiveDot(Math.min(Math.max(index, 0), 2));
  };

  const scrollToCard = (index: number) => {
    if (!carouselTrackRef.current) return;
    const track = carouselTrackRef.current;
    const child = track.children[index] as HTMLElement | undefined;
    if (child) {
      child.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const marqueeGroup = (hidden: boolean) => (
    <div className="marquee-group" aria-hidden={hidden || undefined}>
      {t.marquee.map((line) => (
        <React.Fragment key={line}>
          <span>{line}</span>
          <span className="sep">/</span>
        </React.Fragment>
      ))}
    </div>
  );

  const langSwitch = (className: string) => (
    <a href={t.switchTo.href} hrefLang={t.switchTo.code} lang={t.switchTo.code} className={className} title={t.switchTo.title}>
      {t.switchTo.label}
    </a>
  );

  return (
    <>
      {/* Top Announcement Marquee Ticker */}
      <div className="marquee-bar">
        <div className="marquee-track">
          {marqueeGroup(false)}
          {marqueeGroup(true)}
        </div>
      </div>

      {/* Site Header */}
      <header className="site-header">
        <div className="header-inner">
          <nav className="nav-links-left" aria-label={t.nav.main}>
            <a href="#menu" className="nav-item">{t.nav.menu}</a>
            <a href="#autumn-panel" className="nav-item">{t.nav.autumn}</a>
            <a href="#yume-craft" className="nav-item">{t.nav.yume}</a>
          </nav>

          <div className="nav-brand">
            <a href="#" className="brand-title">CAFÉ BELMONT</a>
          </div>

          <div className="nav-right">
            <span
              className="status-pill"
              style={{
                color: isOpenNow ? 'var(--accent-matcha)' : 'var(--ink-muted)',
                borderColor: isOpenNow ? 'var(--accent-matcha)' : 'var(--line-subtle)',
              }}
            >
              <span className="status-indicator-dot"></span>
              {liveStatus[0]}
              {liveStatus[1] && <span className="status-detail"> • {liveStatus[1]}</span>}
            </span>
            {langSwitch('lang-switch')}
            <a href="#visit" className="nav-visit-btn">{t.nav.visit}</a>
          </div>
        </div>

        {/* Mobile Quick Navigation Ribbon */}
        <nav className="mobile-quick-nav" aria-label={t.nav.quick}>
          <a href="#menu" className="quick-pill">{t.nav.menu}</a>
          <a href="#autumn-panel" className="quick-pill pill-autumn">🍁 {t.nav.autumn}</a>
          <a href="#yume-craft" className="quick-pill">{t.nav.yume}</a>
          <a href="#reviews" className="quick-pill">{t.nav.reviews}</a>
          <a href="#visit" className="quick-pill">{t.nav.visitWifi}</a>
          <a href="#faq" className="quick-pill">{t.nav.faq}</a>
        </nav>
      </header>

      <main id="main-content">

        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-wrap">

            {/* Tablecloth Gingham Stage matching Artwork background */}
            <div className="hero-plaid-stage">
              <div className="plaid-canvas">
                <img
                  src="/images/hero/belmont_umbrellas_clean.webp"
                  alt={t.hero.artAlt}
                  className="art-img"
                  width="440"
                  height="330"
                />
                <div className="art-tag-strip">
                  <span>{t.hero.artTags[0]}</span>
                  <span>{t.hero.artTags[1]}</span>
                </div>
              </div>
            </div>

            <div className="hero-intro">
              <p className="hero-kicker">{t.hero.kicker}</p>
              <h1 className="hero-heading">
                {t.hero.h1[0]}<br />{t.hero.h1[1]}
              </h1>
              <p className="hero-lead">
                {t.hero.leadBefore}
                <a
                  href={YUME_SHOP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="yume-hero-pill"
                  title={t.hero.yumeTitle}
                >
                  <YumeMark /> ↗
                </a>
                {t.hero.leadAfter}
              </p>
              <p className="hero-lead hero-lead-2">{t.hero.lead2}</p>
              <div className="hero-cta-group">
                <a href="#menu" className="btn-zen btn-zen-primary">{t.hero.ctaMenu}</a>
                <a href="#autumn-panel" className="btn-zen btn-zen-accent">{t.hero.ctaAutumn}</a>
                <a href="#visit" className="btn-zen btn-zen-subtle">{t.hero.ctaVisit}</a>
              </div>
            </div>

          </div>
        </section>

        {/* Enticing Autumn Seasonal Panel with Floating Leaves */}
        <section className="autumn-feature-section" id="autumn-panel">
          <div className="autumn-card">
            <div className="leaves-ambient" aria-hidden="true">
              <span className="leaf leaf-1">🍂</span>
              <span className="leaf leaf-2">🍁</span>
              <span className="leaf leaf-3">🍂</span>
              <span className="leaf leaf-4">🍁</span>
            </div>

            <div className="autumn-summary">
              <div className="autumn-badge-row">
                <span className="badge-jp">{t.autumn.badgeJp}</span>
                <span className="badge-text">{t.autumn.badgeText}</span>
              </div>
              <h2 className="autumn-headline">{t.autumn.headline}</h2>
              <p className="autumn-sub">{t.autumn.sub}</p>

              <button
                type="button"
                className="btn-toggle-autumn"
                onClick={() => setIsAutumnOpen(!isAutumnOpen)}
                aria-expanded={isAutumnOpen}
                aria-controls="autumn-drawer"
              >
                <span>{isAutumnOpen ? t.autumn.close : t.autumn.open}</span>
                <span className={`btn-arrow ${isAutumnOpen ? 'rotated' : ''}`}>↓</span>
              </button>
            </div>

            {/* Collapsible Content */}
            {isAutumnOpen && (
              <div className="autumn-drawer" id="autumn-drawer">
                <div className="autumn-items-list">
                  {t.autumn.items.map((item) => (
                    <div className="autumn-item" key={item.name}>
                      <div className="ai-top">
                        <span className="ai-name">{item.name}</span>
                        <span className="ai-price">{item.price}</span>
                      </div>
                      <p className="ai-desc">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="autumn-flyer-note">
                  <span>{rich(t.autumn.flyerNote)}</span>
                  <button
                    type="button"
                    className="btn-view-flyer"
                    onClick={openFlyerModal}
                  >
                    {t.autumn.flyerBtn}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Main Menu (Japanese Minimalist Line Flow) */}
        <section className="menu-section" id="menu">
          <div className="menu-wrap">

            <header className="section-zen-head">
              <span className="zen-tag">{t.menu.tag}</span>
              <h2 className="zen-title">{t.menu.title}</h2>
              <p className="zen-desc">{t.menu.desc}</p>
            </header>

            {/* Category: MATCHA YUME */}
            <div className="menu-category">
              <div className="cat-header">
                <div className="cat-title-group">
                  <span className="cat-kanji">{t.menu.matcha.kanji}</span>
                  <h3 className="cat-name">{t.menu.matcha.name}</h3>
                </div>
                <span className="cat-note">{t.menu.matcha.note}</span>
              </div>

              <div className="cat-body">
                <ul className="zen-item-list">
                  {t.menu.matcha.items.map((item) => <ZenItem item={item} key={item.name} />)}
                </ul>

                <div className="zen-info-box">
                  <span className="box-label">{t.menu.matcha.infoLabel}</span>
                  <p>
                    {t.menu.matcha.info.map((line, i) => (
                      <React.Fragment key={line}>
                        {i > 0 && <br />}
                        {rich(line)}
                      </React.Fragment>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            {/* Category: KAWA SPECIALTY */}
            <div className="menu-category">
              <div className="cat-header">
                <div className="cat-title-group">
                  <span className="cat-kanji">{t.menu.coffee.kanji}</span>
                  <h3 className="cat-name">{t.menu.coffee.name}</h3>
                </div>
                <span className="cat-note">{t.menu.coffee.note}</span>
              </div>

              <div className="cat-body">
                <div className="two-subcols">
                  <div className="subcol">
                    <h4 className="subcol-heading">{t.menu.coffee.hot}</h4>
                    <ul className="zen-item-list">
                      {t.menu.coffee.hotItems.map((item) => <ZenItem item={item} key={item.name} />)}
                    </ul>
                  </div>

                  <div className="subcol">
                    <h4 className="subcol-heading">{t.menu.coffee.cold}</h4>
                    <ul className="zen-item-list">
                      {t.menu.coffee.coldItems.map((item) => <ZenItem item={item} key={item.name} />)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Category: ONIGIRI & ŚNIADANIA */}
            <div className="menu-category">
              <div className="cat-header">
                <div className="cat-title-group">
                  <span className="cat-kanji">{t.menu.food.kanji}</span>
                  <h3 className="cat-name">{t.menu.food.name}</h3>
                </div>
                <span className="cat-note">{t.menu.food.note}</span>
              </div>

              <div className="cat-body">
                <ul className="zen-item-list">
                  {t.menu.food.items.map((item) => <ZenItem item={item} key={item.name} />)}
                </ul>
              </div>
            </div>

          </div>
        </section>

        {/* Yume: our own matcha. 3 Open Panels (Zero Boxes) */}
        <section className="craft-section" id="yume-craft">
          <div className="craft-wrap">

            <header className="section-zen-head">
              <span className="zen-tag">{t.craft.tag}</span>
              <h2 className="zen-title">
                {t.craft.titleBefore}{' '}
                <a
                  href={YUME_SHOP}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-yume-pill"
                  title={t.craft.pillTitle}
                >
                  <YumeMark /> ↗
                </a>
              </h2>
              <p className="zen-subtitle">{t.craft.subtitle}</p>
              <p className="zen-desc">{t.craft.desc}</p>
            </header>

            <div
              className="zen-panels-row"
              ref={carouselTrackRef}
              onScroll={handleTrackScroll}
            >
              {t.craft.grades.map((g) => (
                <div className="zen-open-panel" key={g.name}>
                  <a href={g.href} target="_blank" rel="noopener noreferrer" className="zop-media" tabIndex={-1} aria-hidden="true">
                    <img
                      src={g.img}
                      alt={g.alt}
                      className="zop-img"
                      width="500"
                      height="500"
                      loading="lazy"
                    />
                  </a>
                  <div className="zop-info">
                    <span className="zop-grade">{g.grade}</span>
                    <h4 className="zop-title">{g.name}</h4>
                    <span className={`zop-extra${g.extraClass ? ` ${g.extraClass}` : ''}`}>{g.extra}</span>
                    <p className="zop-text">{g.text}</p>
                    <span className="zop-meta">{g.meta}</span>
                    <a href={g.href} target="_blank" rel="noopener noreferrer" className="zop-shop-link">
                      <YumeMark /> {g.link}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Mobile Dots Bar */}
            <div className="zen-dots-bar" role="tablist" aria-label={t.craft.dotsLabel}>
              {[0, 1, 2].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  role="tab"
                  aria-selected={activeDot === idx}
                  aria-label={t.craft.dotLabel.replace('{n}', String(idx + 1))}
                  className={`z-dot ${activeDot === idx ? 'active' : ''}`}
                  onClick={() => scrollToCard(idx)}
                />
              ))}
            </div>

            <div className="craft-note">
              <h3>{t.craft.noteTitle}</h3>
              <p>{t.craft.noteText}</p>
            </div>

            <div className="yume-action-row">
              <a
                href={YUME_SHOP}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-yume-pill-large"
                title={t.craft.pillTitle}
              >
                <span>{t.craft.shopLead}</span>
                <YumeMark />
                <strong>{t.craft.shopDomain}</strong>
              </a>
            </div>

          </div>
        </section>

        {/* Google Maps Reviews (Japanese Line Flow — Zero Boxes) */}
        <section className="reviews-section" id="reviews">
          <div className="reviews-wrap">

            <header className="section-zen-head">
              <span className="zen-tag">{t.reviews.tag}</span>
              <h2 className="zen-title">{t.reviews.title}</h2>
              <p className="zen-desc">{t.reviews.desc}</p>
            </header>

            <div className="reviews-line-flow">
              {t.reviews.items.map((r) => (
                <article className="rev-line-item" key={r.author}>
                  <div className="rli-stars">★★★★★</div>
                  <p className="rli-text">{r.text}</p>
                  <span className="rli-author">{r.author}</span>
                </article>
              ))}
            </div>

            <div className="reviews-link-wrap">
              <a
                href={t.visit.links[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="zen-link"
              >
                {t.reviews.link}
              </a>
            </div>

          </div>
        </section>

        {/* Visit & Specs (Ultra-Minimalist Line Ledger — Zero Boxes) */}
        <section className="visit-section" id="visit">
          <div className="visit-wrap">

            <header className="section-zen-head">
              <span className="zen-tag">{t.visit.tag}</span>
              <h2 className="zen-title">{t.visit.title}</h2>
            </header>

            <div className="visit-minimal-ledger">
              {t.visit.rows.map(([label, val]) => (
                <div className="vml-row" key={label}>
                  <span className="vml-label">{label}</span>
                  <span className="vml-val">{val}</span>
                </div>
              ))}

              {/* Hidden Wi-Fi with Tap-to-Reveal and Copy */}
              <div className="vml-row wifi-ledger-row">
                <span className="vml-label">{t.visit.wifiLabel}</span>
                <div className="wifi-secure-box">
                  <span className={`wifi-secret ${isWifiRevealed ? 'revealed' : ''}`}>
                    {isWifiRevealed ? WIFI_PASS : '••••••••••'}
                  </span>
                  <button
                    type="button"
                    className="btn-wifi-reveal"
                    onClick={handleWifiAction}
                  >
                    {wifiCopied ? t.visit.wifiCopied : t.visit.wifiReveal}
                  </button>
                </div>
              </div>
            </div>

            <div className="visit-light-links">
              {t.visit.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="light-nav-link"
                >
                  <span>{l.label}</span>
                  <span>➔</span>
                </a>
              ))}
            </div>

          </div>
        </section>

        {/* FAQ Section (Japanese Minimalist Exclusive Disclosure Accordion) */}
        <section className="faq-section" id="faq">
          <div className="faq-wrap">

            <header className="section-zen-head">
              <span className="zen-tag">{t.faq.tag}</span>
              <h2 className="zen-title">{t.faq.title}</h2>
              <p className="zen-desc">{t.faq.desc}</p>
            </header>

            <div className="faq-accordion-group">
              {t.faq.items.map(([q, a], i) => (
                <details className="faq-item" name="belmont-faq" open={i === 0 || undefined} key={q}>
                  <summary className="faq-summary">
                    <span className="faq-question">{q}</span>
                    <span className="faq-icon" aria-hidden="true">+</span>
                  </summary>
                  <div className="faq-answer">
                    <p>{rich(a)}</p>
                  </div>
                </details>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* Centered Minimalist Footer */}
      <footer className="site-footer">
        <div className="footer-center-content">
          <div className="fc-brand">CAFÉ BELMONT</div>
          <p className="fc-address">{t.footer.address}</p>

          <div className="fc-links">
            <a href="#menu">{t.nav.menu}</a>
            <a href="#autumn-panel">{t.nav.autumn}</a>
            <a href="#yume-craft">{t.nav.yume}</a>
            <a href="#reviews">{t.nav.reviews}</a>
            <a href="#visit">{t.nav.visitWifi}</a>
            <a href="#faq">{t.nav.faq}</a>
            <a href="https://instagram.com/cafe_belmont" target="_blank" rel="noopener noreferrer">Instagram</a>
            {langSwitch('')}
          </div>

          <div className="fc-hours">{t.footer.hours}</div>
          <div className="fc-copy">{t.footer.copy}</div>
        </div>
      </footer>

      {/* Native Accessible Dialog for Autumn Poster (Modern Web Guidance) */}
      <dialog
        ref={flyerDialogRef}
        className="flyer-native-dialog"
        {...({ closedby: 'any' } as React.HTMLAttributes<HTMLDialogElement>)}
        aria-label={t.autumn.dialogLabel}
      >
        <div className="dialog-content-wrapper">
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeFlyerModal}
            aria-label={t.autumn.closeLabel}
          >
            ✕
          </button>
          <img
            src="/images/hero/autumn_menu_official.webp"
            alt={t.autumn.posterAlt}
            className="modal-poster-img"
            width="440"
            height="620"
          />
        </div>
      </dialog>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast show" role="alert" aria-live="polite">
          {toastMessage}
        </div>
      )}
    </>
  );
}
