/* An toàn thông tin mùa lễ hội · Security Awareness 2026 */
(function () {
  'use strict';

  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---- Level bar: scroll progress + runner ---- */
  var fill = document.querySelector('.levelbar__fill');
  var runner = document.querySelector('.levelbar__runner');
  var pct = document.querySelector('.levelbar__pct b');
  var raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(function () {
      raf = null;
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fill) fill.style.width = (p * 100) + '%';
      if (runner) runner.style.left = 'calc(28px + ' + (p * 100) + '% - ' + (p * 92) + 'px)';
      if (pct) pct.textContent = Math.round(p * 100) + '%';
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Progressive sections ---- */
  var ORDER = ['phan-1', 'phan-2', 'phan-3', 'phan-4', 'quy-tac'];
  function unlockTo(id, scroll) {
    var idx = ORDER.indexOf(id);
    if (idx < 0) return;
    for (var i = 0; i <= idx; i++) {
      var sec = document.getElementById(ORDER[i]);
      if (sec && sec.hasAttribute('hidden')) {
        sec.removeAttribute('hidden'); sec.classList.remove('is-locked'); sec.classList.add('is-unlocking');
      }
      var c = document.querySelector('.next[data-next="' + ORDER[i] + '"]');
      if (c) c.classList.add('is-used');
    }
    if (scroll) {
      var target = document.getElementById(id);
      requestAnimationFrame(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    }
    onScroll();
  }
  document.querySelectorAll('.next').forEach(function (c) {
    c.querySelector('.next__btn').addEventListener('click', function () { unlockTo(c.getAttribute('data-next'), true); });
  });
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href').slice(1);
    if (ORDER.indexOf(id) < 0) return;
    a.addEventListener('click', function (e) { e.preventDefault(); unlockTo(id, true); history.replaceState(null, '', '#' + id); });
  });
  if (location.hash && ORDER.indexOf(location.hash.slice(1)) >= 0) unlockTo(location.hash.slice(1), true);

  /* ---- Active nav ---- */
  var links = [].slice.call(document.querySelectorAll('.topnav a'));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window && targets.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---- Reveal on scroll ---- */
  var rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window) {
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { rio.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Typing effect for mascot bubbles ---- */
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var boxes = [].slice.call(document.querySelectorAll('.bubble__box'));
  if (!reduce && 'IntersectionObserver' in window) {
    boxes.forEach(function (box) {
      var paras = [].slice.call(box.querySelectorAll('p'));
      if (!paras.length) return;
      box.classList.add('is-typing');
      paras.forEach(function (p) { p.setAttribute('data-html', p.innerHTML); p.innerHTML = ''; p.style.visibility = 'hidden'; });
    });
    var chats = [].slice.call(document.querySelectorAll('.chat'));
    chats.forEach(function (c) {
      c.querySelectorAll('.bubble').forEach(function (b, i) { if (i > 0) b.style.display = 'none'; });
    });
    var tio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        tio.unobserve(e.target);
        if (e.target.classList.contains('chat')) {
          var list = [].slice.call(e.target.querySelectorAll('.bubble'));
          (function run(i) {
            if (i >= list.length) return;
            list[i].style.display = '';
            typeBox(list[i].querySelector('.bubble__box'), function () { setTimeout(function () { run(i + 1); }, 350); }, i > 0);
          })(0);
        } else {
          typeBox(e.target, null, false);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    chats.forEach(function (c) { tio.observe(c); });
    boxes.forEach(function (b) { if (!b.closest('.chat')) tio.observe(b); });
  }
  function typeBox(box, onDone, withDots) {
    var paras = [].slice.call(box.querySelectorAll('p'));
    var i = 0, timer = null, done = false;
    function finish() {
      if (done) return;
      done = true; clearTimeout(timer);
      box.classList.remove('is-dots');
      box.style.minHeight = ''; box.style.width = '';
      paras.forEach(function (p) { p.innerHTML = p.getAttribute('data-html'); p.style.visibility = ''; p.classList.remove('is-cur'); });
      box.classList.remove('is-typing'); box.classList.remove('is-cursor');
      if (onDone) onDone();
    }
    box.addEventListener('click', finish);
    function next() {
      if (i >= paras.length) { finish(); return; }
      var p = paras[i++];
      var tokens = p.getAttribute('data-html').match(/<[^>]+>|&[a-z#0-9]+;|[\s\S]/g) || [];
      var out = '', k = 0;
      p.style.visibility = '';
      box.classList.add('is-cursor');
      paras.forEach(function (q) { q.classList.remove('is-cur'); });
      p.classList.add('is-cur');
      (function step() {
        if (done) return;
        var burst = 2;
        while (burst-- > 0 && k < tokens.length) {
          out += tokens[k++];
          if (tokens[k - 1].charAt(0) === '<') burst++;
        }
        p.innerHTML = out;
        if (k < tokens.length) {
          var ch = tokens[k - 1];
          var pause = /[.!?…]/.test(ch) ? 220 : /[,;:]/.test(ch) ? 90 : 14;
          timer = setTimeout(step, pause);
        } else {
          timer = setTimeout(next, 260);
        }
      })();
    }
    function start() {
      box.style.width = ''; box.style.minHeight = '';
      paras.forEach(function (q) { q.innerHTML = q.getAttribute('data-html'); q.style.visibility = 'hidden'; });
      var hgt = box.offsetHeight, wid = box.offsetWidth;
      paras.forEach(function (q) { q.innerHTML = ''; });
      if (hgt) box.style.minHeight = hgt + 'px';
      next();
    }
    if (withDots) {
      box.classList.add('is-dots');
      timer = setTimeout(function () { if (done) return; box.classList.remove('is-dots'); start(); }, 900);
    } else {
      start();
    }
  }

  /* ---- Glossary tooltips ---- */
  var tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip);
  var tipFor = null, tipTimer = null;
  function showTip(el) {
    tipFor = el; clearTimeout(tipTimer);
    tip.innerHTML = '<b></b><span></span>';
    tip.querySelector('b').textContent = el.textContent;
    tip.querySelector('span').textContent = el.getAttribute('data-def');
    tip.style.left = '0px'; tip.style.top = '0px';
    tip.classList.add('is-show');
    var r = el.getBoundingClientRect();
    var w = tip.offsetWidth, vw = document.documentElement.clientWidth;
    var left = r.left + r.width / 2 - w / 2;
    left = Math.max(12, Math.min(left, vw - w - 12));
    tip.style.left = (left + window.scrollX) + 'px';
    tip.style.top = (r.bottom + window.scrollY + 10) + 'px';
    tip.style.setProperty('--tip-x', Math.max(14, Math.min(w - 30, r.left + r.width / 2 - left - 8)) + 'px');
    document.querySelectorAll('.term.is-on').forEach(function (t) { t.classList.remove('is-on'); });
    el.classList.add('is-on');
  }
  function hideTip() {
    tipTimer = setTimeout(function () { tip.classList.remove('is-show'); if (tipFor) tipFor.classList.remove('is-on'); tipFor = null; }, 120);
  }
  document.querySelectorAll('.term').forEach(function (el) {
    el.addEventListener('mouseenter', function () { showTip(el); });
    el.addEventListener('mouseleave', hideTip);
    el.addEventListener('focus', function () { showTip(el); });
    el.addEventListener('blur', hideTip);
    el.addEventListener('click', function (e) { e.preventDefault(); if (tipFor === el && tip.classList.contains('is-show')) { hideTip(); } else { showTip(el); } });
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.term')) { tip.classList.remove('is-show'); if (tipFor) { tipFor.classList.remove('is-on'); tipFor = null; } } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTip(); });
  window.addEventListener('scroll', function () { if (tipFor) showTip(tipFor); }, { passive: true });
  window.addEventListener('resize', function () { document.querySelectorAll('.bubble__box').forEach(function (b) { if (!b.classList.contains('is-typing')) { b.style.width = ''; b.style.minHeight = ''; } }); });

  /* ---- Checklists (persisted) ---- */
  document.querySelectorAll('[data-checklist]').forEach(function (list) {
    var key = 'sa2026:' + list.getAttribute('data-checklist');
    var boxes = [].slice.call(list.querySelectorAll('input[type=checkbox]'));
    var saved = store.get(key, {});
    var counter = document.querySelector('[data-counter="' + list.getAttribute('data-checklist') + '"]');
    var bar = document.querySelector('[data-bar="' + list.getAttribute('data-checklist') + '"]');
    var doneWrap = list.closest('[data-done-wrap]');
    function update() {
      var n = boxes.filter(function (b) { return b.checked; }).length;
      if (counter) counter.textContent = n + '/' + boxes.length;
      if (bar) bar.style.width = (n / boxes.length * 100) + '%';
      if (doneWrap) doneWrap.classList.toggle('is-done', n === boxes.length);
      var state = {};
      boxes.forEach(function (b, i) { state[i] = b.checked; });
      store.set(key, state);
    }
    boxes.forEach(function (b, i) {
      if (saved[i]) b.checked = true;
      b.addEventListener('change', update);
    });
    update();
  });

  /* ---- Lures seen counter ---- */
  var lures = [].slice.call(document.querySelectorAll('.lure'));
  var lureCounter = document.querySelector('[data-counter="lures"]');
  var seen = {};
  function lureUpdate() {
    if (lureCounter) lureCounter.textContent = Object.keys(seen).length + '/' + lures.length;
  }
  lures.forEach(function (d, i) {
    d.addEventListener('toggle', function () { if (d.open) { seen[i] = true; lureUpdate(); } });
  });
  lureUpdate();

  /* ---- Wifi picker ---- */
  var wifi = document.querySelector('.wifi');
  if (wifi) {
    wifi.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        wifi.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true');
        wifi.classList.add('is-picked');
      });
    });
  }

  /* ---- Copy email ---- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var label = btn.querySelector('span');
    var orig = label ? label.textContent : '';
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var done = function () {
        if (label) label.textContent = 'Đã sao chép';
        setTimeout(function () { if (label) label.textContent = orig; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  });
})();
