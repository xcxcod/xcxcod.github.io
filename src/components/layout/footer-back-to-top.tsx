"use client";

import { ArrowUp } from "lucide-react";

export function FooterBackToTop() {
  function returnToTop() {
    document.getElementById("portfolio-main")?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <button className="footer-top-link" type="button" onClick={returnToTop}>Back to top <ArrowUp size={17} aria-hidden="true" /></button>;
}
