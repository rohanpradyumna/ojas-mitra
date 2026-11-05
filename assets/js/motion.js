/* Ojas Mithra — motion.js
   Spring-physics micro-interactions, scroll-reveal, sticky header.
   Vanilla JS, zero dependencies.
*/
(function () {
  'use strict';

  /* ── 1. Scroll-reveal (IntersectionObserver) ─────────────────────────── */
  var revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

  /* Elements explicitly marked */
  document.querySelectorAll('.fade-up').forEach(function (el) {
    revealObserver.observe(el);
  });

  /* Staggered children: parent with data-stagger attr
     value = per-child delay in ms (default 70) */
  document.querySelectorAll('[data-stagger]').forEach(function (parent) {
    var delay = parseInt(parent.getAttribute('data-stagger'), 10) || 70;
    Array.from(parent.children).forEach(function (child, i) {
      child.classList.add('fade-up');
      child.style.setProperty('--delay', (i * delay) + 'ms');
      revealObserver.observe(child);
    });
  });

  /* ── 2. Sticky / scrolled header ─────────────────────────────────────── */
  var header = document.querySelector('.site-header');
  if (header) {
    var checkScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 56);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  /* ── 3. Floating WhatsApp button ─────────────────────────────────────── */
  var waFloat = document.querySelector('.wa-float');
  if (waFloat) {
    var heroThreshold = window.innerHeight * 0.55;
    var checkWa = function () {
      waFloat.classList.toggle('shown', window.scrollY > heroThreshold);
    };
    window.addEventListener('scroll', checkWa, { passive: true });
    checkWa();
  }

  /* ── 4. Reading progress bar (journal entries) ───────────────────────── */
  var bar = document.querySelector('.reading-progress');
  if (bar) {
    var updateBar = function () {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      if (docH > 0) {
        bar.style.transform = 'scaleX(' + (window.scrollY / docH) + ')';
      }
    };
    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  /* ── 5. Product bottle parallax on detail pages ──────────────────────── */
  var bottleFrame = document.querySelector('.product-detail .bottle-frame');
  if (bottleFrame) {
    var rafId = null;
    var onProductScroll = function () {
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        var rect = bottleFrame.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var shift = (window.innerHeight / 2 - center) * 0.04;
        var img = bottleFrame.querySelector('img, svg');
        if (img) img.style.transform = 'translateY(' + shift + 'px)';
        rafId = null;
      });
    };
    window.addEventListener('scroll', onProductScroll, { passive: true });
  }

})();
