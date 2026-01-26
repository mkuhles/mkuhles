export function isTiny() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--is-tiny")
    .trim() === "1";
}