/**
 * Mobile Atlas Prototype — Shared constants, types, hook.
 * DESIGN PROTOTYPE ONLY — does not modify desktop Atlas.
 */

import { useEffect, type RefObject } from "react";

export const W = 390;
export const H = 844;

export const T = {
  bg:          "#05050A",
  gold:        "#E8D5A3",
  body:        "#D4C490",
  accentGold:  "#C8A96E",
  muted:       "#6A5F4A",
  caseStudies: "#8AAEC8",
  experiments: "#A68BD4",
  frameworks:  "#6AB88A",
  mono:        "'DM Mono', monospace",
  serif:       "'EB Garamond', Georgia, serif",
} as const;

export const EASE = "cubic-bezier(0.16,1,0.3,1)";
export const DUR  = "0.95s";
export const ANIM = `transform ${DUR} ${EASE}`;
export const FADE = `opacity 0.75s ease`;

export const NEXUS   = { x: 195, y: 355 };
export const BASE_R  = 18;
export const EX_POS  = { x: 298, y: 178 };
export const FW_POS  = { x: 195, y: 565 };
export const ORBIT_R = 36;

export type MobileState =
  | "atlas-landing"
  | "system-awakened"
  | "system-overview"
  | "case-studies-focus"
  | "project-awakened"
  | "project-overview"
  | "project-reading"
  | "evidence-viewer"
  | "frameworks-focus"
  | "framework-awakened"
  | "framework-overview"
  | "framework-reading"
  | "framework-evidence";

export const MOBILE_STATES: readonly MobileState[] = [
  "atlas-landing", "system-awakened", "system-overview",
  "case-studies-focus", "project-awakened", "project-overview",
  "project-reading", "evidence-viewer",
  "frameworks-focus", "framework-awakened", "framework-overview",
  "framework-reading", "framework-evidence",
];

export interface Planet { angle: number; label: string; }
export interface SystemDef {
  id: string; label: string; color: string;
  orbitPath: string; planets: Planet[];
}

export const SYSTEMS: SystemDef[] = [
  {
    id: "case-studies", label: "CASE STUDIES", color: T.caseStudies,
    orbitPath: "M 395 100 C 300 10 170 60 95 178 C 20 296 -40 540 -60 960",
    planets: [
      { angle: -85, label: "AGENTIC INSURANCE" },
      { angle:   5, label: "GLOBALITY" },
      { angle:  95, label: "ORACLE" },
      { angle: 185, label: "SOVEREIGN ATLAS" },
    ],
  },
  {
    id: "experiments", label: "EXPERIMENTS", color: T.experiments,
    orbitPath: "M -5 100 C 90 10 220 60 298 178 C 370 296 430 540 450 960",
    planets: [
      { angle: -95, label: "AI EVALUATION" },
      { angle: -23, label: "AUTHORITY DRIFT" },
      { angle:  55, label: "DESIGN PHILOSOPHY" },
      { angle: 133, label: "GESTALT PRINCIPLES" },
      { angle: 211, label: "THINK LIKE A DESIGNER" },
    ],
  },
  {
    id: "frameworks", label: "FRAMEWORKS", color: T.frameworks,
    orbitPath: "M -60 430 C 40 520 140 565 195 565 C 250 565 350 520 450 430",
    planets: [
      { angle: -100, label: "AUTHORITY GRADIENT" },
      { angle:  -28, label: "RELATIONAL AI LITERACY" },
      { angle:   44, label: "MODEL DESIGN" },
      { angle:  116, label: "APPLICATION KIT" },
      { angle:  188, label: "REGENERATIVE SYSTEMS" },
      { angle:  260, label: "PRESENCE NAVIGATION" },
    ],
  },
];

export function useStarfield(ref: RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width  = W;
    canvas.height = H;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Star = {
      x: number; y: number; r: number;
      base: number; phase: number; spd: number; gold: boolean;
    };

    const stars: Star[] = Array.from({ length: 360 }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.pow(Math.random(), 2.8) * 1.5 + 0.18,
      base:  Math.random() * 0.55 + 0.08,
      phase: Math.random() * Math.PI * 2,
      spd:   Math.random() * 0.0009 + 0.0002,
      gold:  Math.random() < 0.30,
    }));

    function drawFrame(t: number) {
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = T.bg;
      ctx!.fillRect(0, 0, W, H);

      const ng = ctx!.createRadialGradient(NEXUS.x, NEXUS.y, 0, NEXUS.x, NEXUS.y, 310);
      ng.addColorStop(0,    "rgba(138,174,200,0.042)");
      ng.addColorStop(0.30, "rgba(166,139,212,0.028)");
      ng.addColorStop(0.60, "rgba(106,184,138,0.014)");
      ng.addColorStop(1,    "transparent");
      ctx!.fillStyle = ng;
      ctx!.fillRect(0, 0, W, H);

      const fg = ctx!.createRadialGradient(195, 590, 0, 195, 590, 190);
      fg.addColorStop(0, "rgba(106,184,138,0.032)");
      fg.addColorStop(1, "transparent");
      ctx!.fillStyle = fg;
      ctx!.fillRect(0, 0, W, H);

      const ug = ctx!.createRadialGradient(195, 155, 0, 195, 155, 200);
      ug.addColorStop(0,   "rgba(166,139,212,0.022)");
      ug.addColorStop(0.5, "rgba(138,174,200,0.014)");
      ug.addColorStop(1,   "transparent");
      ctx!.fillStyle = ug;
      ctx!.fillRect(0, 0, W, H);

      for (const s of stars) {
        const tw = reduceMotion ? 0 : Math.sin(t * s.spd + s.phase) * 0.22;
        const o  = Math.max(0.04, Math.min(0.88, s.base + tw));
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = s.gold
          ? `rgba(232,213,163,${o})`
          : `rgba(210,218,232,${o * 0.72})`;
        ctx!.fill();
      }
    }

    // Reduced motion preserves the atmosphere as a static field.
    if (reduceMotion) {
      drawFrame(0);
      return;
    }

    let raf = 0;
    let t = 0;

    function draw() {
      t += 16;
      drawFrame(t);
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
