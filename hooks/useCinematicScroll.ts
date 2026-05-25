"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useCinematicScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-cinematic]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 120, scale: 0.92 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.4,
            ease: "power4.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-mission-pin]").forEach((el) => {
        const content = el.querySelector("[data-mission-content]");
        if (!content) return;

        gsap.fromTo(
          content,
          { opacity: 0.3, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top center",
              end: "bottom center",
              scrub: 1,
            },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-parallax-bg]").forEach((el) => {
        gsap.to(el, {
          yPercent: 25,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-camera]").forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.15, filter: "blur(8px)" },
          {
            scale: 1,
            filter: "blur(0px)",
            duration: 1.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);
}
