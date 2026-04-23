/**
 * Shared floating bookmark/star/folder shapes (same as welcome page).
 * Exposes window.cpt208BuildFloatIcons(container, count).
 */
(function (global) {
  const tones = [
    "var(--brand-2)",
    "var(--brand-3)",
    "var(--brand-4)",
    "var(--brand-5)",
    "var(--brand-6)"
  ];
  const iconKinds = ["star", "bookmark", "folder"];

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function buildFloatingIconsFor(container, count) {
    if (!container) return;
    for (var i = 0; i < count; i++) {
      var icon = document.createElement("span");
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
      container.appendChild(icon);
    }
  }

  global.cpt208BuildFloatIcons = buildFloatingIconsFor;
})(typeof window !== "undefined" ? window : this);
