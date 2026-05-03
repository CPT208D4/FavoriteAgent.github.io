(function () {
    const storageKey = "cpt208-theme";
    const searchParams = new URLSearchParams(window.location.search);
    const hashId = window.location.hash.replace(/^#/, "");
    const hashTarget = hashId ? document.getElementById(hashId) : null;
    const shouldOpenHomeDirectly =
      searchParams.get("home") === "1" || window.location.hash === "#content" || !!hashTarget;
    const btn = document.getElementById("themeBtn");
    const themeBtnEntry = document.getElementById("themeBtnEntry");
    const root = document.documentElement;
    const body = document.body;
    const enterBtn = document.getElementById("enterBtn");
    const backToWelcomeBtn = document.getElementById("backToWelcomeBtn");
    const entryGate = document.getElementById("entryGate");
    const floatField = document.getElementById("floatField");
    const siteFloatField = document.getElementById("siteFloatField");
    const revealTargets = document.querySelectorAll("section, .card, .persona, .shot, .stat, .panel, .hero-card");
    const buildFloat =
      typeof window.cpt208BuildFloatIcons === "function" ? window.cpt208BuildFloatIcons : function () {}

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
    buildFloat(floatField, 120);
    buildFloat(siteFloatField, 90);

    if (shouldOpenHomeDirectly) {
      body.classList.add("is-entered");
      body.classList.remove("is-locked");
      entryGate && entryGate.classList.remove("is-collapsing");
    }

    if (shouldOpenHomeDirectly && hashTarget) {
      window.requestAnimationFrame(function () {
        hashTarget.scrollIntoView({ block: "start" });
      });
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

    const backToTopBtn = document.getElementById("backToTopBtn");
    const motivationSection = document.getElementById("motivation-research");
    if (backToTopBtn) {
      let scrollTicking = false;

      function updateBackToTopVisibility() {
        scrollTicking = false;
        const y = window.scrollY || window.pageYOffset || 0;
        let show = false;
        if (body.classList.contains("is-entered") && motivationSection) {
          const headerLead = 88;
          const sectionTopDoc =
            motivationSection.getBoundingClientRect().top + y;
          show = y >= sectionTopDoc - headerLead;
        }
        backToTopBtn.classList.toggle("is-visible", show);
        backToTopBtn.setAttribute("aria-hidden", show ? "false" : "true");
        backToTopBtn.tabIndex = show ? 0 : -1;
      }

      function onScrollBackToTop() {
        if (!scrollTicking) {
          scrollTicking = true;
          window.requestAnimationFrame(updateBackToTopVisibility);
        }
      }

      window.addEventListener("scroll", onScrollBackToTop, { passive: true });
      window.addEventListener("resize", onScrollBackToTop, { passive: true });
      updateBackToTopVisibility();
      if (document.readyState === "complete") {
        window.requestAnimationFrame(updateBackToTopVisibility);
      } else {
        window.addEventListener("load", updateBackToTopVisibility);
      }

      backToTopBtn.addEventListener("click", function () {
        const prefersReduced =
          window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
        const brandHeading = document.querySelector(".brand h1");
        window.setTimeout(function () {
          brandHeading && brandHeading.focus && brandHeading.focus({ preventScroll: true });
        }, prefersReduced ? 0 : 400);
      });
    }
  })();
