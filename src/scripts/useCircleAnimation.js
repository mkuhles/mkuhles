import arrangeCircleElements from './arrangeCircleElements';

const STEP_NUMBER = 50;
const MAX_ANGLE = 2 * Math.PI;
const ANGLE_STEP = (2 * Math.PI) / STEP_NUMBER;
const MAX_OPACITY = 1;
const OPACITY_STEP = 1 / STEP_NUMBER;

export default function useCircleAnimation(skipInitialAnimation = false) {
  let angle = 0;
  let radius = 0;
  let opacity = 0;
  let windowsize = [window.innerWidth, window.innerHeight];
console.log(skipInitialAnimation);
  const [width, height] = windowsize;
  const vmin = width < height ? width : height;
  const maxRadius = vmin * 0.3; // 50px padding
  const radiusStep = maxRadius / STEP_NUMBER;
  
  if (skipInitialAnimation) {
    arrangeCircleElements(MAX_ANGLE, maxRadius, MAX_OPACITY);
    return;
  }

  function handleResize() {
    windowsize = [window.innerWidth, window.innerHeight];
  }
  window.addEventListener('resize', handleResize);

  const interval = setInterval(() => {
    angle = calculateNextState(angle, MAX_ANGLE, ANGLE_STEP);
    radius = calculateNextState(radius, maxRadius, radiusStep);
    opacity = calculateNextState(opacity, MAX_OPACITY, OPACITY_STEP);

    arrangeCircleElements(angle, radius, opacity);
  }, 25);

  window.addEventListener('beforeunload', () => {
    window.removeEventListener('resize', handleResize);
    clearInterval(interval);
  });
  
  return;
}

function calculateNextState(previous, max, step) {
  if (previous >= max - step) {
    return max;
  }
  return previous + step;
}