/* Café Belmont — hero intro
   On entry: only the matcha droplet hangs there. Scrolling pours it into the
   glass (the page itself stays put). Once the drink is full it is signed
   (e.g. Matcha latte) and the wordmark lights up; the page won't scroll on —
   you tap the drink label to drop into the menu. */

(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fitScene() {
    var vh = window.innerHeight, vw = window.innerWidth;
    var s = Math.min(1, (vh * 0.9) / 640, (vw * 0.94) / 320);
    document.documentElement.style.setProperty('--scene-scale', s.toFixed(3));
  }
  fitScene();
  window.addEventListener('resize', fitScene);

  function initReveals() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.18 });
    els.forEach(function (el) { io.observe(el); });
  }

  function spiralArm(cx, cy, phase, turns, r0, k, flat) {
    var steps = 56, thetaMax = turns * Math.PI * 2, d = '';
    for (var i = 0; i <= steps; i++) {
      var t = (i / steps) * thetaMax, a = t + phase, r = r0 * Math.exp(k * t);
      d += (i === 0 ? 'M' : 'L') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a) * flat).toFixed(1) + ' ';
    }
    return d.trim();
  }

  var isTonic = false;
  function applyVariant() {
    isTonic = Math.random() < 0.5;
    document.documentElement.setAttribute('data-drink', isTonic ? 'tonic' : 'matcha');
    var dn = document.getElementById('drinkName');
    if (dn) dn.textContent = isTonic ? 'Matcha tonic' : 'Matcha latte';
    if (!isTonic) return;
    var set = function (id, attr, val) { var el = document.getElementById(id); if (el) el.setAttribute(attr, val); };
    set('liquidRect', 'fill', 'url(#tonicGrad)');
    set('dropPath', 'fill', 'url(#dropGradTonic)');
    set('puddle', 'fill', '#a86cf0');
    document.querySelectorAll('.crumb').forEach(function (c) { c.setAttribute('fill', '#b57cf5'); });
    var arms = document.querySelectorAll('#galaxy .arm');
    if (arms[0]) arms[0].setAttribute('d', spiralArm(120, 302, 0, 1.45, 12, 0.26, 0.6));
    if (arms[1]) arms[1].setAttribute('d', spiralArm(120, 302, Math.PI, 1.45, 12, 0.26, 0.6));
  }

  function staticFallback() {
    var liquid = document.getElementById('liquid');
    if (liquid) liquid.setAttribute('transform', 'translate(0,128)');
    var drop = document.getElementById('dropFall');
    if (drop) drop.style.opacity = '0';
    var g = document.getElementById('galaxy');
    if (g && isTonic) g.setAttribute('opacity', '0.85');
    var wm = document.querySelector('.wordmark');
    if (wm) { wm.style.opacity = '1'; wm.classList.add('lit'); }
    var label = document.querySelector('.drink-label');
    if (label) { label.style.opacity = '1'; label.style.visibility = 'visible'; label.classList.add('ready'); }
    initReveals();
  }

  function start() {
    applyVariant();
    if (!window.gsap) { staticFallback(); return; }
    var gsap = window.gsap;
    var hasMotion = !!window.MotionPathPlugin;
    if (hasMotion) gsap.registerPlugin(window.MotionPathPlugin);

    initReveals();

    var lenis = null;
    if (window.Lenis && !reduce) {
      lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
    function setLock(on) {
      document.documentElement.classList.toggle('locked', on);
      if (lenis) { on ? lenis.stop() : lenis.start(); }
    }

    /* continuous idle motion — off for reduced-motion (the scroll-driven fill
       itself stays, since the user controls it) */
    if (!reduce) {
      gsap.to('#dropBob', { y: -8, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.foam', { attr: { ry: 13 }, duration: 2.0, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.fromTo('#foamG', { rotation: -2.5 },
        { rotation: 2.5, transformOrigin: '50% 50%', duration: 2.0, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      if (isTonic) {
        gsap.to('#galaxy', { rotation: 360, transformOrigin: '50% 50%', duration: 22, repeat: -1, ease: 'none' });
        gsap.to('#galaxy', { scale: 1.1, transformOrigin: '50% 50%', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        gsap.to('#galaxy', { x: 6, y: 4, duration: 6.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }
    }

    /* base state: on entry, only the droplet is there */
    gsap.set('#dropFall', { x: 120, y: -92 });
    gsap.set('#dropSquash', { transformOrigin: '50% 100%' });
    gsap.set('#liquid', { y: 360 });
    gsap.set('#baseShadow', { opacity: 0.15, scale: 0.85, svgOrigin: '160 565' });
    gsap.set('#puddle', { attr: { rx: 0 } });
    gsap.set(['.glass-body', '.glass-rim', '.glass-shine'], { opacity: 0 });
    gsap.set('.wordmark', { opacity: 0, y: 6 });
    gsap.set('.drink-label', { autoAlpha: 0 });

    setLock(true);

    /* the fill choreography — paused; scroll drives its progress */
    var tl = gsap.timeline({ paused: true });

    /* camera descends toward the glass — a subtle zoom-in that settles as the
       drop lands, so the glass arrives instead of blinking in */
    tl.fromTo('.scene-svg', { scale: 0.93, y: 24, transformOrigin: '50% 52%' },
      { scale: 1, y: 0, duration: 2.0, ease: 'power2.out' }, 0)

    /* the photo wall streaks upward as we fall — this is what sells the descent */
      .fromTo('.wall-grid', { y: 0, scale: 1 },
        { y: -150, scale: 1.05, duration: 1.95, ease: 'power2.in' }, 0.3)

    /* glass emerges as we approach it */
      .to(['.glass-body', '.glass-rim', '.glass-shine'], { opacity: 1, duration: 0.7, ease: 'power1.out' }, 0.2)

      .to('#dropFall', { y: 302, duration: 1.4, ease: 'power2.in' }, 0.5)
      .to('#dropSquash', { scaleY: 1.16, scaleX: 0.9, duration: 1.2, ease: 'power1.in' }, 0.6)

      .to('#dropSquash', { scaleY: 0.5, scaleX: 1.5, duration: 0.09, ease: 'power2.out' }, 1.9)
      .to('#dropSquash', { scaleY: 0.05, scaleX: 1.8, duration: 0.13, ease: 'power1.in' }, 1.99)
      .to('#dropFall', { autoAlpha: 0, duration: 0.13 }, 2.0)

      .fromTo('#puddle', { attr: { rx: 0, ry: 6 }, opacity: 1 },
        { attr: { rx: 88, ry: 18 }, duration: 0.22, ease: 'power3.out', immediateRender: false }, 1.92)
      .to('#puddle', { opacity: 0, duration: 0.45 }, 2.22)

      .to('#liquid', { y: 128, duration: 0.8, ease: 'power2.out' }, 2.05)
      .fromTo('#baseShadow', { opacity: 0.15, scale: 0.85 },
        { opacity: 1, scale: 1, svgOrigin: '160 565', duration: 0.8, ease: 'power2.out' }, 2.05)

      .fromTo('#ripple1', { attr: { rx: 12, ry: 4 }, opacity: 0.6 },
        { attr: { rx: 76, ry: 15 }, opacity: 0, duration: 0.7, ease: 'power1.out', immediateRender: false }, 2.45)
      .fromTo('#ripple2', { attr: { rx: 12, ry: 4 }, opacity: 0.45 },
        { attr: { rx: 76, ry: 15 }, opacity: 0, duration: 0.7, ease: 'power1.out', immediateRender: false }, 2.65)

      .fromTo('.wordmark', { opacity: 0, y: 22, scale: 0.97, transformOrigin: '50% 50%' },
        { opacity: 1, y: 0, scale: 1, duration: 0.85, ease: 'power3.out' }, 2.4)
      .to('.drink-label', { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 2.95);

    var crumbs = gsap.utils.toArray('.crumb');
    crumbs.forEach(function (c, i) {
      var dir = (i % 2 === 0) ? -1 : 1;
      var spread = 24 + i * 8, peak = 26 - (i % 3) * 5;
      var apexX = 120 + dir * spread * 0.6, landX = 120 + dir * spread * 1.0;
      tl.set(c, { opacity: 0.95 }, 1.92);
      if (hasMotion) {
        tl.to(c, { duration: 0.4, ease: 'power1.out',
          motionPath: { path: [{ x: 120, y: 320 }, { x: apexX, y: 320 - peak }, { x: landX, y: 326 }], curviness: 1.2 } }, 1.92);
      } else {
        tl.fromTo(c, { x: 120, y: 320 }, { x: landX, y: 326, duration: 0.4, ease: 'power1.out' }, 1.92);
      }
      tl.to(c, { opacity: 0, duration: 0.2 }, 2.15);
    });

    if (isTonic) tl.to('#galaxy', { opacity: 0.85, duration: 0.6, ease: 'power2.out' }, 2.45);

    /* Scroll/swipe pours the drink in place while the page stays locked.
       For fluidity the raw input feeds a TARGET, and a rAF lerp glides the
       rendered progress toward it — so the fill and the parallax move smoothly
       instead of stepping with every discrete wheel/touch event.
       FILL_PX = gesture distance for a full glass; touch is boosted so one
       comfortable swipe is enough; SMOOTH = how fast it catches up (0..1). */
    var FILL_PX = 560;
    var TOUCH_BOOST = 3.6;
    var SMOOTH = 0.16;
    var targetProg = 0, renderProg = 0, lastRendered = -1, lit = false, done = false;
    var label = document.getElementById('drinkLabel');

    function applyState() {
      tl.progress(renderProg);
      if (!lit && renderProg > 0.72) { lit = true; document.querySelector('.wordmark').classList.add('lit'); }
      if (renderProg >= 0.985 && label) label.classList.add('ready');
    }
    gsap.ticker.add(function () {
      if (done) return;
      var d = targetProg - renderProg;
      renderProg = (Math.abs(d) > 0.0004) ? renderProg + d * SMOOTH : targetProg;
      if (renderProg !== lastRendered) { lastRendered = renderProg; applyState(); }
    });
    function addProgress(dpx) {
      if (done) return;
      targetProg = Math.max(0, Math.min(1, targetProg + dpx / FILL_PX));
    }

    window.addEventListener('wheel', function (e) {
      if (done) return;
      e.preventDefault();
      addProgress(e.deltaY);
    }, { passive: false });

    var ty = null;
    window.addEventListener('touchstart', function (e) { if (!done) ty = e.touches[0].clientY; }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      if (done) return;
      e.preventDefault();
      var y = e.touches[0].clientY;
      if (ty !== null) addProgress((ty - y) * TOUCH_BOOST);
      ty = y;
    }, { passive: false });

    function goToMenu() {
      if (done || targetProg < 0.9) return;   /* only advances once the drink is poured */
      done = true;
      renderProg = targetProg = 1;
      tl.progress(1);
      setLock(false);
      var target = document.querySelector('.content');
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { duration: 1.1, easing: function (x) { return 1 - Math.pow(1 - x, 3); } });
      else target.scrollIntoView({ behavior: 'smooth' });
    }
    if (label) label.addEventListener('click', goToMenu);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
