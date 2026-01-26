import createCircleAnimation from "./animation";

/**
 * Initializes the circle animation when the circle container becomes visible.
 *
 * Key behaviors:
 * - Uses IntersectionObserver instead of scroll events.
 * - Respects prefers-reduced-motion by skipping animation.
 * - If the screen is small (≤ 550px), this module does **nothing**:
 *   no animation, no arrangement, no reflow.
 * - On resize, reflows on large screens, but becomes a no-op on small screens.
 */
export default function initCircleAnimationOnView(
  opts?: { onComplete?: () => void }
): { startAnimation: () => void} {
  const controller = createCircleAnimation(opts);
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const isSmallScreen = window.matchMedia("(max-width: 550px)");

  const startAnimation = () => {
    // if (isSmallScreen.matches) return; // no-op on small screens
    controller.start(prefersReducedMotion.matches);
  };

  // --- Auto-play on view (large screens only) ---
  let hasAutoPlayed = false;
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      if (/*isSmallScreen.matches ||*/ hasAutoPlayed) return;
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
          hasAutoPlayed = true;
          startAnimation();
          intersectionObserver.disconnect();
          break;
        }
      }
    },
    { threshold: [0.9] }
  );

  const container = document.getElementById("circle-container");
  if (container /*&& !isSmallScreen.matches*/) {
    intersectionObserver.observe(container);
  }

  // --- Resize handling (large screens only) ---
  let reflowRafId: number | null = null;
  const requestReflow = () => {
    // on small screens do not arrange / do nothing.
    // if (isSmallScreen.matches) return;
    if (reflowRafId !== null) return;
    reflowRafId = requestAnimationFrame(() => {
      reflowRafId = null;
      controller.reflow();
    });
  };

  let resizeObserver: ResizeObserver | null = null;
  const attachResizeObservers = () => {
    if (!container /*|| isSmallScreen.matches*/) return;
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => requestReflow());
      resizeObserver.observe(container);
    }
    window.addEventListener("resize", requestReflow, { passive: true });
    window.addEventListener("orientationchange", requestReflow, { passive: true });
  };

  const detachResizeObservers = () => {
    if (reflowRafId !== null) {
      cancelAnimationFrame(reflowRafId);
      reflowRafId = null;
    }
    resizeObserver?.disconnect();
    resizeObserver = null;
    window.removeEventListener("resize", requestReflow);
    window.removeEventListener("orientationchange", requestReflow);
  };

  // Attach once at init (only if large screen).
  attachResizeObservers();

  // --- Media-query switching (large <-> small) ---
  const handleSmallScreenChange = () => {
    // if (isSmallScreen.matches) {
    //   // Switching to small: stop everything and remove circle layout.
    //   controller.stop();
    //   intersectionObserver.disconnect();
    //   detachResizeObservers();
    //   clearCircleInlineStyles();
    //   return;
    // }

    // Switching back to large: re-enable resize handling and lay out.
    attachResizeObservers();
    controller.reflow();

    // Re-arm auto-play only if it hasn't played yet.
    if (!hasAutoPlayed && container) {
      intersectionObserver.observe(container);
    }
  };

  const clearCircleInlineStyles = () => {
    // When switching to the small-screen layout we don't want stale inline
    // positioning from the large-screen circle layout.
    const elements = document.querySelectorAll<HTMLElement>(".circle-element");
    elements.forEach((el) => {
      el.style.removeProperty("transform");
      el.style.removeProperty("left");
      el.style.removeProperty("top");
      el.style.removeProperty("opacity");
    });
  };

  // Modern + legacy listeners
  isSmallScreen.addEventListener?.("change", handleSmallScreenChange);
  
  return {startAnimation};
}
