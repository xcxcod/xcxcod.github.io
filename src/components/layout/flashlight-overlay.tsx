"use client";

import { useEffect, useRef } from "react";

export function FlashlightOverlay({ onDismiss }: { onDismiss: () => void }) {
  const overlay = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = overlay.current;
    if (!element) return;
    let frame: number | null = null;
    let x = 0;
    let y = 0;

    function aim(clientX: number, clientY: number) {
      x = clientX;
      y = clientY;
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => {
        element?.style.setProperty("--beam-x", `${x}px`);
        element?.style.setProperty("--beam-y", `${y}px`);
        frame = null;
      });
    }

    function movePointer(event: PointerEvent) {
      if (event.isPrimary) aim(event.clientX, event.clientY);
    }

    function moveTouch(event: TouchEvent) {
      const touch = event.touches[0];
      if (touch) aim(touch.clientX, touch.clientY);
    }

    function revealFocus(event: FocusEvent) {
      if (!(event.target instanceof HTMLElement) || !event.target.matches(":focus-visible")) return;
      const target = event.target;
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = null;
        const rect = target.getBoundingClientRect();
        aim(rect.left + rect.width / 2, rect.top + rect.height / 2);
      });
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.defaultPrevented) onDismiss();
    }

    window.addEventListener("pointermove", movePointer, { passive: true });
    window.addEventListener("pointerdown", movePointer, { passive: true });
    window.addEventListener("touchmove", moveTouch, { passive: true });
    window.addEventListener("focusin", revealFocus);
    window.addEventListener("keydown", handleKey);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", movePointer);
      window.removeEventListener("pointerdown", movePointer);
      window.removeEventListener("touchmove", moveTouch);
      window.removeEventListener("focusin", revealFocus);
      window.removeEventListener("keydown", handleKey);
    };
  }, [onDismiss]);

  return <div ref={overlay} className="flashlight-overlay" aria-hidden="true" />;
}
