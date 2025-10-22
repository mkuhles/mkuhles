import arrangeCircleElements from './arrangeCircleElements';

const STEP_NUMBER = 50;
const MAX_ANGLE = 2 * Math.PI;
const ANGLE_STEP = (2 * Math.PI) / STEP_NUMBER;
const MAX_OPACITY = 1;
const OPACITY_STEP = 1 / STEP_NUMBER;

export default function useCircleAnimation(skipInitialAnimation:boolean = false) {
  let angle = 0;
  let radius = 0;
  let opacity = 0;
  let windowsize = [window.innerWidth, window.innerHeight];

  let width, height, vmin, maxRadius, radiusStep;

  function recomputeSizes() {
    width = window.innerWidth;
    height = window.innerHeight;
    vmin = Math.min(width, height);
    maxRadius = vmin * 0.3;
    radiusStep = maxRadius / STEP_NUMBER;

    // keep current radius within new bounds (don't restart animation)
    if (radius > maxRadius) radius = maxRadius;
  }

  function handleResize() {
    recomputeSizes();
    arrangeCircleElements(angle, radius, opacity);
  }
  recomputeSizes();
  window.addEventListener('resize', handleResize);

  if (skipInitialAnimation) {
    arrangeCircleElements(MAX_ANGLE, maxRadius, MAX_OPACITY);
    return function stopNoop() { /* nothing to cleanup */ };
  }

  const interval = setInterval(() => {
    angle = calculateNextState(angle, MAX_ANGLE, ANGLE_STEP);
    radius = calculateNextState(radius, maxRadius, radiusStep);
    opacity = calculateNextState(opacity, MAX_OPACITY, OPACITY_STEP);

    arrangeCircleElements(angle, radius, opacity);
  }, 25);

  // return cleanup so caller can stop the animation
  return function stop() {
    clearInterval(interval);
    window.removeEventListener('resize', handleResize);
  };
}

function calculateNextState(previous: number, max: number, step: number): number {
  if (previous >= max - step) {
    return max;
  }
  return previous + step;
}