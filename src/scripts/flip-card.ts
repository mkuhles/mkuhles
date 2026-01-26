import { isTiny } from "./media";

function getCircleContainer(): HTMLElement | null {
  return document.getElementById("circle-container");
}

function getBack(card: HTMLElement): HTMLElement | null {
  return card.querySelector<HTMLElement>(".flip-card-back");
}

function getTranslateXY(el: HTMLElement) {
  const t = getComputedStyle(el).transform;
  if (!t || t === "none") return { x: 0, y: 0 };

  const m = new DOMMatrixReadOnly(t);
  return { x: m.m41, y: m.m42 };
}

function setBackOffset(back: HTMLElement, dx: number, dy: number) {
  back.style.setProperty("--dx", `${dx}px`);
  back.style.setProperty("--dy", `${dy}px`);
}

function clearBackOffset(back: HTMLElement) {
  back.style.removeProperty("--dx");
  back.style.removeProperty("--dy");
}

export function closeAllOpenCards() {
  const openCards = document.getElementsByClassName("flip-card is-open");
  Array.from(openCards).forEach((el) => {
    const card = el as HTMLElement;
    card.classList.remove("is-open");
    card.setAttribute("aria-pressed", "false");

    const back = getBack(card);
    if (back) clearBackOffset(back);
  });
}

function computeBackCenteringOffset(container: HTMLElement, card: HTMLElement, back: HTMLElement) {
  debugCross('50%','50%','red');
  // offsetLeft is used for both axes because the container is symmetrically
  // positioned via vmin-based sizing (same horizontal and vertical offset).
  const targetCx = container.offsetWidth / 2;
  const targetCy = container.offsetHeight / 2;
console.log({targetCx, targetCy});
  debugCross(targetCx+'px',targetCy+'px','blue');
  // The card is already offset via translate(); read its current translation
  // so we can neutralize it when centering the back side.
  const { x: cardX, y: cardY } = getTranslateXY(card);
console.log({cardX, cardY});

  const backWidth = back.offsetWidth;
  const backHeight = back.offsetHeight;
console.log({backWidth, backHeight})
  const dx = targetCx - cardX - backWidth / 2;
  const dy = targetCy - cardY - backHeight / 2;

  return { dx, dy };
}

function openCardMobile(container: HTMLElement, card: HTMLElement, back: HTMLElement) {
  const { dx, dy } = computeBackCenteringOffset(container, card, back);
  setBackOffset(back, dx, dy);

  card.classList.add("is-open");
  card.setAttribute("aria-pressed", "true");
}

function closeCardMobile(card: HTMLElement, back: HTMLElement) {
  card.classList.remove("is-open");
  card.setAttribute("aria-pressed", "false");
  clearBackOffset(back);
}

export function toggleCardMobile(card: HTMLElement) {
  const container = getCircleContainer();
  const back = getBack(card);
  if (!container || !back) return;

  const isOpen = card.getAttribute("aria-pressed") === "true";

  if (!isOpen) {
    closeAllOpenCards();
    openCardMobile(container, card, back);
  } else {
    closeCardMobile(card, back);
  }
}

export function requestReflow() {
  if (!isTiny()) return;

  const container = getCircleContainer();
  const card = document.querySelector<HTMLElement>(".flip-card.is-open");
  const back = card ? getBack(card) : null;
  if (!container || !card || !back) return;

  const { dx, dy } = computeBackCenteringOffset(container, card, back);
  setBackOffset(back, dx, dy);
}

function debugCross(x:string,y:string,color:string) {
  const container = getCircleContainer();
  container?.insertAdjacentHTML("beforeend",'<div style="top:0;left:'+x+';width:2px;height:100%;background-color:'+color+';position:absolute"></div>');
  container?.insertAdjacentHTML("beforeend",'<div style="left:0;top:'+x+';height:2px;width:100%;background-color:'+color+';position:absolute"></div>');
}