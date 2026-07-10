/* ===== VICURA Matrix? · main.js ===== */
(function () {
  "use strict";

  /* ---------- 语言切换 / Language ---------- */
  const STORE_KEY = "vicura-lang";

  function applyLang(lang) {
    if (!I18N[lang]) lang = "zh";
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (I18N[lang][key] !== undefined) el.innerHTML = I18N[lang][key];
    });
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.classList.toggle("is-active", b.dataset.lang === lang);
    });
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
  }

  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.dataset.lang); });
  });

  // 初始语言：localStorage > 浏览器语言 > 中文
  let init = "zh";
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved && I18N[saved]) init = saved;
    else {
      const br = (navigator.language || "zh").slice(0, 2);
      if (br === "fr") init = "fr"; else if (br === "en") init = "en";
    }
  } catch (e) {}
  applyLang(init);

  /* ---------- 导航滚动态 / Nav scroll ---------- */
  const nav = document.getElementById("nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 30); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- 滚动淡入 / Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    ".section__head, .ccard, .concept__formula, .tl, .phase, .stat, .nutrients, .brand__inner, .contact__cta, .product__price"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- 丝绸光晕装饰层 / Silk decoration ---------- */
  (function initSilkDecor() {
    const noise = document.createElement("div");
    noise.className = "silk-noise";
    document.body.insertBefore(noise, document.body.firstChild);

    const g1 = document.createElement("div");
    g1.className = "silk-glow silk-glow--1";
    document.body.insertBefore(g1, document.body.firstChild);

    const g2 = document.createElement("div");
    g2.className = "silk-glow silk-glow--2";
    document.body.insertBefore(g2, document.body.firstChild);
  })();

  /* ---------- 鼠标光斑跟随 / Cursor glow ---------- */
  (function initCursorGlow() {
    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    let rafId = null;
    let tx = 0, ty = 0, cx = 0, cy = 0;
    let active = false;

    window.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!active) { active = true; glow.classList.add("is-active"); cx = tx; cy = ty; }
      if (!rafId) rafId = requestAnimationFrame(step);
    });
    document.addEventListener("mouseleave", function () {
      active = false; glow.classList.remove("is-active");
    });

    function step() {
      cx += (tx - cx) * 0.15; cy += (ty - cy) * 0.15;
      glow.style.transform = "translate(" + cx + "px, " + cy + "px) translate(-50%, -50%)";
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = null;
      }
    }
  })();

  /* ---------- 数字 count-up ---------- */
  (function initCountUp() {
    const stats = document.querySelectorAll(".stat strong");
    if (!stats.length || !("IntersectionObserver" in window)) return;

    function animate(el) {
      const firstNode = el.childNodes[0];
      if (!firstNode || firstNode.nodeType !== 3) return;
      const target = parseFloat(firstNode.nodeValue.trim());
      if (isNaN(target)) return;

      const dur = 1400;
      const start = performance.now();
      const decimals = (target % 1 === 0) ? 0 : 1;

      function tick(now) {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const cur = (target * eased).toFixed(decimals);
        firstNode.nodeValue = cur;
        if (p < 1) requestAnimationFrame(tick);
        else firstNode.nodeValue = String(target);
      }
      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 导航 active 段（滚动时高亮当前 section） ---------- */
  (function initNavActive() {
    const links = document.querySelectorAll(".nav__links a[href^='#']");
    if (!links.length) return;
    const map = {};
    links.forEach(function (a) {
      const id = a.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) map[id] = a;
    });

    function setActive(id) {
      links.forEach(function (a) { a.classList.remove("is-active"); });
      if (map[id]) map[id].classList.add("is-active");
    }

    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    Object.keys(map).forEach(function (id) {
      const sec = document.getElementById(id);
      if (sec) obs.observe(sec);
    });
  })();
})();
