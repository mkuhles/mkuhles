import arrangeCircleElements from './arrangeCircleElements';

const STEP_NUMBER = 50;
const MAX_ANGLE = 2 * Math.PI;
const ANGLE_STEP = (2 * Math.PI) / STEP_NUMBER;
const MAX_OPACITY = 1;
const OPACITY_STEP = 1 / STEP_NUMBER;

export default function useCircleAnimation(skipInitialAnimation:boolean = false) {
  let angle: number = 0, radius: number = 0, opacity: number = 0;
  let width: number, height: number, vmin: number, maxRadius: number, radiusStep: number;

  function recomputeSizes():[number,number,number]|void {
    const container = document.getElementById('circle-container') as HTMLElement;
    const elem = document.querySelector('.center-element'); // nutzt width/height: var(--circleElementDiameter)
    if(!container || !elem) { return; }
    const diameterPx = elem.getBoundingClientRect().width;
    const boundingRect = container.getBoundingClientRect();
    const vmin = Math.min(boundingRect.width, boundingRect.height);
    
    const maxRadius = (vmin - diameterPx)/2;
    const radiusStep = maxRadius / STEP_NUMBER;

    const scale = document.getElementById('skillLevelScale') as HTMLElement;
    scale.style.height = vmin+"px";

    return [vmin,maxRadius,radiusStep];
  }

  function handleResize() {
    const returnValue = recomputeSizes();
    if(!returnValue) {
      return;
    }
    [vmin,maxRadius,radiusStep] = returnValue;
    arrangeCircleElements(angle, radius, opacity);
  }
  const returnValue = recomputeSizes();
  if(!returnValue) {
    return;
  }
  [vmin,maxRadius,radiusStep] = returnValue;
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