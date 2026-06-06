"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

// Import layers
import StarField from "./layers/StarField";
import NebulaClouds from "./layers/NebulaClouds";
import SpaceDebris from "./layers/SpaceDebris";
import EnergyRivers from "./layers/EnergyRivers";
import FarStarStreaks from "./layers/FarStarStreaks";
import TunnelRings from "./layers/TunnelRings";
import HubScene from "./HubScene";
import ForegroundParticles from "./layers/ForegroundParticles";

// Import dimensions
import AIMLDimension from "./dimensions/AIMLDimension";
import SoftwareDimension from "./dimensions/SoftwareDimension";
import FullStackDimension from "./dimensions/FullStackDimension";
import DatabaseDimension from "./dimensions/DatabaseDimension";
import AutomationDimension from "./dimensions/AutomationDimension";
import DevOpsDimension from "./dimensions/DevOpsDimension";
import MissionArchiveDimension from "./dimensions/MissionArchiveDimension";

// Import HTML UI overlays
import HubUI from "./ui/HubUI";
import DimensionUI from "./ui/DimensionUI";
import TravelFlash from "./ui/TravelFlash";
import MobileFallback from "./MobileFallback";
import CameraRig from "./CameraRig";

// Import projects data and modal
import { DIMENSIONS } from "./data";
import { Project } from "@/data/projects";
import ProjectModal from "@/components/projects/ProjectModal";

// Error Boundary for catching 3D Canvas context failures or runtime errors
class PortalErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Portal 3D Canvas Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Camera controller inside Canvas to access useThree
interface TimelineControllerProps {
  activeDimension: string | null;
  setActiveDimension: (id: string | null) => void;
  traveling: boolean;
  setTraveling: (val: boolean) => void;
  tunnelSpeedRef: React.MutableRefObject<{ value: number }>;
  cameraShakeRef: React.MutableRefObject<{ value: number }>;
  flashRef: React.RefObject<HTMLDivElement | null>;
  triggerTravel: string | null;
  setTriggerTravel: (val: string | null) => void;
  triggerExit: boolean;
  setTriggerExit: (val: boolean) => void;
}

function PortalTimelineController({
  activeDimension,
  setActiveDimension,
  setTraveling,
  tunnelSpeedRef,
  cameraShakeRef,
  flashRef,
  triggerTravel,
  setTriggerTravel,
  triggerExit,
  setTriggerExit,
}: TimelineControllerProps) {
  const { camera } = useThree();

  // Handle entering dimension warp sequence
  useEffect(() => {
    if (!triggerTravel) return;
    const dimId = triggerTravel;
    setTriggerTravel(null);
    setTraveling(true);

    const { scene } = camera.parent ? (camera.parent as any) : { scene: null };
    const targetScene = scene || (camera as any).scene;

    // Initial camera position & lock targets
    camera.position.set(0, 0, 8);
camera.lookAt(0, 0, -4);

if ("fov" in camera) {
  camera.fov = 70;
  camera.updateProjectionMatrix();
}

    // Reset fog initially
    if (targetScene && targetScene.fog && targetScene.fog instanceof THREE.Fog) {
      targetScene.fog.near = 25;
      targetScene.fog.far = 120;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setTraveling(false);
      },
    });

    // Phase 1 (0.0s - 0.45s): Activate portal core. Camera sways/pulls back slightly to Z=9.5.
    tl.to(camera.position, {
      z: 9.5,
      duration: 0.45,
      ease: "power2.out",
    }, 0.0);

    // Camera shake starts as portal core activates
    tl.to(cameraShakeRef.current, { value: 0.25, duration: 0.45 }, 0.0);

    // Phase 2 (0.45s - 0.95s): Emit energy pulse + Pull camera toward portal.
    // Camera zooms into Z=1.8 (looking at the core).
    tl.to(camera.position, {
      z: 1.8,
      duration: 0.5,
      ease: "power2.in",
    }, 0.45);

    // FOV lens pinch: camera zooms in, narrowing FOV to 52
    tl.to(camera, {
      fov: 52,
      duration: 0.5,
      ease: "power2.in",
      onUpdate: () => camera.updateProjectionMatrix(),
    }, 0.45);

    // Shake increases as camera enters portal threshold
    tl.to(cameraShakeRef.current, { value: 0.65, duration: 0.5 }, 0.45);

    // Phase 3 (0.95s - 1.7s): Hyperspace travel sequence! Camera blasts through portal to Z=-55
    tl.to(camera.position, {
      z: -55,
      duration: 0.75,
      ease: "sine.inOut",
    }, 0.95);

    // FOV wide-warp stretch: FOV explodes from 52 to 120 (wide warp space distortion)
    tl.to(camera, {
      fov: 120,
      duration: 0.65,
      ease: "power3.in",
      onUpdate: () => camera.updateProjectionMatrix(),
    }, 0.95);

    // Extreme camera shake during warp flight
    tl.to(cameraShakeRef.current, { value: 1.05, duration: 0.65 }, 0.95);

    // Accelerate stars/particles speed to 25
    tl.to(tunnelSpeedRef.current, { value: 25, duration: 0.75, ease: "power2.in" }, 0.85);

    // Phase 4: Thick fog rolls in close to engulf the view in volumetric depth
    if (targetScene && targetScene.fog && targetScene.fog instanceof THREE.Fog) {
      tl.to(targetScene.fog, { near: 2, far: 15, duration: 0.65, ease: "power2.in" }, 0.95);
    }

    // Blinding white flash overlay peaks at peak warp speed (t = 1.45s to 1.7s)
    if (flashRef.current) {
      tl.to(flashRef.current, { opacity: 1, duration: 0.25, ease: "power1.in" }, 1.45);
    }

    // Phase 5 (1.7s): Teleport camera to Z=22, reset fog, reset fov, set active dimension
    tl.set(camera.position, { z: 22 }, 1.7);
    tl.call(() => {
      setActiveDimension(dimId);
      // Reset fog limits back to wide room boundaries inside the sub-dimension
      if (targetScene && targetScene.fog && targetScene.fog instanceof THREE.Fog) {
        targetScene.fog.near = 25;
        targetScene.fog.far = 120;
      }
    }, [], 1.7);
    tl.to(tunnelSpeedRef.current, { value: 1, duration: 0.1 }, 1.7);
    tl.to(cameraShakeRef.current, { value: 0.0, duration: 0.1 }, 1.7);

    // Phase 6 (1.7s - 2.5s): Glide camera to Z=8 inside room, restore standard 70 FOV, fade flash out
    tl.to(camera.position, {
      z: 8,
      duration: 0.8,
      ease: "power2.out",
    }, 1.7);

    tl.to(camera, {
      fov: 70,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    }, 1.7);

    if (flashRef.current) {
      tl.to(flashRef.current, { opacity: 0, duration: 0.6, ease: "power2.out" }, 1.7);
    }
  }, [triggerTravel, camera, flashRef, tunnelSpeedRef, cameraShakeRef, setActiveDimension, setTraveling, setTriggerTravel]);

  // Handle returning back to hub portal sequence
  useEffect(() => {
    if (!triggerExit) return;
    setTriggerExit(false);
    setTraveling(true);

    const { scene } = camera.parent ? (camera.parent as any) : { scene: null };
    const targetScene = scene || (camera as any).scene;

    const tl = gsap.timeline({
      onComplete: () => {
        setTraveling(false);
      },
    });

    // Phase 1 (0.0s - 0.55s): Camera shakes and rushes backward from active dimension space (z=8 to z=-20)
    tl.to(camera.position, {
      z: -20,
      duration: 0.55,
      ease: "power2.in",
    });

    tl.to(cameraShakeRef.current, { value: 0.75, duration: 0.5 }, 0.0);

    // FOV wide-stretch exit effect
    tl.to(camera, {
      fov: 100,
      duration: 0.5,
      ease: "power2.in",
      onUpdate: () => camera.updateProjectionMatrix(),
    }, 0.0);

    // Fog rolls in
    if (targetScene && targetScene.fog && targetScene.fog instanceof THREE.Fog) {
      tl.to(targetScene.fog, { near: 3, far: 20, duration: 0.5, ease: "power2.in" }, 0.0);
    }

    // Phase 2: White flash overlay
    if (flashRef.current) {
      tl.to(flashRef.current, { opacity: 1, duration: 0.15 }, 0.45);
    }

    // Phase 3: Teleport back to portal threshold (z=2) and load HubScene
    tl.set(camera.position, { z: 2 }, 0.55);
    tl.call(() => {
      setActiveDimension(null);
      if (targetScene && targetScene.fog && targetScene.fog instanceof THREE.Fog) {
        targetScene.fog.near = 25;
        targetScene.fog.far = 120;
      }
    }, [], 0.55);

    // Phase 4: Reset tunnel warp speed, shake, and fov
    tl.to(tunnelSpeedRef.current, { value: 1, duration: 0.1 }, 0.55);
    tl.to(cameraShakeRef.current, { value: 0.0, duration: 0.1 }, 0.55);

    // Phase 5: Glide back to standard viewing distance (z=8) and fade flash
    tl.to(camera.position, {
      z: 8,
      duration: 0.75,
      ease: "power2.out",
    }, 0.55);

    tl.to(camera, {
      fov: 70,
      duration: 0.75,
      ease: "power2.out",
      onUpdate: () => camera.updateProjectionMatrix(),
    }, 0.55);

    if (flashRef.current) {
      tl.to(flashRef.current, { opacity: 0, duration: 0.55, ease: "power2.out" }, 0.55);
    }
  }, [triggerExit, camera, flashRef, tunnelSpeedRef, cameraShakeRef, setActiveDimension, setTraveling, setTriggerExit]);

  return null;
}

export default function TechDimensionPortal() {
  const [isMobile, setIsMobile] = useState(false);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);
  const [activeDimension, setActiveDimension] = useState<string | null>(null);
  const [traveling, setTraveling] = useState(false);

  // States to trigger animations inside Canvas controller
  const [triggerTravel, setTriggerTravel] = useState<string | null>(null);
  const [triggerExit, setTriggerExit] = useState(false);

  // Global state for opening brief modal
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Speed and shake refs for high performance delta animation without triggering React re-renders
  const tunnelSpeedRef = useRef({ value: 1 });
  const cameraShakeRef = useRef({ value: 0 });
  const flashRef = useRef<HTMLDivElement>(null);

  // Check viewport and WebGL support on mount
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const checkWebGL = () => {
      try {
        const canvas = document.createElement("canvas");
        const supported = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
        setHasWebGL(supported);
      } catch (e) {
        setHasWebGL(false);
      }
    };
    checkWebGL();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentDimensionIndex = useMemo(() => {
    if (!activeDimension) return -1;
    return DIMENSIONS.findIndex((d) => d.id === activeDimension);
  }, [activeDimension]);

  const currentDimension = useMemo(() => {
    if (currentDimensionIndex === -1) return null;
    return DIMENSIONS[currentDimensionIndex];
  }, [activeDimension, currentDimensionIndex]);

  // Teleport execution trigger
  const handleEnterDimension = (dimId: string) => {
    if (traveling) return;
    setTriggerTravel(dimId);
  };

  const handleReturnToHub = () => {
    if (traveling) return;
    setTriggerExit(true);
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
  };

  // Render Mobile static fallback or WebGL missing fallback
  if (isMobile || hasWebGL === false) {
    return (
      <div id="skills-portal">
        <MobileFallback onProjectClick={handleProjectClick} />
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      </div>
    );
  }

  const fallbackUI = (
    <div id="skills-portal">
      <MobileFallback onProjectClick={handleProjectClick} />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );

  return (
    <PortalErrorBoundary fallback={fallbackUI}>
      <section id="skills-portal" className="relative w-full h-screen bg-[#020409] overflow-hidden z-10">
        {/* 3D R3F Canvas */}
        <Canvas
          camera={{ position: [0, 0, 8], fov: 70, near: 0.1, far: 500 }}
          style={{ width: "100%", height: "100vh" }}
          gl={{
            antialias: false,
            alpha: false,
            powerPreference: "high-performance",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.25,
          }}
          dpr={[1, 1.5]}
          frameloop="always"
        >
          <fog attach="fog" args={["#020409", 25, 120]} />
          <ambientLight intensity={0.05} />

          {/* Layer 10: Fixed Star Field */}
          <StarField />

          {/* Layer 9: Volumetric Nebula Clouds */}
          <NebulaClouds speed={traveling ? tunnelSpeedRef.current.value : 1.0} />

          {/* Layer 8.5: Space Debris field */}
          <SpaceDebris />

          {/* Layer 8.2: Flowing cosmic Energy Rivers */}
          <EnergyRivers />

          {/* Layer 8: Distance Star streaks */}
          <FarStarStreaks speed={traveling ? tunnelSpeedRef.current.value : 0.05} />

          {/* Layer 7: Concentric stacked tunnel rings */}
          <TunnelRings speed={traveling ? tunnelSpeedRef.current.value * 0.8 : 1.0} />

          {/* Hub portal and Nodes (Only render when not deep in a sub-dimension) */}
          {!activeDimension && (
            <HubScene onEnterDimension={handleEnterDimension} traveling={traveling} />
          )}

          {/* Dimensions Space Rendering */}
          {activeDimension === "aiml" && <AIMLDimension />}
          {activeDimension === "backend" && <SoftwareDimension />}
          {activeDimension === "fullstack" && <FullStackDimension />}
          {activeDimension === "databases" && <DatabaseDimension />}
          {activeDimension === "automation" && <AutomationDimension />}
          {activeDimension === "devops" && <DevOpsDimension />}
          
          {activeDimension === "projects" && (
            <MissionArchiveDimension onProjectClick={handleProjectClick} />
          )}

          {/* Layer 1: Closest foreground particles */}
          <ForegroundParticles speed={traveling ? tunnelSpeedRef.current.value : 0.05} />

          {/* Camera Rig (Organic floats, cursor parallax & camera shake) */}
          <CameraRig
            traveling={traveling}
            activeDimension={activeDimension}
            cameraShakeRef={cameraShakeRef}
          />

          {/* Custom R3F Camera timeline controller */}
          <PortalTimelineController
            activeDimension={activeDimension}
            setActiveDimension={setActiveDimension}
            traveling={traveling}
            setTraveling={setTraveling}
            tunnelSpeedRef={tunnelSpeedRef}
            cameraShakeRef={cameraShakeRef}
            flashRef={flashRef}
            triggerTravel={triggerTravel}
            setTriggerTravel={setTriggerTravel}
            triggerExit={triggerExit}
            setTriggerExit={setTriggerExit}
          />


        </Canvas>

        {/* HTML overlay UI Layer */}
        {!activeDimension && !traveling && (
          <HubUI onSelectDimension={handleEnterDimension} />
        )}

        {activeDimension && !traveling && currentDimension && (
          <DimensionUI
            dimension={currentDimension}
            dimensionIndex={currentDimensionIndex}
            onBack={handleReturnToHub}
          />
        )}

        {/* Warp White Flash overlay */}
        <TravelFlash ref={flashRef} />

        {/* Project Briefing details Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </section>
    </PortalErrorBoundary>
  );
}
