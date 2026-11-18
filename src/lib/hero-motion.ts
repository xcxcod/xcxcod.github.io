/** Mutable rendering channel: no React updates or DOM measurement on scroll. */
export type HeroMotionState = {
  progress: number;
  enabled: boolean;
  invalidate: () => void;
};

export const createHeroMotion = ():HeroMotionState => ({progress:0,enabled:false,invalidate:() => {}});

export function heroPose(progress:number) {
  const p = Math.max(0,Math.min(1,progress));
  return {rotationZ:-.065+p*.13,rotationY:-p*.13,y:p*.35,scale:1+p*.16,lensX:.32-p*.18};
}
