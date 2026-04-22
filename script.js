(function () {
  const storageKey = "cpt208-theme";
  const btn = document.getElementById("themeBtn");
  const themeBtnEntry = document.getElementById("themeBtnEntry");
  const root = document.documentElement;
  const body = document.body;
  const logoSplash = document.getElementById("logoSplash");
  const enterBtn = document.getElementById("enterBtn");
  const backToWelcomeBtn = document.getElementById("backToWelcomeBtn");
  const entryGate = document.getElementById("entryGate");
  const floatField = document.getElementById("floatField");
  const revealTargets = document.querySelectorAll("section, .card, .persona, .shot, .stat, .panel, .hero-card");
  const tones = ["var(--brand-2)", "var(--brand-3)", "var(--brand-4)", "var(--brand-5)", "var(--brand-6)"];
  const iconKinds = ["star", "bookmark", "folder"];

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function buildFloatingIcons(count) {
    if (!floatField) return;
    for (let i = 0; i < count; i++) {
      const icon = document.createElement("span");
      icon.className = "float-icon " + iconKinds[Math.floor(Math.random() * iconKinds.length)];
      icon.style.setProperty("--x", random(1, 98).toFixed(2));
      icon.style.setProperty("--y", random(2, 97).toFixed(2));
      icon.style.setProperty("--size", random(10, 34).toFixed(2));
      icon.style.setProperty("--alpha", random(0.16, 0.54).toFixed(2));
      icon.style.setProperty("--dur", random(11, 24).toFixed(2) + "s");
      icon.style.setProperty("--delay", (-random(0, 16)).toFixed(2) + "s");
      icon.style.setProperty("--dx1", random(-16, 16).toFixed(1) + "px");
      icon.style.setProperty("--dy1", random(-20, 20).toFixed(1) + "px");
      icon.style.setProperty("--dx2", random(-18, 18).toFixed(1) + "px");
      icon.style.setProperty("--dy2", random(-22, 22).toFixed(1) + "px");
      icon.style.setProperty("--tone", tones[Math.floor(Math.random() * tones.length)]);
      floatField.appendChild(icon);
    }
  }

  function collapseIconsToCenter() {
    if (!entryGate || !floatField) return;
    const gateRect = entryGate.getBoundingClientRect();
    const centerX = gateRect.left + gateRect.width / 2;
    const centerY = gateRect.top + gateRect.height / 2;
    const icons = floatField.querySelectorAll(".float-icon");
    icons.forEach(function (icon) {
      const rect = icon.getBoundingClientRect();
      const iconCenterX = rect.left + rect.width / 2;
      const iconCenterY = rect.top + rect.height / 2;
      icon.style.setProperty("--to-x", (centerX - iconCenterX).toFixed(1) + "px");
      icon.style.setProperty("--to-y", (centerY - iconCenterY).toFixed(1) + "px");
    });
    entryGate.classList.add("is-collapsing");
  }

  function getPreferredTheme() {
    const saved = localStorage.getItem(storageKey);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem(storageKey, theme);
    btn && btn.setAttribute("aria-label", "Toggle theme (current: " + theme + ")");
    themeBtnEntry && themeBtnEntry.setAttribute("aria-label", "Toggle theme (current: " + theme + ")");
  }

  applyTheme(getPreferredTheme());
  buildFloatingIcons(120);

  if (logoSplash) {
    const splashDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 800 : 2500;
    window.setTimeout(function () {
      body.classList.add("splash-done");
      body.classList.remove("is-splashing");
    }, splashDuration);
  }

  enterBtn &&
    enterBtn.addEventListener("click", function () {
      collapseIconsToCenter();
      window.setTimeout(function () {
        body.classList.remove("is-locked");
        body.classList.add("is-entered");
      }, 520);
      window.setTimeout(function () {
        const firstHeading = document.querySelector(".brand h1");
        firstHeading && firstHeading.focus && firstHeading.focus();
      }, 760);
    });

  backToWelcomeBtn &&
    backToWelcomeBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
      body.classList.remove("is-entered");
      body.classList.add("is-locked");
      entryGate && entryGate.classList.remove("is-collapsing");
    });

  if ("IntersectionObserver" in window) {
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
    });
    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  btn &&
    btn.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });

  themeBtnEntry &&
    themeBtnEntry.addEventListener("click", function () {
      const current = root.getAttribute("data-theme") || "dark";
      applyTheme(current === "dark" ? "light" : "dark");
    });
})();
