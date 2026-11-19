/* Ojas Mithra — home scroll experience
   GSAP + ScrollTrigger + Lenis (vendored in assets/vendor).
   Every bottle's transform is derived from a few numbers on `S`;
   the scroll timeline only tweens those numbers, and render() turns
   them into transforms each frame. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  /* ── Smooth scroll ──────────────────────────────────────────────────── */
  var lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  /* ── Bottle geometry ────────────────────────────────────────────────── */
  var bottles = Array.prototype.slice.call(document.querySelectorAll('.hb'));
  var HERO = bottles.length - 1;            // last bottle travels on into Discover
  var heroImgs = bottles[HERO].querySelectorAll('img');
  var S = { intro: 1, p: 0, hand: 0, rock: 0 };
  var vw, vh, bw, bh, gap, startShift, mobile;

  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    mobile = vw < 760;
    bh = bottles[0].offsetHeight;
    bw = bottles[0].offsetWidth;
    gap = mobile ? Math.max(vw * 0.46, bw * 1.5) : Math.max(vw * 0.24, bw * 1.45);
    // first bottle starts right of centre so the headline reads clearly
    startShift = (mobile ? 0.12 : 0.2) * vw / gap;
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Position on the carousel arc: right edge tilts +45°, centre upright, left edge -30°.
  function onArc(cx) {
    var n = (cx - vw / 2) / (vw / 2);
    var rot = n >= 0 ? 45 * clamp(n, 0, 1.25) : 30 * clamp(n, -1.25, 0);
    var cy = vh * (mobile ? 0.66 : 0.58) + n * n * vh * 0.07;
    var s = 1 - clamp(Math.abs(n), 0, 1.25) * 0.14;
    return { cx: cx, cy: cy, rot: rot, s: s };
  }

  function place(el, t, opacity) {
    el.style.transform =
      'translate3d(' + (t.cx - bw / 2).toFixed(2) + 'px,' + (t.cy - bh / 2).toFixed(2) + 'px,0)' +
      ' rotate(' + t.rot.toFixed(2) + 'deg) scale(' + t.s.toFixed(4) + ')';
    if (opacity !== undefined) el.style.opacity = opacity;
  }

  function render() {
    var travel = (HERO + startShift);
    for (var i = 0; i < bottles.length; i++) {
      var slot = i + startShift - S.p * travel;
      var cx = vw / 2 + slot * gap + S.intro * vw * 0.95;
      if (i !== HERO) {
        // the others keep rolling off to the left as the hero bottle lifts away
        cx -= S.hand * gap * 1.7;
        place(bottles[i], onArc(cx), clamp(1 - S.hand * 1.4, 0, 1).toFixed(3));
      } else {
        var a = onArc(cx);
        var h = S.hand;
        var target = {
          cx: vw / 2,
          cy: vh * (mobile ? 0.43 : 0.565),
          s: mobile ? 0.9 : 0.94
        };
        place(bottles[i], {
          cx: lerp(a.cx, target.cx, h),
          cy: lerp(a.cy, target.cy, h) + Math.sin(h * Math.PI) * vh * 0.06,
          rot: lerp(a.rot, 0, h) - 24 * Math.sin(h * Math.PI) + S.rock,
          s: lerp(a.s, target.s, h)
        });
      }
    }
  }

  measure();
  render();
  gsap.ticker.add(render);
  window.addEventListener('resize', function () { measure(); });

  /* ── Master scroll timeline ─────────────────────────────────────────── */
  var items = Array.prototype.slice.call(document.querySelectorAll('.d-item'));
  var glow = document.querySelector('.d-glow');
  var countEl = document.querySelector('.d-count b');
  var P1 = 2.6;                 // hero carousel
  var T2 = P1, H2 = 1.5;        // hand-off into Discover
  var T3 = T2 + H2 + 0.3;       // first product settled
  var STEP = 1;                 // per product
  var END = T3 + items.length * STEP;
  var UNIT_VH = 0.72;           // scroll distance per timeline unit, in viewport heights

  var tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.to(S, { p: 1, duration: P1 }, 0)
    .to('.hero-layer', { yPercent: -8, autoAlpha: 0, duration: 0.7, ease: 'power1.in' }, P1 - 0.75)
    .to(S, { hand: 1, duration: H2, ease: 'power2.inOut' }, T2)
    .to('.discover', {
      clipPath: 'inset(0% 0% 0% 0% round 0vw 0vw 0 0)',
      duration: 1.1, ease: 'power3.inOut'
    }, T2 + 0.1)
    .from('.d-head > *', { y: 24, autoAlpha: 0, stagger: 0.12, duration: 0.5, ease: 'power2.out' }, T2 + 0.9)
    .set(glow, { '--glow': items[0].dataset.accent }, T2);

  items.forEach(function (item, i) {
    var t = T3 + i * STEP;
    var inAt = i === 0 ? T2 + 1.1 : t - STEP + 0.62;
    tl.fromTo(item, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.32, ease: 'power2.out' }, inAt);
    if (i > 0) {
      var swap = t - STEP + 0.4;
      tl.to(items[i - 1], { autoAlpha: 0, y: -28, duration: 0.26, ease: 'power2.in' }, swap - 0.3)
        .to(S, { rock: -11, duration: 0.18, ease: 'power2.out' }, swap - 0.22)
        .to(heroImgs[i - 1], { opacity: 0, duration: 0.12 }, swap - 0.06)
        .to(heroImgs[i], { opacity: 1, duration: 0.12 }, swap - 0.06)
        .to(S, { rock: 7, duration: 0.2, ease: 'power1.inOut' }, swap - 0.04)
        .to(S, { rock: 0, duration: 0.26, ease: 'back.out(2)' }, swap + 0.16)
        .to(glow, { '--glow': item.dataset.accent, duration: 0.4 }, swap - 0.2);
    }
  });
  tl.fromTo('.d-bar i', { scaleX: 1 / items.length }, { scaleX: 1, duration: (items.length - 1) * STEP }, T3 - STEP + 0.4);
  tl.to({}, { duration: 0.01 }, END);

  var header = document.querySelector('.site-header');
  var lastIdx = -1;
  ScrollTrigger.create({
    trigger: '.stage',
    start: 'top top',
    end: function () { return '+=' + window.innerHeight * END * UNIT_VH; },
    pin: '.stage-inner',
    scrub: reduce ? true : 0.8,
    animation: tl,
    invalidateOnRefresh: true
  });
  tl.eventCallback('onUpdate', function () {
    var t = tl.time();
    var idx = clamp(Math.floor((t - (T3 - STEP + 0.34)) / STEP), 0, items.length - 1);
    if (idx !== lastIdx) {
      lastIdx = idx;
      countEl.textContent = String(idx + 1).padStart(2, '0');
    }
    header.classList.toggle('on-dark', t > T2 + 0.75 && tl.progress() < 0.999);
  });

  /* ── Gallery: vertical scroll drives a horizontal track ─────────────── */
  var track = document.querySelector('.g-track');
  function trackDistance() { return Math.max(0, track.scrollWidth - document.documentElement.clientWidth); }
  var galleryTween = gsap.to(track, {
    x: function () { return -trackDistance(); },
    ease: 'none',
    scrollTrigger: {
      trigger: '.gallery',
      start: 'top top',
      end: function () { return '+=' + trackDistance(); },
      pin: true,
      scrub: reduce ? true : 0.8,
      invalidateOnRefresh: true
    }
  });
  document.querySelectorAll('.g-frame img').forEach(function (img) {
    gsap.fromTo(img, { scale: 1.1 }, {
      scale: 1, ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.g-card'),
        containerAnimation: galleryTween,
        start: 'left right',
        end: 'left 35%',
        scrub: true
      }
    });
  });

  /* ── Loader → intro ─────────────────────────────────────────────────── */
  var loader = document.querySelector('.loader');
  var countOut = loader.querySelector('.loader-count');
  var line = loader.querySelector('.loader-line i');
  var stageImgs = Array.prototype.slice.call(document.querySelectorAll('.hb img'));
  var assetsReady = Promise.all(
    [document.fonts ? document.fonts.ready : Promise.resolve()].concat(stageImgs.map(function (img) {
      return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
    }))
  );
  var counter = { v: 0 };
  var counting = gsap.to(counter, {
    v: 100,
    duration: reduce ? 0.3 : 1.9,
    ease: 'power2.inOut',
    onUpdate: function () {
      countOut.textContent = String(Math.round(counter.v)).padStart(3, '0');
      line.style.transform = 'scaleX(' + (counter.v / 100) + ')';
    }
  });

  Promise.all([assetsReady, counting.then()]).then(function () {
    ScrollTrigger.refresh();
    var intro = gsap.timeline({
      onComplete: function () {
        document.documentElement.classList.remove('is-loading');
        if (lenis) lenis.start();
        loader.style.display = 'none';
      }
    });
    intro
      .to('.loader-inner, .loader-foot', { y: -40, autoAlpha: 0, duration: 0.55, ease: 'power3.in' })
      .to(loader, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.05, ease: 'expo.inOut' }, '-=0.15')
      .from('.hero-line > span', { yPercent: 110, duration: 1.15, ease: 'expo.out', stagger: 0.09 }, '-=0.6')
      .from('.hero-meta, .hero-foot', { autoAlpha: 0, y: 16, duration: 0.8, ease: 'power2.out', stagger: 0.1 }, '<0.2')
      .to(S, { intro: 0, duration: 1.7, ease: 'expo.out' }, '<-0.25');
    if (reduce) intro.progress(1);
  });
})();
