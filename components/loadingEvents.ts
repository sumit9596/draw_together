// Coordinates loading start and end events used by the global progress indicator.
export const LOADING_START_EVENT = 'drawtogether:loading-start';
export const LOADING_END_EVENT = 'drawtogether:loading-end';

let activeLoadingCount = 0;

export function resetLoading() {
  if (typeof window === 'undefined') return;
  activeLoadingCount = 0;
}

export function startLoading() {
  if (typeof window === 'undefined') return;
  activeLoadingCount += 1;
  window.dispatchEvent(new CustomEvent(LOADING_START_EVENT));
}

export function endLoading() {
  if (typeof window === 'undefined') return;
  activeLoadingCount = Math.max(0, activeLoadingCount - 1);
  if (activeLoadingCount > 0) return;
  window.dispatchEvent(new CustomEvent(LOADING_END_EVENT));
}
