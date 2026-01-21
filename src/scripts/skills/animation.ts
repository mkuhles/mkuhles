import arrangeCircleElements from "./layout";

const STEP_NUMBER = 50;
const MAX_ANGLE = 2 * Math.PI;
const ANGLE_STEP = MAX_ANGLE / STEP_NUMBER;
const MAX_OPACITY = 1;
const OPACITY_STEP = 1 / STEP_NUMBER;

export type CircleAnimationController = {
  start: (skipInitialAnimation?: boolean) => void;
  stop: () => void;
  reflow: () => void;
  isRunning: () => boolean;
};

export default function createCircleAnimation(
  opts?: { onComplete?: () => void }
): CircleAnimationController {
  let angle = 0;
  let radius = 0;
  let opacity = 0;

  let maxRadius = 0;
  let radiusStep = 0;

  let intervalId: number | null = null;

  function recomputeSizes(): [number, number] | null {
    const container = document.getElementById("circle-container") as HTMLElement | null;
    const elem = document.querySelector(".center-element") as HTMLElement | null;
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

    // set radius to max if it was already there
    radius = radius == 0 ? radius : maxRadius;
    draw();
  }

  function stop() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function isRunning() {
    return intervalId !== null;
  }

  function resetState() {
    angle = 0;
    radius = 0;
    opacity = 0;
  }

  function start(skipInitialAnimation = false) {
    // Stelle sicher, dass Größen aktuell sind
    if (!applySizesOrBail()) return;

    // falls schon läuft: neu starten
    stop();
    resetState();

    if (skipInitialAnimation) {
      angle = MAX_ANGLE;
      radius = maxRadius;
      opacity = MAX_OPACITY;
      draw();
      return;
    }

    intervalId = window.setInterval(() => {
      angle = calculateNextState(angle, MAX_ANGLE, ANGLE_STEP);
      radius = calculateNextState(radius, maxRadius, radiusStep);
      opacity = calculateNextState(opacity, MAX_OPACITY, OPACITY_STEP);

      draw();

      if (angle >= MAX_ANGLE && radius >= maxRadius && opacity >= MAX_OPACITY) {
        stop();
        opts?.onComplete?.();
      }
    }, 25);
  }

  return { start, stop, reflow, isRunning };
}

function calculateNextState(previous: number, max: number, step: number): number {
  if (previous >= max - step) return max;
  return previous + step;
}
