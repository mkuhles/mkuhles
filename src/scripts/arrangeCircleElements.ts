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
    
    // innerFactor: wie viel kleiner die "erste Hälfte" stehen bleibt (0..1)
    const innerFactor = 0.5;
    const innerRadius = baseRadius * innerFactor;

    let radius = container.offsetHeight / 2; // Radius of the circle
    const centerX = container.offsetWidth / 2; // Center X position
    const centerY = container.offsetHeight / 2; // Center Y position

    // Gruppieren: erste Hälfte inner, Rest outer
    const innerCount = Math.ceil(elements.length / 3);
    const outerCount = elements.length - innerCount;
    const innerElems = elements.slice(0, innerCount);
    const outerElems = elements.slice(innerCount);

    // eigenständige Winkelverteilung pro Gruppe
    const innerAngleStep = innerCount > 0 ? (2 * Math.PI) / innerCount : 0;
    const outerAngleStep = outerCount > 0 ? (2 * Math.PI) / outerCount : 0;

    // helper to position a group of elements with its own angle step and radius
    const opacityStr = typeof globalOpacity === 'number' ? String(globalOpacity) : '1';
    function positionGroup(elems: HTMLElement[], angleStep: number, radiusVal: number, angleSign: number) {
        elems.forEach((el, i) => {
            const angle = i * angleStep + angleSign * globalAngle - Math.PI / 2;
            const x = centerX + radiusVal * Math.cos(angle) - el.offsetWidth / 2;
            const y = centerY + radiusVal * Math.sin(angle) - el.offsetHeight / 2;
            el.style.left = `${x}px`;
            el.style.top = `${y}px`;
            el.style.opacity = opacityStr;
        });
    }

    // positioniere innere und äußere Gruppe
    positionGroup(innerElems, innerAngleStep, innerRadius, -1);
    positionGroup(outerElems, outerAngleStep, baseRadius, +1);
}