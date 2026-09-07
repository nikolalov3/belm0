/* Café Belmont — scroll scene
   droplet falls, hits the matcha with a real splash (squash & stretch,
   crown droplets on arcs, ripples, a rebound jet, gooey merge),
   then the matcha blooms up to ~3/4 and the menu rises onto it. */

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

  /* if GSAP didn't load, still show a sensible static state */
  function staticFallback() {
    var liquid = document.getElementById('liquid');
    if (liquid) liquid.setAttribute('transform', 'translate(0,128)');
    var drop = document.getElementById('dropFall');
    if (drop) drop.style.opacity = '0';
    var puddle = document.getElementById('puddle');
    if (puddle) puddle.style.opacity = '0';
    var g = document.getElementById('galaxy');
    if (g && isTonic) g.setAttribute('opacity', '0.85');
    var card = document.getElementById('menuCard');
    if (card) { card.style.opacity = '1'; card.style.transform = 'translate(-50%,0)'; }
    var hint = document.getElementById('scrollHint');
    if (hint) hint.style.opacity = '0';
    initReveals();
  }

  /* a logarithmic spiral arm, as an SVG path string */
  function spiralArm(cx, cy, phase, turns, r0, k, flat) {
    var steps = 56, thetaMax = turns * Math.PI * 2, d = '';
    for (var i = 0; i <= steps; i++) {
      var t = (i / steps) * thetaMax;
      var r = r0 * Math.exp(k * t);
      var a = t + phase;
      d += (i === 0 ? 'M' : 'L') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a) * flat).toFixed(1) + ' ';
    }
    return d.trim();
  }

  /* randomly serve one of two drinks: matcha (default) or matcha tonic */
  var isTonic = false;
  function applyVariant() {
    isTonic = Math.random() < 0.5;
    document.documentElement.setAttribute('data-drink', isTonic ? 'tonic' : 'matcha');
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

  function start() {
    applyVariant();
    if (!window.gsap) { staticFallback(); return; }
    var gsap = window.gsap;
    var ST = window.ScrollTrigger;
    var hasMotion = !!window.MotionPathPlugin;

    initReveals();

    if (ST) gsap.registerPlugin(ST);
    if (hasMotion) gsap.registerPlugin(window.MotionPathPlugin);

    /* smooth momentum scroll (optional) */
    if (window.Lenis && !reduce) {
      var lenis = new window.Lenis({ duration: 1.05, smoothWheel: true });
      if (ST) lenis.on('scroll', ST.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    /* continuous life: hero bob + frothy shimmer + gentle surface sway */
    gsap.to('#dropBob', { y: -8, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.foam', { attr: { ry: 13 }, duration: 2.0, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.fromTo('#foamG', { rotation: -2.5 },
      { rotation: 2.5, transformOrigin: '50% 50%', duration: 2.0, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    /* galactic tonic swirl: slow spin + organic drift, kept indistinct */
    if (isTonic && !reduce) {
      gsap.to('#galaxy', { rotation: 360, transformOrigin: '50% 50%', duration: 22, repeat: -1, ease: 'none' });
      gsap.to('#galaxy', { scale: 1.1, transformOrigin: '50% 50%', duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('#galaxy', { x: 6, y: 4, duration: 6.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    }

    /* base state */
    gsap.set('#dropFall', { x: 120, y: -92 });
    gsap.set('#dropSquash', { transformOrigin: '50% 100%' });
    gsap.set('#liquid', { y: 360 });
    gsap.set('#baseShadow', { opacity: 0.15, scale: 0.85, svgOrigin: '160 565' });
    gsap.set('#puddle', { attr: { rx: 0 } });
    gsap.set('.menu-card', { xPercent: -50, y: 40, opacity: 0 });

    if (reduce || !ST) {
      /* no scroll choreography: present the finished glass */
      gsap.set('#liquid', { y: 128 });
      gsap.set('#baseShadow', { opacity: 1, scale: 1, svgOrigin: '160 565' });
      gsap.set('#puddle', { opacity: 0 });
      gsap.set('#dropFall', { autoAlpha: 0 });
      if (isTonic) gsap.set('#galaxy', { opacity: 0.85 });
      gsap.set('.menu-card', { opacity: 1, y: 0 });
      gsap.set('.scroll-hint', { opacity: 0 });
      gsap.set('.wordmark', { opacity: 0.16 });
      return;
    }

    ST.config({ ignoreMobileResize: true });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.scene',
        start: 'top top',
        end: '+=2100',
        scrub: 0.6,
        pin: '.scene',
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    tl.to('.scroll-hint', { opacity: 0, duration: 0.4 }, 0)
      .to('.wordmark', { opacity: 0.16, y: -6, duration: 1.1 }, 0)

      /* the fall into the empty glass: accelerate + stretch */
      .to('#dropFall', { y: 302, duration: 1.4, ease: 'power2.in' }, 0.4)
      .to('#dropSquash', { scaleY: 1.16, scaleX: 0.9, duration: 1.2, ease: 'power1.in' }, 0.5)

      /* impact: quick squash onto the surface, then sink in */
      .to('#dropSquash', { scaleY: 0.5, scaleX: 1.5, duration: 0.09, ease: 'power2.out' }, 1.8)
      .to('#dropSquash', { scaleY: 0.05, scaleX: 1.8, duration: 0.13, ease: 'power1.in' }, 1.89)
      .to('#dropFall', { autoAlpha: 0, duration: 0.13 }, 1.9)

      /* the drop spreads hard and wide across the floor on impact */
      .fromTo('#puddle', { attr: { rx: 0, ry: 6 }, opacity: 1 },
        { attr: { rx: 88, ry: 18 }, duration: 0.22, ease: 'power3.out', immediateRender: false }, 1.82)
      .to('#puddle', { opacity: 0, duration: 0.45 }, 2.12)

      /* flat fill to 3/4 (no dome), surface sways gently */
      .to('#liquid', { y: 128, duration: 0.8, ease: 'power2.out' }, 1.95)
      .fromTo('#baseShadow', { opacity: 0.15, scale: 0.85 },
        { opacity: 1, scale: 1, svgOrigin: '160 565', duration: 0.8, ease: 'power2.out' }, 1.95)

      /* soft ripples on the settling surface */
      .fromTo('#ripple1', { attr: { rx: 12, ry: 4 }, opacity: 0.6 },
        { attr: { rx: 76, ry: 15 }, opacity: 0, duration: 0.7, ease: 'power1.out', immediateRender: false }, 2.35)
      .fromTo('#ripple2', { attr: { rx: 12, ry: 4 }, opacity: 0.45 },
        { attr: { rx: 76, ry: 15 }, opacity: 0, duration: 0.7, ease: 'power1.out', immediateRender: false }, 2.55)

      /* menu rises onto the matcha */
      .to('.menu-card', { opacity: 1, y: 0, duration: 1.0, ease: 'power2.out' }, 3.0);

    /* crown of droplets bursting up on arcs, contained by the glass */
    var crumbs = gsap.utils.toArray('.crumb');
    crumbs.forEach(function (c, i) {
      var dir = (i % 2 === 0) ? -1 : 1;
      var spread = 24 + i * 8;
      var peak = 26 - (i % 3) * 5;
      var apexX = 120 + dir * spread * 0.6;
      var landX = 120 + dir * spread * 1.0;
      tl.set(c, { opacity: 0.95 }, 1.82);
      if (hasMotion) {
        tl.to(c, {
          duration: 0.4, ease: 'power1.out',
          motionPath: { path: [{ x: 120, y: 320 }, { x: apexX, y: 320 - peak }, { x: landX, y: 326 }], curviness: 1.2 }
        }, 1.82);
      } else {
        tl.fromTo(c, { x: 120, y: 320 }, { x: landX, y: 326, duration: 0.4, ease: 'power1.out' }, 1.82);
      }
      tl.to(c, { opacity: 0, duration: 0.2 }, 2.05);
    });

    /* the galaxy fades in softly as the tonic settles */
    if (isTonic) tl.to('#galaxy', { opacity: 0.85, duration: 0.6, ease: 'power2.out' }, 2.35);

    window.addEventListener('resize', function () { ST.refresh(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
