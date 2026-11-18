export function scrollProgress(scroll: number, start: number, end: number) {
  if (end <= start) return scroll >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (scroll-start)/(end-start)));
}
