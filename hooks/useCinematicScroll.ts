"use client";

import { useEffect } from "react";

export function useCinematicScroll() {
  useEffect(() => {
    let ctx: any;

    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger")
    ]).then(([{ default: gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger);

      const prefersReduced = typeof window !== "undefined" && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

      if (prefersReduced) return;

      ctx = gsap.context(() => {
        // Universal Section Scroll Reveal (Desktop & Mobile)
        gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 80%", // when top of section is 20% inside viewport
                toggleActions: "play none none reverse",
              },
            },
          );
        });

        // Heavy GSAP timelines only on Desktop
        if (!isMobile) {
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
        }
      });
    });

    return () => {
      if (ctx) ctx.revert();
    };
  }, []);
}
