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
})();
