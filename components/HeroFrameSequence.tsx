"use client";

import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const TOTAL_FRAMES = 112;

export default function HeroFrameSequence() {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Preload frames (Desktop only)
  useEffect(() => {
    if (!mounted || isMobile) return;

    let loadedCount = 0;
    const tempImages: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, "0");
      img.src = `/hero-frames/ezgif-frame-${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        // Fallback progress if some image fails to load
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setImagesLoaded(true);
        }
      };
      tempImages.push(img);
    }
    imagesRef.current = tempImages;

    return () => {
      // Clean up preloaded images
      imagesRef.current = [];
    };
  }, [mounted, isMobile]);

  // Handle Resize and Render Animation Loop
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const container = containerRef.current;
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      // Use devicePixelRatio to prevent blurry rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Draw function with background-size: cover logic
    const drawFrame = (imgIndex: number) => {
      const img = imagesRef.current[imgIndex];
      if (!img || !img.complete) return;

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      const imgWidth = img.naturalWidth || img.width;
      const imgHeight = img.naturalHeight || img.height;

      const imgRatio = imgWidth / imgHeight;
      const canvasRatio = canvasWidth / canvasHeight;

      let drawWidth = canvasWidth;
      let drawHeight = canvasHeight;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasRatio > imgRatio) {
        drawHeight = canvasWidth / imgRatio;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        offsetX = (canvasWidth - drawWidth) / 2;
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    let frameIndex = 0;
    let lastTime = 0;
    const fps = 24; // Cinematic 24 frames per second
    const frameInterval = 1000 / fps;

    const render = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;

      if (elapsed >= frameInterval) {
        if (imagesRef.current.length > 0) {
          // If all frames loaded, play loop. If not, draw whatever has loaded
          frameIndex = (frameIndex + 1) % TOTAL_FRAMES;
          drawFrame(frameIndex);
        }
        lastTime = timestamp;
      }
      animationFrameIdRef.current = requestAnimationFrame(render);
    };

    if (!isMobile) {
      animationFrameIdRef.current = requestAnimationFrame(render);
    } else {
      // Mobile static background rendering (only draw first frame on canvas once)
      const mobileImg = new Image();
      mobileImg.src = "/hero-frames/ezgif-frame-001.jpg";
      mobileImg.onload = () => {
        // Draw the static frame once
        const container = containerRef.current;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const canvasWidth = rect.width;
        const canvasHeight = rect.height;
        const imgWidth = mobileImg.naturalWidth || mobileImg.width;
        const imgHeight = mobileImg.naturalHeight || mobileImg.height;

        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth = canvasWidth;
        let drawHeight = canvasHeight;
        let offsetX = 0;
        let offsetY = 0;

        if (canvasRatio > imgRatio) {
          drawHeight = canvasWidth / imgRatio;
          offsetY = (canvasHeight - drawHeight) / 2;
        } else {
          drawWidth = canvasHeight * imgRatio;
          offsetX = (canvasWidth - drawWidth) / 2;
        }

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(mobileImg, offsetX, offsetY, drawWidth, drawHeight);
      };
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [mounted, isMobile, imagesLoaded]);

  if (!mounted) {
    return <div className="absolute inset-0 bg-[#020409]" />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 h-full w-full overflow-hidden bg-[#020409]">
      {isMobile ? (
        // Mobile fallback: simple absolute cover image for instant rendering (saving memory)
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-frames/ezgif-frame-001.jpg')" }}
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="block h-full w-full object-cover"
          style={{ width: "100%", height: "100%" }}
        />
      )}
    </div>
  );
}
