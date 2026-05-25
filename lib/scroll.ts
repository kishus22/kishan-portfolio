export function scrollToSection(
  target: string,
  lenis?: { scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void } | null,
) {
  const el = document.querySelector(target);
  if (!el) return;

  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.8 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
