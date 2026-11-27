/* Sterio Phone website — progressive enhancement only. The site works without JS. */
(function () {
  'use strict';

  // Mobile navigation
  var btn = document.querySelector('.menu-btn');
  var links = document.getElementById('nav-links');
  if (btn && links) {
    var setOpen = function (open) {
      links.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', function () { setOpen(!links.classList.contains('open')); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.nav')) setOpen(false);
    });
  }

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Tabs (ARIA tabs pattern with arrow-key support)
  document.querySelectorAll('[data-tabs]').forEach(function (root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (t) { return document.getElementById(t.getAttribute('aria-controls')); });
    var select = function (i, focus) {
      tabs.forEach(function (t, j) {
        var on = i === j;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (panels[j]) panels[j].hidden = !on;
      });
      if (focus) tabs[i].focus();
    };
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i, false); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
  });

  // FAQ: open the question named in the URL hash, and add "expand all"
  var faq = document.querySelector('.faq');
  if (faq) {
    var openHash = function () {
      var id = location.hash.slice(1);
      var el = id && document.getElementById(id);
      if (el && el.tagName === 'DETAILS') { el.open = true; el.scrollIntoView({ block: 'center' }); }
    };
    openHash();
    window.addEventListener('hashchange', openHash);
    var toggle = document.getElementById('faq-toggle');
    if (toggle) {
      toggle.hidden = false;
      toggle.addEventListener('click', function () {
        var all = faq.querySelectorAll('details');
        var anyClosed = Array.prototype.some.call(all, function (d) { return !d.open; });
        all.forEach(function (d) { d.open = anyClosed; });
        toggle.textContent = anyClosed ? 'Collapse all' : 'Expand all';
      });
    }
  }

  // FAQ filter
  var search = document.getElementById('faq-search');
  if (search) {
    search.hidden = false;
    var empty = document.getElementById('faq-empty');
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      var shown = 0;
      document.querySelectorAll('.faq details').forEach(function (d) {
        var hit = !q || d.textContent.toLowerCase().indexOf(q) !== -1;
        d.hidden = !hit;
        if (hit) shown++;
      });
      document.querySelectorAll('.faq-cat').forEach(function (h) {
        var next = h.nextElementSibling, any = false;
        while (next && !next.classList.contains('faq-cat')) {
          if (next.tagName === 'DETAILS' && !next.hidden) any = true;
          next = next.nextElementSibling;
        }
        h.hidden = !any;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  }

  // Copy-to-clipboard for the contact email
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy');
      var done = function () {
        var old = b.textContent; b.textContent = 'Copied';
        setTimeout(function () { b.textContent = old; }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {});
      }
    });
  });

  // Video chapters
  document.querySelectorAll('[data-seek]').forEach(function (b) {
    var vid = document.getElementById(b.getAttribute('data-for') || 'guide-video');
    if (!vid) return;
    b.addEventListener('click', function () {
      vid.currentTime = Number(b.getAttribute('data-seek'));
      var p = vid.play(); if (p && p.catch) p.catch(function () {});
      vid.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  });

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
