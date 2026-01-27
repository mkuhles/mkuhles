export function isSmallScreen() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--is-small")
    .trim() === "1";
}