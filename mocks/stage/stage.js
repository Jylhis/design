/* mocks/stage/stage.js — scaler for the fixed-canvas letterbox stage.
 *
 * Fits every `.mock-stage` on the page: reads the authored canvas size from
 * `data-canvas="WxH"` (default 1920x1080), computes the fit-to-viewport
 * scale, and writes the custom properties stage.css consumes
 * (--mock-canvas-w/h, --mock-stage-scale, --mock-stage-w/h).
 *
 * On narrow portrait viewports it switches the stage to pan mode
 * (data-pan="1"): fit to height, scroll horizontally, and show a
 * dismissible "designed for desktop" banner (dismissal persists in
 * localStorage). Works with React-rendered stages too — a MutationObserver
 * re-fits whenever a .mock-stage appears.
 *
 * No dependencies. Load with <script defer src=".../stage.js"></script>,
 * or call window.MockStage.fitAll() yourself.
 */
(() => {
  "use strict";

  const BANNER_KEY = "mock-stage.panBannerDismissed";
  const PAN_MAX_WIDTH = 700; // px — below this (and portrait) we pan

  const bannerDismissed = () => {
    try {
      return localStorage.getItem(BANNER_KEY) === "1";
    } catch {
      return false;
    }
  };

  const dismissBanner = (stage) => {
    try {
      localStorage.setItem(BANNER_KEY, "1");
    } catch {
      /* storage unavailable — dismiss for this page view only */
    }
    const b = stage.querySelector(".mock-stage__banner");
    if (b) b.remove();
  };

  const ensureBanner = (stage, wanted) => {
    let banner = stage.querySelector(".mock-stage__banner");
    if (!wanted || bannerDismissed()) {
      if (banner) banner.remove();
      return;
    }
    if (banner) return;
    banner = document.createElement("button");
    banner.type = "button";
    banner.className = "mock-stage__banner";
    banner.setAttribute("aria-label", "Dismiss desktop-only notice");
    const glyph = document.createElement("span");
    glyph.setAttribute("aria-hidden", "true");
    glyph.textContent = "›";
    const text = document.createElement("span");
    text.textContent = "Designed for desktop · scroll to pan";
    const x = document.createElement("span");
    x.className = "mock-stage__banner-x";
    x.setAttribute("aria-hidden", "true");
    x.textContent = "✕";
    banner.append(glyph, text, x);
    banner.addEventListener("click", () => dismissBanner(stage));
    stage.append(banner);
  };

  const fit = (stage) => {
    const m = /^(\d+)x(\d+)$/.exec(stage.dataset.canvas || "");
    const cw = m ? Number(m[1]) : 1920;
    const ch = m ? Number(m[2]) : 1080;
    const vw = stage.clientWidth || window.innerWidth;
    const vh = stage.clientHeight || window.innerHeight;
    const pan = vw < PAN_MAX_WIDTH && vh > vw;
    const scale = pan ? vh / ch : Math.min(vw / cw, vh / ch);

    stage.style.setProperty("--mock-canvas-w", `${cw}px`);
    stage.style.setProperty("--mock-canvas-h", `${ch}px`);
    stage.style.setProperty("--mock-stage-scale", String(scale));
    stage.style.setProperty("--mock-stage-w", `${Math.round(cw * scale)}px`);
    stage.style.setProperty("--mock-stage-h", `${Math.round(ch * scale)}px`);
    if (pan) stage.setAttribute("data-pan", "1");
    else stage.removeAttribute("data-pan");
    ensureBanner(stage, pan);
  };

  const fitAll = () => {
    document.querySelectorAll(".mock-stage").forEach(fit);
  };

  let raf = 0;
  const schedule = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(fitAll);
  };

  window.addEventListener("resize", schedule);
  window.addEventListener("orientationchange", schedule);

  const start = () => {
    fitAll();
    // React (and friends) mount stages after this script runs — re-fit
    // whenever the DOM gains one.
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        for (const n of r.addedNodes) {
          if (n.nodeType !== 1) continue;
          if (n.classList?.contains("mock-stage") || n.querySelector?.(".mock-stage")) {
            schedule();
            return;
          }
        }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  window.MockStage = { fit, fitAll };
})();
