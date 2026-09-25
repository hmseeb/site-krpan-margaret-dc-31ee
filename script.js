/* ==========================================================================
   Krpan Margaret DC — Valley Village, CA
   Site interactions: mobile nav, sticky header, scroll spy, reveal, form
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      if (nav.classList.contains('is-open')) closeNav();
      else openNav();
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        closeNav();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add('is-stuck');
    else header.classList.remove('is-stuck');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll spy for nav links ---------- */
  var navLinks = nav ? Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]:not(.btn)')) : [];
  var sections = navLinks
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.section-head, .card, .steps li, .stat-list li, .hero-card, .about-copy, .contact-info, .form-card, .services-note, .urgent-note'
  );

  if ('IntersectionObserver' in window) {
    Array.prototype.forEach.call(revealTargets, function (el) { el.classList.add('reveal'); });
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(revealTargets, function (el) { revealObserver.observe(el); });
  }

  /* ---------- Contact form validation ---------- */
  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');

  var RULES = [
    {
      id: 'name',
      test: function (v) { return v.trim().length >= 2; }
    },
    {
      id: 'phone',
      test: function (v) {
        var digits = v.replace(/[^0-9]/g, '');
        return digits.length >= 10 && digits.length <= 15;
      }
    },
    {
      id: 'email',
      optional: true,
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()); }
    },
    {
      id: 'message',
      test: function (v) { return v.trim().length >= 10; }
    },
    {
      id: 'consent',
      checkbox: true,
      test: function (_v, el) { return el.checked; }
    }
  ];

  function fieldOf(rule) { return document.getElementById(rule.id); }
  function errOf(rule) { return document.getElementById('err-' + rule.id); }

  function setFieldState(rule, valid) {
    var el = fieldOf(rule);
    var err = errOf(rule);
    if (!el) return;
    if (valid) {
      el.classList.remove('is-invalid');
      el.removeAttribute('aria-invalid');
      if (err) err.hidden = true;
    } else {
      el.classList.add('is-invalid');
      el.setAttribute('aria-invalid', 'true');
      if (err) err.hidden = false;
    }
  }

  function validateRule(rule) {
    var el = fieldOf(rule);
    if (!el) return true;
    var value = rule.checkbox ? '' : el.value;
    if (rule.optional && !String(value).trim()) return true;
    return rule.test(value, el);
  }

  RULES.forEach(function (rule) {
    var el = fieldOf(rule);
    if (!el) return;
    var evt = rule.checkbox ? 'change' : 'blur';
    el.addEventListener(evt, function () { setFieldState(rule, validateRule(rule)); });
    el.addEventListener('input', function () {
      if (el.classList.contains('is-invalid') && validateRule(rule)) setFieldState(rule, true);
    });
  });

  function showStatus(message, kind) {
    if (!status) return;
    status.textContent = message;
    status.classList.remove('is-ok', 'is-err');
    status.classList.add(kind === 'ok' ? 'is-ok' : 'is-err');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var firstInvalid = null;
    RULES.forEach(function (rule) {
      var valid = validateRule(rule);
      setFieldState(rule, valid);
      if (!valid && !firstInvalid) firstInvalid = fieldOf(rule);
    });

    if (firstInvalid) {
      showStatus('Please correct the highlighted fields and try again.', 'err');
      firstInvalid.focus();
      return;
    }

    var name = document.getElementById('name').value.trim().split(/\s+/)[0];
    var phone = document.getElementById('phone').value.trim();
    var best = document.getElementById('besttime');
    var window_ = best && best.value ? best.value.toLowerCase() : '';

    showStatus(
      'Thank you, ' + name + '. Your request is ready to send. Because this site has no server connection, ' +
      'nothing was transmitted — please keep ' + phone + ' handy' +
      (window_ ? ' during the ' + window_ + ' window' : '') +
      ', and follow up by phone if you have not heard back within one clinic day.',
      'ok'
    );

    form.reset();
    RULES.forEach(function (rule) { setFieldState(rule, true); });
  });
})();
