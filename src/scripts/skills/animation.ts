import arrangeCircleElements from "./layout";

const STEP_NUMBER = 50;
const MAX_ANGLE = 2 * Math.PI;
const ANGLE_STEP = MAX_ANGLE / STEP_NUMBER;
const MAX_OPACITY = 1;
const OPACITY_STEP = 1 / STEP_NUMBER;
const DURATION_MS = 1400;

export type CircleAnimationController = {
  start: (skipInitialAnimation?: boolean) => void;
  stop: () => void;
  reflow: () => void;
};

export default function createCircleAnimation(
  opts?: { onComplete?: () => void }
): CircleAnimationController {
  let angle = 0;
  let radius = 0;
  let opacity = 0;

  let maxRadius = 0;
  let radiusStep = 0;

  // Store the current animation frame request id. Using requestAnimationFrame
  // instead of setInterval aligns updates with the browser's refresh cycle and
  // improves performance.
  let rafId: number | null = null;

  function recomputeSizes(): [number, number] | null {
    const container = document.getElementById("circle-container") as HTMLElement | null;
    const elem = document.querySelector(".circle-element") as HTMLElement | null;
    if (!container || !elem) return null;

    const diameterPx = elem.getBoundingClientRect().width;
    const rect = container.getBoundingClientRect();
    const vmin = Math.min(rect.width, rect.height);

    const newMaxRadius = (vmin - diameterPx) / 2;
    const newRadiusStep = newMaxRadius / STEP_NUMBER;

    return [newMaxRadius, newRadiusStep];
  }

  function applySizesOrBail(): boolean {
    const r = recomputeSizes();
    if (!r) return false;
    [maxRadius, radiusStep] = r;
    return true;
  }

  function draw() {
    arrangeCircleElements(angle, radius, opacity);
  }

  function reflow() {
    if (!applySizesOrBail()) return;

    // Snap the radius to the new maximum if it was previously non‑zero. This
    // ensures that resizing the container while the circles are expanded keeps
    // them fully expanded.
    radius = radius === 0 ? 0 : maxRadius;
    draw();
  }

  function stop() {
    // Cancel any scheduled animation frame
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function resetState() {
    angle = 0;
    radius = 0;
    opacity = 0;
  }

  function start(skipInitialAnimation = false) {
    // Ensure sizes are up to date
    if (!applySizesOrBail()) return;

    // If already running, reset and cancel existing frame
    stop();
    resetState();

    // If we should skip the initial animation, jump directly to the final state
    if (skipInitialAnimation) {
      angle = MAX_ANGLE;
      radius = maxRadius;
      opacity = MAX_OPACITY;
      draw();
      return;
    }

    // Internal function to perform a single animation step. Each call schedules
    // itself via requestAnimationFrame until the animation completes.
    const startTime = performance.now();

    const animateFrame = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / DURATION_MS, 1);

      // optional easing (wirkt natürlicher)
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

      angle = MAX_ANGLE * eased;
      radius = maxRadius * eased;
      opacity = MAX_OPACITY * eased;

      draw();

      if (t >= 1) {
        stop();
        opts?.onComplete?.();
        return;
      }

      rafId = requestAnimationFrame(animateFrame);    
    };

    rafId = requestAnimationFrame(animateFrame);
  }

  return { start, stop, reflow };
}
function calculateNextState(previous: number, max: number, step: number): number {
  if (previous >= max - step) return max;
  return previous + step;
}
