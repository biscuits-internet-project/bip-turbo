import "@testing-library/jest-dom/vitest";

// Polyfills for Radix UI components that use pointer/scroll APIs unavailable in jsdom.
if (typeof Element.prototype.hasPointerCapture !== "function") {
  Element.prototype.hasPointerCapture = () => false;
}
if (typeof Element.prototype.scrollIntoView !== "function") {
  Element.prototype.scrollIntoView = () => {};
}
