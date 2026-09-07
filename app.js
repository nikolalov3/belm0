/* Café Belmont — hero intro
   Start: only the droplet. It auto-falls, the glass fills, and the drink is
   "signed" (e.g. Matcha latte) while the wordmark lights up. The page is locked
   until you tap the drink label, which then drops you into the menu. */

(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* keep the 320x640 stage fitted to the viewport on any phone */
  function fitScene() {
    var vh = window.innerHeight, vw = window.innerWidth;
    var s = Math.min(1, (vh * 0.9) / 640, (vw * 0.94) / 320);
    document.documentElement.style.setProperty('--scene-scale', s.toFixed(3));
  }
  fitScene();
  window.addEventListener('resize', fitScene);

  /* reveal-on-scroll for the sections below */
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

  /* a logarithmic spiral arm, as an SVG path string */
  function spiralArm(cx, cy, phase, turns, r0, k, flat) {
    var steps = 56, thetaMax = turns * Math.PI * 2, d = '';
    for (var i = 0; i <= steps; i++) {
      var t = (i / steps) * thetaMax;
      var a = t + phase, r = r0 * Math.exp(k * t);
      d += (i === 0 ? 'M' : 'L') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a) * flat).toFixed(1) + ' ';
    }
    return d.trim();
  }

  /* randomly serve one of two drinks: matcha (default) or matcha tonic */
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

  /* if GSAP didn't load, present the finished drink and let the page scroll */
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

    /* smooth momentum scroll for the content (locked during the intro) */
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
    var label = document.getElementById('drinkLabel');
    var goneToMenu = false;
    function goToMenu() {
      if (goneToMenu) return; goneToMenu = true;
      setLock(false);
      var target = document.querySelector('.content');
      if (!target) return;
      if (lenis) lenis.scrollTo(target, { duration: 1.1, easing: function (x) { return 1 - Math.pow(1 - x, 3); } });
      else target.scrollIntoView({ behavior: 'smooth' });
    }
    if (label) label.addEventListener('click', goToMenu);

    /* continuous life: hero bob + frothy shimmer + gentle surface sway */
    gsap.to('#dropBob', { y: -8, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.foam', { attr: { ry: 13 }, duration: 2.0, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.fromTo('#foamG', { rotation: -2.5 },
      { rotation: 2.5, transformOrigin: '50% 50%', duration: 2.0, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    if (isTonic && !reduce) {
      gsap.to('#galaxy', { rotation: 360, transformOrigin: '50% 50%', duration: 22, repeat: -1, ease: 'none' });
      gsap.to('#galaxy', { scale: 1.1, transformOrigin: '50% 50%', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('#galaxy', { x: 6, y: 4, duration: 6.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    /* base state: at first, only the droplet */
    gsap.set('#dropFall', { x: 120, y: -92 });
    gsap.set('#dropSquash', { transformOrigin: '50% 100%' });
    gsap.set('#liquid', { y: 360 });
    gsap.set('#baseShadow', { opacity: 0.15, scale: 0.85, svgOrigin: '160 565' });
    gsap.set('#puddle', { attr: { rx: 0 } });
    gsap.set(['.glass-body', '.glass-rim', '.glass-shine'], { opacity: 0 });
    gsap.set('.wordmark', { opacity: 0, y: 6 });
    gsap.set('.drink-label', { autoAlpha: 0 });

    setLock(true);

    if (reduce) {
      gsap.set('#liquid', { y: 128 });
      gsap.set('#baseShadow', { opacity: 1, scale: 1, svgOrigin: '160 565' });
      gsap.set('#puddle', { opacity: 0 });
      gsap.set('#dropFall', { autoAlpha: 0 });
      if (isTonic) gsap.set('#galaxy', { opacity: 0.85 });
      gsap.set(['.glass-body', '.glass-rim', '.glass-shine'], { opacity: 1 });
      gsap.set('.wordmark', { opacity: 1, y: 0 });
      gsap.set('.drink-label', { autoAlpha: 1 });
      document.querySelector('.wordmark').classList.add('lit');
      if (label) label.classList.add('ready');
      setLock(false);
      return;
    }

    var tl = gsap.timeline({ delay: 0.5, onComplete: function () { if (label) label.classList.add('ready'); } });

    /* glass fades in as the drop begins to fall */
    tl.to(['.glass-body', '.glass-rim', '.glass-shine'], { opacity: 1, duration: 0.6, ease: 'power1.out' }, 0.15)

      /* the fall: accelerate + stretch */
      .to('#dropFall', { y: 302, duration: 1.4, ease: 'power2.in' }, 0.5)
      .to('#dropSquash', { scaleY: 1.16, scaleX: 0.9, duration: 1.2, ease: 'power1.in' }, 0.6)

      /* impact: squash onto the floor, then sink in */
      .to('#dropSquash', { scaleY: 0.5, scaleX: 1.5, duration: 0.09, ease: 'power2.out' }, 1.9)
      .to('#dropSquash', { scaleY: 0.05, scaleX: 1.8, duration: 0.13, ease: 'power1.in' }, 1.99)
      .to('#dropFall', { autoAlpha: 0, duration: 0.13 }, 2.0)

      /* spread across the floor */
      .fromTo('#puddle', { attr: { rx: 0, ry: 6 }, opacity: 1 },
        { attr: { rx: 88, ry: 18 }, duration: 0.22, ease: 'power3.out', immediateRender: false }, 1.92)
      .to('#puddle', { opacity: 0, duration: 0.45 }, 2.22)

      /* fill to ~3/4 */
      .to('#liquid', { y: 128, duration: 0.8, ease: 'power2.out' }, 2.05)
      .fromTo('#baseShadow', { opacity: 0.15, scale: 0.85 },
        { opacity: 1, scale: 1, svgOrigin: '160 565', duration: 0.8, ease: 'power2.out' }, 2.05)

      /* ripples */
      .fromTo('#ripple1', { attr: { rx: 12, ry: 4 }, opacity: 0.6 },
        { attr: { rx: 76, ry: 15 }, opacity: 0, duration: 0.7, ease: 'power1.out', immediateRender: false }, 2.45)
      .fromTo('#ripple2', { attr: { rx: 12, ry: 4 }, opacity: 0.45 },
        { attr: { rx: 76, ry: 15 }, opacity: 0, duration: 0.7, ease: 'power1.out', immediateRender: false }, 2.65)

      /* the drink is ready: the title lights up and the label is signed on */
      .to('.wordmark', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 2.5)
      .call(function () { document.querySelector('.wordmark').classList.add('lit'); }, null, 2.55)
      .to('.drink-label', { autoAlpha: 1, duration: 0.6, ease: 'power2.out' }, 2.95);

    /* crown of droplets bursting up on arcs, contained by the glass */
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
