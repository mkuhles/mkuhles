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

    // positioniere innere Gruppe
    innerElems.forEach((element, i) => {
        const angle = i * innerAngleStep - globalAngle - Math.PI / 2;
        const r = innerRadius;
        const x = centerX + r * Math.cos(angle) - element.offsetWidth / 2;
        const y = centerY + r * Math.sin(angle) - element.offsetHeight / 2;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = typeof globalOpacity === 'number' ? globalOpacity : 1;
    });

    
    // positioniere äußere Gruppe
    outerElems.forEach((element, i) => {
        const angle = i * outerAngleStep + globalAngle - Math.PI / 2;
        const r = baseRadius;
        const x = centerX + r * Math.cos(angle) - element.offsetWidth / 2;
        const y = centerY + r * Math.sin(angle) - element.offsetHeight / 2;
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        element.style.opacity = typeof globalOpacity === 'number' ? globalOpacity : 1;
    });
}