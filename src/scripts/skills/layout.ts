export default function arrangeCircleElements(globalAngle: number, globalRadius: number, globalOpacity: number) {
    const elementsNodeList = document.querySelectorAll<HTMLElement>('.circle-element');
    const elements = Array.from(elementsNodeList) as HTMLElement[];
    const container = document.getElementById('circle-container');
    if (!container) return; // Ensure the container exists
    if (!elements.length) return;

    const containerRadius = Math.min(container.offsetWidth, container.offsetHeight) / 2;
    const baseRadius = (typeof globalRadius === 'number' && globalRadius > 0)
        ? Math.min(containerRadius, globalRadius)
        : containerRadius;
    
    // Fraction by which the inner circle radius is scaled relative to the
    // outer circle. 0 means fully collapsed; 1 means same size as the outer
    // circle. Here we use half the base radius.
    const innerFactor = 0.5;
    const innerRadius = baseRadius * innerFactor;

    let radius = container.offsetHeight / 2; // Radius of the circle
    const centerX = container.offsetWidth / 2; // Center X position
    const centerY = container.offsetHeight / 2; // Center Y position

    // Divide the elements into two groups: roughly the first third goes to the
    // inner ring, the remaining elements to the outer ring.
    const innerCount = Math.ceil(elements.length / 3);
    const outerCount = elements.length - innerCount;
    const innerElems = elements.slice(0, innerCount);
    const outerElems = elements.slice(innerCount);

    // Each group distributes its elements evenly around its own circle
    const innerAngleStep = innerCount > 0 ? (2 * Math.PI) / innerCount : 0;
    const outerAngleStep = outerCount > 0 ? (2 * Math.PI) / outerCount : 0;

    // helper to position a group of elements with its own angle step and radius
    const opacityStr = typeof globalOpacity === 'number' ? String(globalOpacity) : '1';
    function positionGroup(elems: HTMLElement[],angleStep: number,radiusVal: number, angleSign: number) {
        elems.forEach((el, i) => {
            const angle = i * angleStep + angleSign * globalAngle - Math.PI / 2;
            // Compute the final position relative to the container. Instead of
            // assigning `left`/`top` (which triggers layout), we use
            // `transform: translate(x,y)` for better animation performance.
            const x = centerX + radiusVal * Math.cos(angle) - el.offsetWidth / 2;
            const y = centerY + radiusVal * Math.sin(angle) - el.offsetHeight / 2;
            // Reset left and top to avoid stale values from previous layouts.
            el.style.left = "0px";
            el.style.top = "0px";
            // Move the element using CSS transforms. Using translate avoids
            // triggering layout and leverages GPU acceleration for smoother
            // animation.
            el.style.transform = `translate(${x}px, ${y}px)`;
            // Set opacity directly; it's a compositor-friendly property.
            el.style.opacity = opacityStr;
        });
    }

    // Position the inner and outer group
    positionGroup(innerElems, innerAngleStep, innerRadius, -1);
    positionGroup(outerElems, outerAngleStep, baseRadius, +1);
}
