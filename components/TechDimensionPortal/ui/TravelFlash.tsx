"use client";

import { forwardRef } from "react";

/**
 * TravelFlash — Cinematic warp travel flash overlay.
 * Three chromatic aberration layers (R, G, B offset) + main white flash.
 * GSAP animates the opacity of the main div; the chromatic layers
 * are CSS children that inherit opacity automatically.
 */
const TravelFlash = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div
      ref={ref}
      className="absolute inset-0 pointer-events-none z-50"
      style={{ opacity: 0 }}
    >
      {/* Chromatic aberration — Red channel offset left */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(255,60,60,0.6) 0%, transparent 70%)",
          transform: "translateX(-4px)",
          mixBlendMode: "screen",
        }}
      />
      {/* Chromatic aberration — Blue channel offset right */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(60,60,255,0.6) 0%, transparent 70%)",
          transform: "translateX(4px)",
          mixBlendMode: "screen",
        }}
      />
      {/* Main white core flash */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, rgba(220,240,255,1) 0%, rgba(120,200,255,0.85) 30%, rgba(0,40,80,0.5) 80%, transparent 100%)",
        }}
      />
      {/* Outer dark vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
});

TravelFlash.displayName = "TravelFlash";
export default TravelFlash;
