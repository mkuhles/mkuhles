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

  const startAnimation = () => {
    // if (isSmallScreen.matches) return; // no-op on small screens
    controller.start(prefersReducedMotion.matches);
  };

  // --- Auto-play on view (large screens only) ---
  let hasAutoPlayed = false;
  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      if (hasAutoPlayed) return;
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
  if (container) {
    intersectionObserver.observe(container);
  }

  // --- Resize handling (large screens only) ---
  let reflowRafId: number | null = null;
  const requestReflow = () => {
    if (reflowRafId !== null) return;
    reflowRafId = requestAnimationFrame(() => {
      reflowRafId = null;
      controller.reflow();
    });
  };

  let resizeObserver: ResizeObserver | null = null;
  const attachResizeObservers = () => {
    if (!container) return;
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

  // Attach once at init.
  attachResizeObservers();

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
  
  return {startAnimation};
}
