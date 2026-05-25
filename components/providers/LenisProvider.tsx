"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { scrollToSection } from "@/lib/scroll";

type LenisContextValue = {
  lenis: Lenis | null;
  scrollTo: (selector: string) => void;
};

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  scrollTo: () => {},
});

export function useLenisScroll() {
  return useContext(LenisContext);
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.6,
      smoothWheel: true,
      lerp: 0.07,
    });
    lenisRef.current = instance;
    setLenis(instance);

    let frameId = 0;
    const raf = (time: number) => {
      instance.raf(time);
      frameId = requestAnimationFrame(raf);
    };
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      instance.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = (selector: string) => {
    scrollToSection(selector, lenisRef.current);
  };

  return (
    <LenisContext.Provider value={{ lenis, scrollTo }}>
      {children}
    </LenisContext.Provider>
  );
}
