"use client";

import { forwardRef } from "react";

const TravelFlash = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        backgroundColor: "white",
        opacity: 0,
        pointerEvents: "none",
        transition: "none",
      }}
    />
  );
});

TravelFlash.displayName = "TravelFlash";

export default TravelFlash;
