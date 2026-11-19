/* Ojas Mithra — home
   GSAP + ScrollTrigger + Lenis (vendored in assets/vendor).
   The pinned stage runs one scrubbed timeline that only tweens numbers on
   `S`; render() turns those numbers into bottle / seal transforms each frame.
     S.p     0→1  bottles loop right → left over the seal
     S.hand  0→1  chosen bottle drops to bottom-centre, product title rises
     S.rise  0→1  bottle rises through the title, tilting
     S.after 0→1  stage scrolls away; bottle leaves faster than the page */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);

  var PRODUCTS = [
    {
      slug: 'laundry-liquid', lines: ['Laundry', 'liquid'], deva: 'कपड़े धोना', tint: '#d9e0f0',
      desc: 'Low foam, for buckets and machines alike. Colours remember themselves. Reetha, the soapnut tree, grew in the courtyard of the house Kavita grew up in; her grandmother used it to wash silk saris. Inside: bio-enzymes (citrus, fermented ninety days), soapnut extract, saponified coconut, washing soda, lavender and citrus oils.',
      use: 'Machine wash: 20–30 ml per load. By hand: one small cap in a bucket.', keeps: '12 months'
    },
    {
      slug: 'dishwash', lines: ['Dishwash'], deva: 'बर्तन धोना', tint: '#f3e6b8',
      desc: 'Tough on grease. Gentle on the hands that wash up after every meal. Citrus peels from our kitchen and the neighbours’ rest three months in a clay pot with jaggery and water. Inside: bio-enzymes, saponified coconut oil, cold-pressed lemon, lemongrass, tulsi and aloe vera.',
      use: 'One small squeeze in half a basin of warm water is enough.', keeps: '9 months'
    },
    {
      slug: 'handwash', lines: ['Hand', 'wash'], deva: 'हाथ धोना', tint: '#d8ead5',
      desc: 'Aloe and tulsi, in a quiet base. For hands that have been outside, or inside, or both. The same bio-enzyme base as the dishwash, in a milder concentration. Inside: bio-enzymes, aloe vera from our own plants, tulsi, neem leaf, saponified coconut oil, plant glycerine.',
      use: 'One pump is enough.', keeps: '9 months'
    },
    {
      slug: 'floor-cleaner', lines: ['Floor', 'cleaner'], deva: 'फ़र्श साफ़ करना', tint: '#d5e3cf',
      desc: 'Neem, lemon, eucalyptus. The way a house smells just after the morning mop. The enzymes keep working for an hour after the floor has dried. Inside: bio-enzymes, neem leaf extract, lemon and eucalyptus oils, plant surfactants, citric acid from fermented citrus.',
      use: 'One capful in a bucket of water. Mop and let it air-dry; no rinse.', keeps: '12 months'
    },
    {
      slug: 'toilet-cleaner', lines: ['Toilet', 'cleaner'], deva: 'शौचालय', tint: '#d3e3ef',
      desc: 'Thick enough to cling. Kind to septic tanks and to the people who clean the bathroom. These enzymes ferment four months instead of three. Inside: bio-enzymes, citric acid, plant surfactants, xanthan gum for the cling, eucalyptus and pine needle.',
      use: 'Apply along the rim, leave it ten minutes, then brush.', keeps: '12 months'
    },
    {
      slug: 'vegetables-fruits', lines: ['Fruit & veg', 'wash'], deva: 'फल और सब्ज़ी', tint: '#d6ece0',
      desc: 'For what comes off the cart, the field, or someone’s hands. Fewer ingredients than anything else on the shelf, on purpose. Inside: bio-enzymes, edible-grade plant surfactants, citric acid, cold-pressed lemon, spring water.',
      use: 'Spray, soak for two minutes, rinse with clean water.', keeps: '9 months'
    }
  ];
  var N = PRODUCTS.length;

  /* ── Smooth scroll ──────────────────────────────────────────────────── */
  var lenis = null;
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  function scrollToY(y, dur) {
    if (lenis) lenis.scrollTo(y, { duration: dur || 1.6 });
    else window.scrollTo(0, y);
  }

  /* ── Elements ───────────────────────────────────────────────────────── */
  var bottles = Array.prototype.slice.call(document.querySelectorAll('.hb'));
  var bottleLayer = document.querySelector('.bottles');
  var sealWrap = document.querySelector('.seal-wrap');
  var sealSvg = document.querySelector('.seal-svg');
  var heroFoot = document.querySelector('.hero-foot');
  var header = document.querySelector('.ah-header');

  var S = { intro: 1, p: 0, hand: 0, rise: 0, after: 0 };
  var LOOP = { shift: 0.5 };   // kept apart from S so click tweens never touch the scroll timeline
  var hov = bottles.map(function () { return 0; });
  var hovTarget = -1;
  var far = bottles.map(function () { return false; });
  var sel = 0;
  var vw, vh, bw, bh, mobile, loopW;

  function measure() {
    vw = window.innerWidth;
    vh = window.innerHeight;
    mobile = vw < 760;
    bh = bottles[0].offsetHeight;
    bw = bottles[0].offsetWidth;
    loopW = mobile ? 2.4 : 1.55;   // loop length in viewport widths
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function frac(x) { return x - Math.floor(x); }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  // Where bottle i sits on the loop: right edge leans +45°, centre stands, left edge leans -30°.
  function arc(i) {
    var u = frac(i / N - S.p + LOOP.shift);
    var x = (-(loopW - 1) / 2 + u * loopW) * vw + S.intro * vw * 0.9;
    var n = (x - vw / 2) / (vw / 2);
    var an = Math.min(Math.abs(n), 1.25);
    return {
      cx: x,
      cy: vh * (mobile ? 0.6 : 0.56) + n * vh * 0.035 - an * an * vh * 0.03,
      rot: n >= 0 ? 45 * Math.min(n, 1.2) : 30 * Math.max(n, -1.2),
      s: (mobile ? 1.05 : 1.12) - an * 0.36,
      n: n
    };
  }

  function centred() {
    var best = 0, bestD = 9;
    for (var i = 0; i < N; i++) {
      var d = Math.abs(frac(i / N - 1 + LOOP.shift) - 0.5);
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  function place(el, t, opacity) {
    el.style.transform =
      'translate3d(' + (t.cx - bw / 2).toFixed(1) + 'px,' + (t.cy - bh / 2).toFixed(1) + 'px,0)' +
      ' rotate(' + t.rot.toFixed(2) + 'deg) scale(' + t.s.toFixed(4) + ')';
    el.style.opacity = opacity;
  }

  function render() {
    var h = ease(S.hand), r = S.rise, af = S.after;
    for (var i = 0; i < N; i++) {
      hov[i] += ((i === hovTarget ? 1 : 0) - hov[i]) * 0.12;
      var a = arc(i);
      a.s *= 1 + hov[i] * 0.06;
      a.rot -= hov[i] * 6;
      var isFar = Math.abs(a.n) > 0.78 && S.hand < 0.01;
      if (isFar !== far[i]) { far[i] = isFar; bottles[i].classList.toggle('is-far', isFar); }

      if (i !== sel || S.hand === 0) {
        a.cy += h * vh * 0.1;
        a.s *= 1 - 0.2 * h;
        place(bottles[i], a, clamp(1 - S.hand * 1.7, 0, 1).toFixed(3));
        continue;
      }
      // the chosen bottle: carousel → bottom-centre → up through the title → away
      var s1 = mobile ? 1.0 : 1.04;
      var bottomCy = vh * (mobile ? 0.7 : 0.74) + bh * s1 / 2;
      var riseCy = vh * (mobile ? 0.42 : 0.4);
      var cy = lerp(a.cy, bottomCy, h);
      cy = lerp(cy, riseCy, ease(r)) - af * vh * 0.55;
      place(bottles[i], {
        cx: lerp(a.cx, vw / 2, h),
        cy: cy,
        rot: lerp(a.rot, 0, h) - Math.sin(h * Math.PI) * 10 + 28 * ease(r) + af * 14,
        s: lerp(lerp(a.s, s1, h), mobile ? 0.9 : 0.94, r)
      }, 1);
    }
    sealSvg.style.transform = 'rotate(' + (22 + S.p * 110 - S.hand * 24).toFixed(2) + 'deg) scale(' + (1 + S.intro * 0.12).toFixed(3) + ')';
    sealWrap.style.opacity = clamp(1 - S.hand * 1.8, 0, 1).toFixed(3);
    sealWrap.style.transform = 'translate3d(-50%,' + (ease(S.hand) * 46 + S.intro * 30).toFixed(2) + 'vh,0)';
    heroFoot.style.opacity = clamp(1 - S.hand * 2.5, 0, 1).toFixed(3);
  }

  measure();
  render();
  gsap.ticker.add(render);
  window.addEventListener('resize', measure);

  /* ── Product content ────────────────────────────────────────────────── */
  var titleLns = document.querySelectorAll('.pd-title .ln > span');
  var capDeva = document.querySelector('.pd-cap--l .deva');
  var descEl = document.querySelector('.pd-desc');
  var useEl = document.querySelector('[data-spec="use"]');
  var keepsEl = document.querySelector('[data-spec="keeps"]');
  var linkEl = document.querySelector('[data-spec="link"]');
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.o-tile'));
  var shown = -1;

  function showProduct(j) {
    if (j === shown) return;
    shown = j;
    var d = PRODUCTS[j];
    titleLns[0].textContent = d.lines[0];
    titleLns[1].textContent = d.lines[1] || '';
    titleLns[1].parentNode.style.display = d.lines[1] ? '' : 'none';
    capDeva.textContent = d.deva;
    descEl.textContent = d.desc;
    useEl.textContent = d.use;
    keepsEl.textContent = d.keeps;
    linkEl.href = 'product-' + d.slug + '.html';
    tiles.forEach(function (t) { t.hidden = t.dataset.slug === d.slug; });
  }

  /* ── Master scroll timeline ─────────────────────────────────────────── */
  var A = 3.0;                 // carousel
  var B0 = A, B = 1.4;         // hand-off
  var C0 = B0 + B, C = 1.6;    // rise
  var END = C0 + C;
  var UNIT_VH = 0.72;

  var tl = gsap.timeline({ defaults: { ease: 'none' } });
  tl.to(S, { p: 1, duration: A }, 0)
    .to(S, { hand: 1, duration: B }, B0)
    .fromTo('.pd-title .ln > span', { yPercent: 108 }, { yPercent: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' }, B0 + 0.55)
    .fromTo('.pd-cap', { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }, B0 + 0.9)
    .to(S, { rise: 1, duration: C, ease: 'power1.inOut' }, C0);

  var stageST = ScrollTrigger.create({
    trigger: '.stage',
    start: 'top top',
    end: function () { return '+=' + window.innerHeight * END * UNIT_VH; },
    pin: '.stage-inner',
    scrub: reduce ? true : 0.9,
    animation: tl,
    invalidateOnRefresh: true
  });
  tl.eventCallback('onUpdate', function () {
    var c = centred();
    if (c !== sel) sel = c;
    showProduct(sel);
    bottleLayer.classList.toggle('is-locked', S.hand > 0.02);
  });
  showProduct(0);

  ScrollTrigger.create({
    trigger: '.stage',
    start: 'bottom bottom',
    end: 'bottom top',
    scrub: true,
    onUpdate: function (self) { S.after = self.progress; }
  });

  function timeToScroll(t) {
    return stageST.start + (stageST.end - stageST.start) * (t / END);
  }

  // Header: always there over the carousel, tucks away once reading begins.
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: function (self) {
      var reading = self.scroll() > timeToScroll(C0 + 0.3);
      header.classList.toggle('is-hidden', reading && self.direction === 1);
    }
  });

  /* ── Choosing a bottle ──────────────────────────────────────────────── */
  bottles.forEach(function (el, i) {
    el.addEventListener('click', function () {
      if (S.hand > 0.02) return;
      var target = 0.5 - i / N;
      var delta = frac(target - LOOP.shift + 0.5) - 0.5;   // shortest way round the loop
      gsap.to(LOOP, { shift: LOOP.shift + delta, duration: 1.3, ease: 'power3.inOut', overwrite: true });
      scrollToY(timeToScroll(B0 + B + 0.15), 2.2);
    });
    el.addEventListener('mouseenter', function () { if (S.hand < 0.02) { hovTarget = i; pill.show('discover the product'); } });
    el.addEventListener('mouseleave', function () { hovTarget = -1; pill.hide(); });
  });

  /* ── Cursor pill ────────────────────────────────────────────────────── */
  var pill = (function () {
    var el = document.querySelector('.cursor-pill');
    var label = el.querySelector('span');
    var mx = -200, my = -200, x = -200, y = -200, s = 0.6, on = false;
    if (!finePointer) return { show: function () {}, hide: function () {} };
    window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    gsap.ticker.add(function () {
      x += (mx + 16 - x) * 0.2;
      y += (my + 14 - y) * 0.2;
      s += ((on ? 1 : 0.6) - s) * 0.2;
      el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')';
    });
    return {
      show: function (text) { label.textContent = text; on = true; el.classList.add('is-on'); },
      hide: function () { on = false; el.classList.remove('is-on'); }
    };
  })();

  document.querySelectorAll('.o-tile').forEach(function (t) {
    t.addEventListener('mouseenter', function () { pill.show('discover the product'); });
    t.addEventListener('mouseleave', function () { pill.hide(); });
  });

  /* ── Drag gallery ───────────────────────────────────────────────────── */
  var gallery = document.querySelector('.pd-gallery');
  var track = gallery.querySelector('.g-track');
  if (finePointer) {
    var gx = 0, gt = 0, dragging = false, sx = 0, st = 0, lastX = 0, vel = 0;
    var gMin = function () { return Math.min(0, gallery.clientWidth - track.scrollWidth); };
    var gClamp = function (v) { return clamp(v, gMin(), 0); };
    gallery.addEventListener('pointerdown', function (e) {
      dragging = true; sx = lastX = e.clientX; st = gt; vel = 0;
      gallery.classList.add('is-dragging');
      gallery.setPointerCapture(e.pointerId);
    });
    gallery.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      vel = e.clientX - lastX; lastX = e.clientX;
      gt = gClamp(st + (e.clientX - sx) * 1.15);
    });
    var release = function () {
      if (!dragging) return;
      dragging = false;
      gt = gClamp(gt + vel * 14);
      gallery.classList.remove('is-dragging');
    };
    gallery.addEventListener('pointerup', release);
    gallery.addEventListener('pointercancel', release);
    gallery.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) { e.preventDefault(); gt = gClamp(gt - e.deltaX); }
    }, { passive: false });
    gallery.addEventListener('mouseenter', function () { pill.show('drag'); });
    gallery.addEventListener('mouseleave', function () { pill.hide(); });
    gsap.ticker.add(function () {
      gx += (gt - gx) * 0.09;
      track.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,0,0)';
    });
  }

  /* ── Menu ───────────────────────────────────────────────────────────── */
  var menu = document.querySelector('.menu-overlay');
  var menuBtn = document.querySelector('.ah-menu');
  function setMenu(open) {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    menuBtn.setAttribute('aria-expanded', String(open));
    if (lenis) { if (open) lenis.stop(); else lenis.start(); }
    if (open) menu.querySelector('a').focus(); else menuBtn.focus();
  }
  menuBtn.addEventListener('click', function () { setMenu(true); });
  menu.querySelector('.menu-close').addEventListener('click', function () { setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
  });

  /* ── Loader → intro ─────────────────────────────────────────────────── */
  var loader = document.querySelector('.loader');
  var countOut = loader.querySelector('.loader-count');
  var line = loader.querySelector('.loader-line i');
  var imgs = Array.prototype.slice.call(document.querySelectorAll('.hb img'));
  var assetsReady = Promise.all(
    [document.fonts ? document.fonts.ready : Promise.resolve()].concat(imgs.map(function (img) {
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
      .from('.ah-header > *', { y: -24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, '-=0.5')
      .to(S, { intro: 0, duration: 1.8, ease: 'expo.out' }, '<-0.2');
    if (reduce) intro.progress(1);
  });
})();
