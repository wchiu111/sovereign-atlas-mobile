import { useEffect, useRef, useState } from "react";
/**
 * LandingScene — atlas-landing | system-awakened | system-overview
 * Renders the full-atlas SVG and Case Studies overview surfaces.
 */

import type { MobileState } from "../components/mobileShared";
import { T, ANIM, FADE, W, H, NEXUS, BASE_R, EX_POS, FW_POS, ORBIT_R, SYSTEMS } from "../components/mobileShared";
import type { SystemDef, Planet } from "../components/mobileShared";
import AtlasUtilitySheet from "../components/AtlasUtilitySheet";

type LandingState = "atlas-landing" | "system-awakened" | "system-overview";
type CaseStudiesEntryPhase =
  | "idle"
  | "acknowledge"
  | "pulling"
  | "resolving"
  | "settled";

const CASE_STUDIES_ENTRY_DURATION = 900;
const CASE_STUDIES_PULL_EASE = "cubic-bezier(0.22,1,0.36,1)";
const PROJECT_BREATH_DURATION = 4.2;
const PROJECT_BREATH_DELAYS = [0, 0.8, 1.5, 2.2] as const;

const CASE_STUDY_PROJECTS = [
  {
    id: "agentic-insurance",
    label: "AGENTIC INSURANCE",
    color: "#D4916A",
    overview: {
      what: "A self-directed exploration of how AI-assisted tools might support claim adjusters and customers during complex insurance decisions.",
      why: "The project started from a fully agentic assumption, but deeper domain research exposed how legal constraints, professional expertise, and accountability changed where AI should stop and human judgment should begin.",
      researchFocus: "I studied claim-adjuster workflows, evidence review, jurisdictional constraints, and the boundary between AI synthesis and consequential human decision-making.",
      keyDiscovery: "AI could gather, compare, explain, and recommend without owning the final decision. In high-stakes workflows, capability does not automatically grant authority.",
    },
  },
  {
    id: "globality",
    label: "GLOBALITY",
    color: "#F4EBD0",
    overview: {
      what: "A navigation and workflow redesign spanning Globality’s home experience, project portfolio, and in-project workspace.",
      why: "The platform contained powerful procurement and AI capabilities, but users repeatedly had to reconstruct where they were, what had changed, and what action mattered next.",
      researchFocus: "How navigation, dashboards, and contextual AI could respond to the user’s current work state while preserving clarity across a complex procurement journey.",
      keyDiscovery: "Users do not experience enterprise products as a collection of pages. They experience changing states of work—and the interface must preserve orientation between them.",
    },
  },
  {
    id: "oracle",
    label: "ORACLE",
    color: "#A68BD4",
    overview: {
      what: "A Higher Education microsite that organized Oracle’s cloud products into a clearer narrative and interactive product experience.",
      why: "Visitors needed to understand how a broad and uneven product portfolio connected to their institution’s goals without absorbing every technical detail at once.",
      researchFocus: "Information hierarchy, content variability, progressive disclosure, responsive behavior, and visual storytelling across an enterprise product ecosystem.",
      keyDiscovery: "People did not need every product detail at once. A shared hierarchy and progressive disclosure could reveal complexity as it became relevant without forcing unlike products into the same content model.",
    },
  },
  {
    id: "sovereign-atlas",
    label: "SOVEREIGN ATLAS",
    color: "#E8C86D",
    overview: {
      what: "The Atlas itself—a spatial, evidence-driven portfolio connecting UX, AI literacy, systems thinking, and design engineering.",
      why: "It began as a faster way to find Echo inside the Sovereign UX Codex, then evolved into a larger question about how people discover and connect knowledge.",
      researchFocus: "Can exploration produce a different kind of understanding than search? What happens when navigation becomes part of the learning experience?",
      keyDiscovery: "Atlas was not built from a roadmap. It emerged through a chain of questions in which every solution revealed a more interesting problem underneath.",
    },
  },
] as const;

const CASE_STUDY_COLORS = CASE_STUDY_PROJECTS.map((project) => project.color);

const CASE_STUDIES_OVERVIEW = {
  what: "A portfolio of four product design engagements. Real constraints, real stakeholders, and decisions made under genuine uncertainty and time pressure.",
  why: "Design is consequential. Choices made in ambiguous situations shape outcomes more than technical execution. Process over artifacts.",
  researchFocus: "How design authority is established and maintained across situations where requirements are incomplete, stakeholders disagree, and constraints shift.",
  keyDiscovery: "Sustainable design authority emerges from clarity about process — not confidence in output. The decisions are the artifact.",
} as const;

const CASE_STUDY_FOCUS_ITEMS = [
  {
    id: "case-studies",
    label: "CASE STUDIES",
    color: T.caseStudies,
    meta: "4 PROJECTS",
    overview: CASE_STUDIES_OVERVIEW,
  },
  ...CASE_STUDY_PROJECTS.map((project, index) => ({
    ...project,
    meta: `PROJECT ${index + 1} OF 4`,
  })),
] as const;


const SYSTEM_VISUAL_SCALE = 1.18;
const SYSTEM_LABEL_SIZE = 10;
const PLANET_LABEL_SIZE = 8.5;

const CASE_STUDY_OVERVIEW_LAYOUT = [
  { x: 145, y: 175, labelX: 166, labelY: 163, anchor: "start" as const },
  { x: 306, y: 238, labelX: 327, labelY: 242, anchor: "start" as const },
  { x: 272, y: 365, labelX: 291, labelY: 379, anchor: "start" as const },
  { x: 106, y: 333, labelX: 84,  labelY: 347, anchor: "end" as const },
] as const;

const OVERVIEW_CORE = { x: 195, y: 265 } as const;
const CASE_STUDY_MINIATURE_SCALE = 0.32;


function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const CS_FOCUS: Record<LandingState, { x: number; y: number; orbitR: number; opacity: number }> = {
  "atlas-landing":  { x: 95,  y: 178, orbitR: 36, opacity: 1    },
  "system-awakened":{ x: 195, y: 250, orbitR: 72, opacity: 1    },
  "system-overview":{ x: 195, y: 82,  orbitR: 24, opacity: 0.45 },
};

const CTX_OP: Record<LandingState, number> = {
  "atlas-landing": 1,
  "system-awakened": 0,
  "system-overview": 0,
};
const NEXUS_OP: Record<LandingState, number> = {
  "atlas-landing": 1,
  "system-awakened": 0,
  "system-overview": 0,
};
const CS_ARC_OP: Record<LandingState, number> = {
  "atlas-landing": 0.20, "system-awakened": 0,    "system-overview": 0,
};
const CTX_ARC_OP: Record<LandingState, number> = {
  "atlas-landing": 0.20,
  "system-awakened": 0,
  "system-overview": 0,
};

function NexusNode({ op }: { op: number }) {
  return (
    <g style={{ transform: `translate(${NEXUS.x}px,${NEXUS.y}px)`, opacity: op, transition: FADE }}>
      <circle r={130} fill="none" stroke={T.identityGold} strokeWidth={0.3} opacity={0.045} />
      <circle r={96}  fill="none" stroke={T.identityGold} strokeWidth={0.4} opacity={0.075} />
      <circle r={68}  fill="none" stroke={T.identityGold} strokeWidth={0.5} opacity={0.11}  />
      <circle r={60}  fill="rgba(232,213,163,0.028)" />
      <circle r={33}  fill="rgba(232,213,163,0.065)" />
      <circle r={27}  fill="none" stroke={T.identityGold} strokeWidth={0.8} opacity={0.17} />
      <circle r={17}  fill="rgba(232,213,163,0.12)" />
      <circle r={8}   fill={T.identityGold} />
      <text y={-46} textAnchor="middle" fontFamily={T.serif} fontSize={10.5} fontWeight={600}
        letterSpacing="0.22em" fill={T.accentGold} opacity={0.78}>
        SOVEREIGN DESIGN
      </text>
    </g>
  );
}

function PlanetCluster({
  planets,
  orbitR,
  color,
  awakened,
  dimmed,
  planetColors,
  baseLayoutTargets,
  baseLayoutScale = 1,
  resolveTargets,
  resolveT = 0,
}: {
  planets: Planet[];
  orbitR: number;
  color: string;
  awakened: boolean;
  dimmed: boolean;
  planetColors?: readonly string[];
  baseLayoutTargets?: readonly { x: number; y: number }[];
  baseLayoutScale?: number;
  resolveTargets?: readonly { x: number; y: number }[];
  resolveT?: number;
}) {
  const ringScale  = orbitR / 36;
  const showLabels = awakened && orbitR >= 44 && !resolveTargets && !baseLayoutTargets;
  return (
    <g>
      {!baseLayoutTargets && (
        <g style={{ transform: `scale(${ringScale})`, transition: ANIM }}>
          <circle
            r={36}
            fill="none"
            stroke={color}
            strokeWidth={0.4}
            strokeDasharray="2.5 5"
            opacity={dimmed ? 0.04 : awakened ? 0.22 : 0.09}
            style={{ transition: FADE }}
          />
        </g>
      )}
      {planets.map((p, i) => {
        const planetColor = planetColors?.[i] ?? color;
        const rad = (p.angle * Math.PI) / 180;
        const authoredBase = baseLayoutTargets?.[i];
        const orbitX = authoredBase
          ? authoredBase.x * baseLayoutScale
          : Math.cos(rad) * orbitR;
        const orbitY = authoredBase
          ? authoredBase.y * baseLayoutScale
          : Math.sin(rad) * orbitR;
        const target = resolveTargets?.[i];
        const lpx = target ? lerp(orbitX, target.x, resolveT) : orbitX;
        const lpy = target ? lerp(orbitY, target.y, resolveT) : orbitY;

        // Label direction follows the actual node vector when using authored geometry.
        const vectorLength = Math.max(1, Math.hypot(lpx, lpy));
        const ldx = authoredBase ? lpx / vectorLength : Math.cos(rad);
        const ldy = authoredBase ? lpy / vectorLength : Math.sin(rad);
        const ta  = ldx > 0.28 ? "start" : ldx < -0.28 ? "end" : "middle";
        const db  = ldy > 0.28 ? "hanging" : ldy < -0.28 ? "auto" : "middle";
        return (
          <g
            key={i}
            style={{
              transform: `translate(${lpx}px,${lpy}px)`,
              transition: resolveTargets ? "none" : ANIM,
            }}
          >
            <circle r={(awakened ? 9.5 : 5.5) * SYSTEM_VISUAL_SCALE} fill={planetColor}
              opacity={dimmed ? 0.03 : awakened ? 0.16 : 0.07} style={{ transition: FADE }} />
            <circle r={(awakened ? 3 : 1.7) * SYSTEM_VISUAL_SCALE} fill={planetColor}
              opacity={dimmed ? 0.18 : awakened ? 1 : 0.52} style={{ transition: FADE }} />
            {showLabels && (
              <text x={ldx * 11} y={ldy * 11}
                textAnchor={ta} dominantBaseline={db}
                fontFamily={T.mono} fontSize={PLANET_LABEL_SIZE} letterSpacing="0.08em" fill={planetColor} opacity={0.88}>
                {p.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

function SystemNode({
  sys,
  cx,
  cy,
  orbitR,
  awakened,
  dimmed,
  showLabel,
  planetColors,
  baseLayoutTargets,
  baseLayoutScale = 1,
  resolveTargets,
  resolveT = 0,
}: {
  sys: SystemDef;
  cx: number;
  cy: number;
  orbitR: number;
  awakened: boolean;
  dimmed: boolean;
  showLabel: boolean;
  planetColors?: readonly string[];
  baseLayoutTargets?: readonly { x: number; y: number }[];
  baseLayoutScale?: number;
  resolveTargets?: readonly { x: number; y: number }[];
  resolveT?: number;
}) {
  const atmoR  = (awakened ? BASE_R * 1.45 : BASE_R * 0.82) * SYSTEM_VISUAL_SCALE;
  const outerR = (awakened ? BASE_R * 3.2  : BASE_R * 1.9) * SYSTEM_VISUAL_SCALE;
  const coreR  = (awakened ? BASE_R * 0.52 : BASE_R * 0.36) * SYSTEM_VISUAL_SCALE;
  return (
    <g
      style={{
        transform: `translate(${cx}px,${cy}px)`,
        transition: resolveTargets ? "none" : ANIM,
      }}
    >
      <PlanetCluster
        planets={sys.planets}
        orbitR={orbitR}
        color={sys.color}
        awakened={awakened}
        dimmed={dimmed}
        planetColors={planetColors}
        baseLayoutTargets={baseLayoutTargets}
        baseLayoutScale={baseLayoutScale}
        resolveTargets={resolveTargets}
        resolveT={resolveT}
      />
      <circle r={outerR} fill={sys.color} opacity={awakened ? 0.08 : 0.032} style={{ transition: FADE }} />
      <circle r={atmoR} fill={sys.color} opacity={awakened ? 0.18 : 0.082} style={{ transition: FADE }} />
      <circle r={28 * SYSTEM_VISUAL_SCALE} fill="none" stroke={sys.color} strokeWidth={0.5} opacity={awakened ? 0.32 : 0.13} style={{ transition: FADE }} />
      <circle r={42 * SYSTEM_VISUAL_SCALE} fill="none" stroke={sys.color} strokeWidth={0.3} opacity={awakened ? 0.18 : 0.07} style={{ transition: FADE }} />
      <circle r={coreR} fill={sys.color} opacity={awakened ? 1 : 0.88} style={{ transition: FADE }} />
      {showLabel && (
        <text y={BASE_R * 2.2 + 14} textAnchor="middle" fontFamily={T.mono} fontSize={SYSTEM_LABEL_SIZE} letterSpacing="0.14em" fill={sys.color} opacity={0.74}>
          {sys.label}
        </text>
      )}
    </g>
  );
}



function CaseStudyOverviewConstellation({
  selectedId,
  onSelect,
  transitionPreview = false,
  labelsVisible = true,
}: {
  selectedId: (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"];
  onSelect: (id: (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"]) => void;
  transitionPreview?: boolean;
  labelsVisible?: boolean;
}) {
  const caseStudiesSelected = selectedId === "case-studies";

  return (
    <g>
      <path
        d="M92 344 C118 242 160 174 232 190 C304 205 332 274 294 368"
        fill="none"
        stroke={T.caseStudies}
        strokeWidth={0.55}
        strokeDasharray="4 7"
        opacity={transitionPreview ? 0.015 : 0.14}
      />
      <path
        d="M118 300 C172 222 248 220 315 278"
        fill="none"
        stroke={T.caseStudies}
        strokeWidth={0.35}
        strokeDasharray="2 6"
        opacity={transitionPreview ? 0.008 : 0.08}
      />

      <g
        style={{
          transform: `translate(${OVERVIEW_CORE.x}px,${OVERVIEW_CORE.y}px) scale(1)`,
          transformOrigin: "center",
          transition: `transform 260ms ${CASE_STUDIES_PULL_EASE}, opacity 220ms ease`,
          cursor: transitionPreview ? "default" : "pointer",
          opacity: transitionPreview ? 0.86 : caseStudiesSelected ? 1 : 0.32,
        }}
        onClick={() => { if (!transitionPreview) onSelect("case-studies"); }}
      >
        <g
          className={
            transitionPreview
              ? undefined
              : caseStudiesSelected
              ? "atlas-core-selected"
              : "atlas-node-available"
          }
          style={{
            animationDelay: caseStudiesSelected ? "0s" : "0.45s",
          }}
        >
          <circle r={74} fill={T.caseStudies} opacity={caseStudiesSelected ? 0.11 : 0.04} />
          <circle r={48} fill={T.caseStudies} opacity={caseStudiesSelected ? 0.20 : 0.08} />
          <circle r={57} fill="none" stroke={T.caseStudies} strokeWidth={caseStudiesSelected ? 0.75 : 0.45} opacity={caseStudiesSelected ? 0.38 : 0.16} />
          <circle r={34} fill="none" stroke={T.caseStudies} strokeWidth={0.35} opacity={caseStudiesSelected ? 0.24 : 0.10} />
          <circle r={14} fill={T.caseStudies} opacity={caseStudiesSelected ? 1 : 0.58} />
        </g>
        <circle r={34} fill="transparent" pointerEvents="all" />
      </g>

      {CASE_STUDY_PROJECTS.map((project, index) => {
        const layout = CASE_STUDY_OVERVIEW_LAYOUT[index];
        const isSelected = selectedId === project.id;
        const nodeOpacity = isSelected ? 1 : caseStudiesSelected ? 0.42 : 0.30;
        const lines =
          project.label === "AGENTIC INSURANCE"
            ? ["AGENTIC", "INSURANCE"]
            : project.label === "SOVEREIGN ATLAS"
            ? ["SOVEREIGN", "ATLAS"]
            : [project.label];

        return (
          <g
            key={project.id}
            onClick={() => { if (!transitionPreview) onSelect(project.id); }}
            style={{ cursor: "pointer", opacity: nodeOpacity, transition: FADE }}
          >
            <g
              style={{
                transform: `translate(${layout.x}px,${layout.y}px) scale(1)`,
                transformOrigin: "center",
                transition: `transform 280ms ${CASE_STUDIES_PULL_EASE}`,
              }}
            >
              <g
                className={
                  transitionPreview
                    ? undefined
                    : isSelected
                    ? "atlas-node-selected"
                    : "atlas-node-available"
                }
                style={{
                  animationDuration: isSelected
                    ? "5.8s"
                    : `${PROJECT_BREATH_DURATION}s`,
                  animationDelay: transitionPreview
                    ? "0s"
                    : `${PROJECT_BREATH_DELAYS[index]}s`,
                }}
              >
                <circle r={isSelected ? 30 : 24} fill={project.color} opacity={isSelected ? 0.10 : 0.04} />
                <circle r={isSelected ? 18 : 14} fill={project.color} opacity={isSelected ? 0.20 : 0.10} />
                <circle r={isSelected ? 21 : 17} fill="none" stroke={project.color} strokeWidth={isSelected ? 0.7 : 0.45} opacity={isSelected ? 0.40 : 0.18} />
                <circle r={isSelected ? 7.5 : 6.5} fill={project.color} opacity={isSelected ? 1 : 0.74} />
              </g>
              <circle r={24} fill="transparent" pointerEvents="all" />
            </g>

            <text
              x={layout.labelX}
              y={layout.labelY}
              textAnchor={layout.anchor}
              fontFamily={T.mono}
              fontSize={10.5}
              letterSpacing="0.08em"
              fill={project.color}
              opacity={transitionPreview || !labelsVisible ? 0 : isSelected ? 1 : caseStudiesSelected ? 0.86 : 0.78}
              style={{
                transition: "opacity 240ms ease",
              }}
            >
              {lines.map((line, lineIndex) => (
                <tspan key={line} x={layout.labelX} dy={lineIndex === 0 ? 0 : 12}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function CaseStudyProjectFocus({
  activeIndex,
  onSelect,
  onSwipe,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  onSwipe: (direction: -1 | 1) => void;
}) {
  const dragStartX = useRef<number | null>(null);
  const active = CASE_STUDY_FOCUS_ITEMS[activeIndex];
  const len = CASE_STUDY_FOCUS_ITEMS.length;

  function handlePointerDown(event: React.PointerEvent<SVGGElement>) {
    dragStartX.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handlePointerUp(event: React.PointerEvent<SVGGElement>) {
    if (dragStartX.current == null) return;
    const dx = event.clientX - dragStartX.current;
    dragStartX.current = null;
    if (Math.abs(dx) < 28) return;
    onSwipe(dx < 0 ? 1 : -1);
  }

  const previous = CASE_STUDY_FOCUS_ITEMS[(activeIndex - 1 + len) % len];
  const next = CASE_STUDY_FOCUS_ITEMS[(activeIndex + 1) % len];

  return (
    <g
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "pan-y" }}
    >
      <text
        x={195}
        y={118}
        textAnchor="middle"
        fontFamily={T.mono}
        fontSize={10.5}
        letterSpacing="0.15em"
        fill={active.color}
        opacity={0.98}
      >
        {active.label}
      </text>

      {[
        { item: previous, x: -2, offset: -1 },
        { item: active, x: 195, offset: 0 },
        { item: next, x: 392, offset: 1 },
      ].map(({ item, x, offset }) => {
        const isActive = offset === 0;
        return (
          <g
            key={`${item.id}-${offset}`}
            style={{
              transform: `translate(${x}px,250px)`,
              transition: ANIM,
              cursor: "pointer",
            }}
            onClick={() => {
              if (isActive) {
                if (activeIndex > 0) onSelect(activeIndex);
                return;
              }
              onSwipe(offset < 0 ? -1 : 1);
            }}
          >
            <circle
              r={isActive ? 72 : 32}
              fill={item.color}
              opacity={isActive ? 0.11 : 0.05}
            />
            <circle
              r={isActive ? 45 : 18}
              fill={item.color}
              opacity={isActive ? 0.22 : 0.12}
            />
            <circle
              r={isActive ? 54 : 22}
              fill="none"
              stroke={item.color}
              strokeWidth={0.55}
              strokeDasharray={isActive ? "3 6" : undefined}
              opacity={isActive ? 0.34 : 0.22}
            />
            <circle
              r={isActive ? 15 : 7}
              fill={item.color}
              opacity={isActive ? 1 : 0.9}
            />
            {!isActive && (
              <text
                x={offset < 0 ? 18 : -18}
                y={3}
                textAnchor={offset < 0 ? "start" : "end"}
                fontFamily={T.mono}
                fontSize={8}
                letterSpacing="0.08em"
                fill={item.color}
                opacity={0.78}
              >
                {item.label}
              </text>
            )}
            <circle r={isActive ? 34 : 30} fill="transparent" pointerEvents="all" />
          </g>
        );
      })}

      <g transform="translate(195,352)">
        {CASE_STUDY_FOCUS_ITEMS.map((item, i) => (
          <circle
            key={item.id}
            cx={(i - 2) * 14}
            cy={0}
            r={i === activeIndex ? 3.2 : 2.5}
            fill={T.caseStudies}
            opacity={i === activeIndex ? 0.95 : 0.34}
          />
        ))}
      </g>
    </g>
  );
}

function OverviewInitial({ onExplore }: { onExplore: () => void }) {
  const c = T.caseStudies;
  return (
    <div
      style={{
        position: "absolute",
        top: 462,
        bottom: 0,
        left: 0,
        right: 0,
        boxSizing: "border-box",
        borderTop: `0.5px solid rgba(138,174,200,0.28)`,
        background: "rgba(5,5,10,0.94)",
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        padding: "22px 28px 28px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 20,
            fontWeight: 600,
            letterSpacing: "0.14em",
            color: c,
            opacity: 0.96,
          }}
        >
          CASE STUDIES
        </div>
      </div>

      <div
        style={{
          fontFamily: T.mono,
          fontSize: 8,
          letterSpacing: "0.18em",
          color: T.accentGold,
          opacity: 0.82,
          marginBottom: 14,
        }}
      >
        4 PROJECTS
      </div>

      <div
        style={{
          height: 0.5,
          background: "rgba(232,213,163,0.12)",
          marginBottom: 15,
        }}
      />

      <div
        style={{
          fontFamily: T.serif,
          fontSize: 16,
          fontWeight: 600,
          color: T.identityGold,
          opacity: 0.94,
          lineHeight: 1.36,
          marginBottom: 12,
        }}
      >
        See how decisions became outcomes.
      </div>

      <div
        style={{
          fontFamily: T.serif,
          fontSize: 13,
          color: T.body,
          opacity: 0.86,
          lineHeight: 1.48,
          marginBottom: 10,
        }}
      >
        Each case study traces a project through its context, constraints,
        design decisions, evidence, and results.
      </div>

      <div
        style={{
          fontFamily: T.serif,
          fontSize: 13,
          color: T.body,
          opacity: 0.86,
          lineHeight: 1.48,
        }}
      >
        Enter a system to understand not only what was created, but why it took
        the form it did.
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 15,
          borderTop: "0.5px solid rgba(138,174,200,0.12)",
        }}
      >
        <div
          onClick={onExplore}
          style={{
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            width: "fit-content",
            paddingRight: 18,
            fontFamily: T.mono,
            fontSize: 10,
            letterSpacing: "0.18em",
            color: c,
            opacity: 0.96,
            cursor: "pointer",
          }}
        >
          EXPLORE →
        </div>
      </div>
    </div>
  );
}

function ProjectPreviewDrawer({
  item,
  phase,
  onExplore,
  arrivalVisible = true,
}: {
  item: (typeof CASE_STUDY_FOCUS_ITEMS)[number];
  phase: "open" | "closing" | "opening";
  onExplore: () => void;
  arrivalVisible?: boolean;
}) {
  const isCaseStudies = item.id === "case-studies";
  const translateY =
    phase === "closing" ? "100%" : arrivalVisible ? "0%" : "18px";
  const opacity =
    phase === "closing" ? 0.08 : arrivalVisible ? 1 : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: 470,
        bottom: 0,
        left: 0,
        right: 0,
        boxSizing: "border-box",
        borderTop: `1px solid ${isCaseStudies ? T.caseStudies : item.color}44`,
        background: "rgba(5,5,10,0.96)",
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        padding: "22px 28px 26px",
        display: "flex",
        flexDirection: "column",
        transform: `translateY(${translateY})`,
        opacity,
        transition:
          phase === "closing"
            ? "transform 240ms cubic-bezier(0.4,0,0.2,1), opacity 180ms ease"
            : "transform 360ms cubic-bezier(0.22,1,0.36,1), opacity 260ms ease",
        willChange: "transform, opacity",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 16, marginBottom: 12 }}>
        <div style={{ fontFamily: T.serif, fontSize: 22, fontWeight: 600, letterSpacing: "0.10em", color: isCaseStudies ? T.caseStudies : item.color, opacity: 0.98, lineHeight: 1.1 }}>
          {item.label}
        </div>
        {isCaseStudies && (
          <div
            style={{
              flexShrink: 0,
              fontFamily: T.mono,
              fontSize: 9,
              letterSpacing: "0.14em",
              color: T.accentGold,
              opacity: 0.62,
            }}
          >
            4 PROJECTS
          </div>
        )}
      </div>

      <div style={{ height: 0.5, background: "rgba(138,174,200,0.14)", marginBottom: 16 }} />

      {isCaseStudies ? (
        <>
          <div style={{ fontFamily: T.serif, fontSize: 15, fontWeight: 600, color: T.identityGold, lineHeight: 1.35, marginBottom: 14 }}>
            See how decisions became outcomes.
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 13, color: T.body, opacity: 0.90, lineHeight: 1.5, marginBottom: 12 }}>
            Each case study traces a project through its context, constraints, design decisions, evidence, and results.
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 13, color: T.body, opacity: 0.86, lineHeight: 1.48 }}>
            Enter a system to understand not only what was created, but why it took the form it did.
          </div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              fontFamily: T.serif,
              fontSize: 14.5,
              color: "#F0E9D8",
              opacity: 0.90,
              lineHeight: 1.56,
              margin: 0,
            }}
          >
            {item.overview.what}
          </div>

          <div
            style={{
              fontFamily: T.serif,
              fontSize: 14.5,
              color: "#F0E9D8",
              opacity: 0.84,
              lineHeight: 1.56,
              margin: 0,
            }}
          >
            {item.overview.why}
          </div>
        </div>
      )}

      {!isCaseStudies && (
        <div
          style={{
            marginTop: "auto",
            paddingTop: 18,
            borderTop: "0.5px solid rgba(240,233,216,0.10)",
          }}
        >
          <div
            onClick={onExplore}
            style={{
              minHeight: 44,
              display: "flex",
              alignItems: "center",
              width: "fit-content",
              paddingRight: 18,
              fontFamily: T.mono,
              fontSize: 10,
              letterSpacing: "0.18em",
              color: item.color,
              opacity: 0.96,
              cursor: "pointer",
            }}
          >
            EXPLORE →
          </div>
        </div>
      )}
    </div>
  );
}

function OverviewScrolled({
  item,
}: {
  item: (typeof CASE_STUDY_FOCUS_ITEMS)[number];
}) {
  const sections = [
    { label: "WHAT", body: item.overview.what },
    { label: "WHY", body: item.overview.why },
    { label: "RESEARCH FOCUS", body: item.overview.researchFocus },
    { label: "KEY DISCOVERY", body: item.overview.keyDiscovery },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 462,
        bottom: 0,
        left: 0,
        right: 0,
        boxSizing: "border-box",
        borderTop: `1px solid ${item.id === "case-studies" ? T.caseStudies : item.color}44`,
        background: "rgba(5,5,10,0.94)",
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        padding: "20px 28px 28px",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: 16,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 21.5,
            fontWeight: 600,
            letterSpacing: "0.10em",
            color: item.id === "case-studies" ? T.caseStudies : item.color,
            opacity: 0.98,
            lineHeight: 1.1,
          }}
        >
          {item.label}
        </div>
        <div
          style={{
            flexShrink: 0,
            fontFamily: T.mono,
            fontSize: 9,
            letterSpacing: "0.14em",
            color: T.accentGold,
            opacity: 0.80,
          }}
        >
          {item.meta}
        </div>
      </div>

      <div
        style={{
          height: 0.5,
          background: "rgba(138,174,200,0.14)",
          marginBottom: 16,
        }}
      />

      {sections.map(({ label, body }) => (
        <div key={label} style={{ marginBottom: label === "KEY DISCOVERY" ? 22 : 20 }}>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              letterSpacing: "0.18em",
              color: T.accentGold,
              opacity: 0.76,
              marginBottom: 7,
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontFamily: T.serif,
              fontSize: 14.5,
              color: T.body,
              opacity: 0.9,
              lineHeight: 1.62,
            }}
          >
            {body}
          </div>
        </div>
      ))}
    </div>
  );
}

interface LandingSceneProps {
  state: LandingState;
  onSelectCaseStudies: () => void;
  onSelectFrameworks: () => void;
  onOverviewExpand: () => void;
  onExplore: () => void;
  onBack: () => void;
  onOverviewBack: () => void;
  onSelectProject?: () => void;
}

export default function LandingScene({ state, onSelectCaseStudies, onSelectFrameworks, onOverviewExpand, onExplore, onBack, onOverviewBack, onSelectProject }: LandingSceneProps) {
  const [activeFocusIndex, setActiveFocusIndex] = useState(0);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<(typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"]>("case-studies");
  const [drawerItemId, setDrawerItemId] = useState<(typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"]>("case-studies");
  const [drawerPhase, setDrawerPhase] = useState<"open" | "closing" | "opening">("open");
  const [entryPhase, setEntryPhase] =
    useState<CaseStudiesEntryPhase>("idle");
  const [overviewChromeVisible, setOverviewChromeVisible] = useState(false);
  const [overviewLabelsVisible, setOverviewLabelsVisible] = useState(false);
  const entryTimersRef = useRef<number[]>([]);
  const csState  = CS_FOCUS[state];
  const ctxOp    = CTX_OP[state];
  const nexusOp  = NEXUS_OP[state];
  const isActive = state !== "atlas-landing";
  const cs = SYSTEMS[0];
  const ex = SYSTEMS[1];
  const fw = SYSTEMS[2];

  useEffect(() => {
    return () => {
      entryTimersRef.current.forEach(window.clearTimeout);
      entryTimersRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (state === "atlas-landing") {
      setOverviewChromeVisible(false);
      setOverviewLabelsVisible(false);
    }

    if (state === "system-awakened") {
      if (entryPhase === "idle") setEntryPhase("settled");

      // Geometry lands first. Labels and chrome enter afterward.
      const labelsTimer = window.setTimeout(() => {
        setOverviewLabelsVisible(true);
      }, 110);
      const chromeTimer = window.setTimeout(() => {
        setOverviewChromeVisible(true);
      }, 170);

      return () => {
        window.clearTimeout(labelsTimer);
        window.clearTimeout(chromeTimer);
      };
    }

    if (state !== "atlas-landing" && state !== "system-awakened") {
      entryTimersRef.current.forEach(window.clearTimeout);
      entryTimersRef.current = [];
      setEntryPhase("idle");
      setOverviewChromeVisible(false);
      setOverviewLabelsVisible(false);
    }
  }, [state, entryPhase]);

  const enterCaseStudies = () => {
    entryTimersRef.current.forEach(window.clearTimeout);
    entryTimersRef.current = [];

    setEntryPhase("acknowledge");

    entryTimersRef.current.push(
      window.setTimeout(() => setEntryPhase("pulling"), 110),
      window.setTimeout(() => setEntryPhase("resolving"), 560),
      window.setTimeout(() => {
        setEntryPhase("settled");
        onSelectCaseStudies();
      }, CASE_STUDIES_ENTRY_DURATION),
    );
  };

  const drawerItem =
    CASE_STUDY_FOCUS_ITEMS.find((item) => item.id === drawerItemId) ??
    CASE_STUDY_FOCUS_ITEMS[0];

  const selectCaseStudyOverviewItem = (
    id: (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"],
  ) => {
    if (id === selectedCaseStudyId || drawerPhase === "closing") return;

    setSelectedCaseStudyId(id);
    setDrawerPhase("closing");

    window.setTimeout(() => {
      setDrawerItemId(id);
      setDrawerPhase("opening");

      window.setTimeout(() => {
        setDrawerPhase("open");
      }, 320);
    }, 240);
  };

  const cycleProject = (direction: -1 | 1) => {
    setActiveFocusIndex((current) => {
      const next = current + direction;
      const len = CASE_STUDY_FOCUS_ITEMS.length;
      return (next + len) % len;
    });
  };

  const entryInProgress =
    state === "atlas-landing" && entryPhase !== "idle" && entryPhase !== "settled";

  const entryProgress = (() => {
    switch (entryPhase) {
      case "acknowledge":
        return 0.16;
      case "pulling":
        return 0.66;
      case "resolving":
        return 0.94;
      case "settled":
        return 1;
      default:
        return 0;
    }
  })();

  const resolvingOverview = state === "atlas-landing" && entryPhase === "resolving";
  const [resolveT, setResolveT] = useState(0);

  const animatedCsX = 95 + (195 - 95) * entryProgress;
  const pullTargetY = 250;
  const baseAnimatedCsY = 178 + (pullTargetY - 178) * entryProgress;
  const animatedCsY =
    entryPhase === "resolving"
      ? lerp(baseAnimatedCsY, OVERVIEW_CORE.y, resolveT)
      : baseAnimatedCsY;
  const animatedCsOrbitR = 36 + (72 - 36) * entryProgress;
  const contextEntryOpacity = entryInProgress ? Math.max(0, 1 - entryProgress * 1.2) : ctxOp;
  const selectedSystemScale =
    entryPhase === "acknowledge"
      ? 1.035
      : entryPhase === "pulling"
      ? 1.12
      : entryPhase === "resolving"
      ? lerp(1.18, 1, resolveT)
      : 1;

  useEffect(() => {
    if (!resolvingOverview) {
      setResolveT(0);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const duration = 320;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      // Smoothstep keeps the geometry calm at both ends.
      const eased = raw * raw * (3 - 2 * raw);
      setResolveT(eased);
      if (raw < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [resolvingOverview]);

  const travelingSystemOpacity = resolvingOverview ? lerp(1, 0.12, resolveT) : 1;
  const overviewResolveOpacity = resolvingOverview ? lerp(0.06, 1, resolveT) : 0;
  const overviewResolveScale = resolvingOverview ? lerp(0.94, 1, resolveT) : 0.92;

  const overviewResolveTargets = CASE_STUDY_OVERVIEW_LAYOUT.map((layout) => ({
    x: layout.x - OVERVIEW_CORE.x,
    y: layout.y - OVERVIEW_CORE.y,
  }));

  // The top-level Case Studies cluster is a compressed miniature of the
  // overview constellation. This preserves project-to-project relationships
  // before, during, and after the pull-in.
  const caseStudyMiniatureTargets = overviewResolveTargets;

  const contextRecede = (() => {
    switch (entryPhase) {
      case "acknowledge":
        return { opacity: 0.52, scale: 0.992, blur: 0 };
      case "pulling":
        return { opacity: 0.015, scale: 0.978, blur: 0 };
      case "resolving":
        return { opacity: 0, scale: 0.965, blur: 0 };
      default:
        return { opacity: 1, scale: 1, blur: 0 };
    }
  })();

  const nexusRecede = (() => {
    switch (entryPhase) {
      case "acknowledge":
        return { opacity: 0.56, scale: 0.996 };
      case "pulling":
        return { opacity: 0.01, scale: 0.984 };
      case "resolving":
        return { opacity: 0, scale: 0.972 };
      default:
        return { opacity: 1, scale: 1 };
    }
  })();

  const orbitRecedeOpacity = (() => {
    switch (entryPhase) {
      case "acknowledge":
        return 0.07;
      case "pulling":
        return 0;
      case "resolving":
        return 0;
      default:
        return null;
    }
  })();

  return (
    <>
      <style>{`
        @keyframes atlasAvailableBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.82;
          }
          50% {
            transform: scale(1.032);
            opacity: 1;
          }
        }

        @keyframes atlasSelectedBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.94;
          }
          50% {
            transform: scale(1.012);
            opacity: 1;
          }
        }

        @keyframes atlasCoreBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.96;
          }
          50% {
            transform: scale(1.008);
            opacity: 1;
          }
        }

        .atlas-node-available {
          transform-box: fill-box;
          transform-origin: center;
          animation: atlasAvailableBreath 4.2s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .atlas-node-selected {
          transform-box: fill-box;
          transform-origin: center;
          animation: atlasSelectedBreath 5.8s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .atlas-core-selected {
          transform-box: fill-box;
          transform-origin: center;
          animation: atlasCoreBreath 6.2s ease-in-out infinite;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .mobile-atlas-entry-motion {
            transition-duration: 0.01ms !important;
          }

          .atlas-node-available,
          .atlas-node-selected,
          .atlas-core-selected {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }} aria-hidden>
        {[22, 67, 112, 157, 202, 247, 292, 337].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return <line key={deg} x1={NEXUS.x} y1={NEXUS.y} x2={NEXUS.x + Math.cos(r) * 295} y2={NEXUS.y + Math.sin(r) * 295}
            stroke={T.gold}
            strokeWidth={0.28}
            opacity={
              entryInProgress
                ? entryPhase === "acknowledge"
                  ? 0.018
                  : 0
                : isActive
                ? 0.014
                : 0.036
            }
            style={{ transition: "opacity 220ms ease" }}
          />;
        })}
        {entryInProgress && (
          <rect
            x={0}
            y={0}
            width={W}
            height={H}
            fill="rgba(5,5,10,0.22)"
            opacity={entryPhase === "acknowledge" ? 0.16 : entryPhase === "pulling" ? 0.34 : 0.38}
            style={{ transition: "opacity 260ms ease" }}
            pointerEvents="none"
          />
        )}

        <path
          d={cs.orbitPath}
          fill="none"
          stroke={cs.color}
          strokeWidth={0.55}
          strokeDasharray="4.5 7"
          opacity={
            entryInProgress
              ? entryPhase === "acknowledge"
                ? 0.13
                : entryPhase === "pulling"
                ? 0.045
                : 0
              : CS_ARC_OP[state]
          }
          style={{ transition: "opacity 360ms ease" }}
        />
        <path
          d={ex.orbitPath}
          fill="none"
          stroke={ex.color}
          strokeWidth={0.55}
          strokeDasharray="4.5 7"
          opacity={entryInProgress ? (orbitRecedeOpacity ?? CTX_ARC_OP[state]) : CTX_ARC_OP[state]}
          style={{ transition: "opacity 360ms ease" }}
        />
        <path
          d={fw.orbitPath}
          fill="none"
          stroke={fw.color}
          strokeWidth={0.55}
          strokeDasharray="4.5 7"
          opacity={entryInProgress ? (orbitRecedeOpacity ?? CTX_ARC_OP[state]) : CTX_ARC_OP[state]}
          style={{ transition: "opacity 360ms ease" }}
        />
        <g
          style={{
            opacity: entryInProgress ? nexusRecede.opacity : nexusOp,
            transform: `scale(${entryInProgress ? nexusRecede.scale : 1})`,
            transformOrigin: `${NEXUS.x}px ${NEXUS.y}px`,
            transition: `opacity 260ms ease, transform 520ms ${CASE_STUDIES_PULL_EASE}`,
          }}
        >
          <NexusNode op={1} />
        </g>
        <g
          style={{
            opacity: entryInProgress ? contextRecede.opacity : contextEntryOpacity,
            transform: `scale(${entryInProgress ? contextRecede.scale : 1})`,
            transformOrigin: `${EX_POS.x}px ${EX_POS.y}px`,
            transition: `opacity 260ms ease, transform 560ms ${CASE_STUDIES_PULL_EASE}`,
          }}
        >
          <SystemNode
            sys={ex}
            cx={EX_POS.x}
            cy={EX_POS.y}
            orbitR={ORBIT_R}
            awakened={false}
            dimmed={entryInProgress || isActive}
            showLabel={!isActive}
          />
        </g>
        <g
          style={{
            opacity: entryInProgress ? contextRecede.opacity : contextEntryOpacity,
            transform: `scale(${entryInProgress ? contextRecede.scale : 1})`,
            transformOrigin: `${FW_POS.x}px ${FW_POS.y}px`,
            transition: `opacity 280ms ease, transform 600ms ${CASE_STUDIES_PULL_EASE}`,
          }}
        >
          <SystemNode
            sys={fw}
            cx={FW_POS.x}
            cy={FW_POS.y}
            orbitR={ORBIT_R}
            awakened={false}
            dimmed={entryInProgress || isActive}
            showLabel={!isActive}
          />
        </g>
                {state === "atlas-landing" && (
          <g
            style={{
              opacity: travelingSystemOpacity,
              transform: `scale(${selectedSystemScale})`,
              transformOrigin: `${animatedCsX}px ${animatedCsY}px`,
              transition: resolvingOverview
                ? "opacity 180ms ease"
                : `transform 760ms ${CASE_STUDIES_PULL_EASE}, opacity 180ms ease`,
            }}
          >
            <SystemNode
              sys={cs}
              cx={entryInProgress ? animatedCsX : csState.x}
              cy={entryInProgress ? animatedCsY : csState.y}
              orbitR={entryInProgress ? animatedCsOrbitR : csState.orbitR}
              awakened={entryInProgress}
              dimmed={false}
              showLabel={!entryInProgress}
              planetColors={CASE_STUDY_COLORS}
              baseLayoutTargets={caseStudyMiniatureTargets}
              baseLayoutScale={CASE_STUDY_MINIATURE_SCALE}
              resolveTargets={resolvingOverview ? overviewResolveTargets : undefined}
              resolveT={resolvingOverview ? resolveT : 0}
            />
          </g>
        )}
        {resolvingOverview && (
          <g
            style={{
              opacity: resolveT < 0.82 ? 0 : overviewResolveOpacity,
              transform: `scale(${overviewResolveScale})`,
              transformOrigin: `${OVERVIEW_CORE.x}px ${OVERVIEW_CORE.y}px`,
              transition: "opacity 120ms ease",
              pointerEvents: "none",
            }}
          >
            <CaseStudyOverviewConstellation
              selectedId="case-studies"
              onSelect={() => {}}
              transitionPreview
              labelsVisible={false}
            />
          </g>
        )}
        {state === "system-awakened" && (
          <g
            style={{
              opacity: 1,
              transform: "scale(1)",
              transformOrigin: "195px 265px",
              transition: `opacity 180ms ease, transform 220ms ${CASE_STUDIES_PULL_EASE}`,
            }}
          >
            <CaseStudyOverviewConstellation
              selectedId={selectedCaseStudyId}
              onSelect={selectCaseStudyOverviewItem}
              labelsVisible={overviewLabelsVisible}
            />
          </g>
        )}
        {state === "atlas-landing" && (
          <>
            <circle cx={95} cy={178} r={56} fill="transparent" onClick={enterCaseStudies} style={{ cursor: entryInProgress ? "default" : "pointer", pointerEvents: entryInProgress ? "none" : "auto" }} />
            <circle cx={FW_POS.x} cy={FW_POS.y} r={56} fill="transparent" onClick={onSelectFrameworks} style={{ cursor: "pointer" }} />
          </>
        )}
      </svg>

      {state === "system-overview" && (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width={W}
          height={H}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            pointerEvents: "none",
          }}
          aria-hidden
        >
          <g style={{ pointerEvents: "auto" }}>
            <CaseStudyProjectFocus
              activeIndex={activeFocusIndex}
              onSelect={(index) => {
                if (index === activeFocusIndex) {
                  if (index > 0) onSelectProject?.();
                  return;
                }
                setActiveFocusIndex(index);
              }}
              onSwipe={cycleProject}
            />
          </g>
        </svg>
      )}

      {state === "atlas-landing" && (
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 0,
            right: 0,
            padding: "20px 22px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            pointerEvents: "none",
            opacity: entryInProgress ? Math.max(0, 1 - entryProgress * 1.35) : 1,
            transform: `translateY(${entryInProgress ? -6 * entryProgress : 0}px)`,
            transition: "opacity 320ms ease, transform 420ms ease",
          }}
        >
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 11.5,
              letterSpacing: "0.20em",
              color: T.identityGold,
              opacity: 0.82,
              lineHeight: 1.25,
              whiteSpace: "nowrap",
            }}
          >
            THE SOVEREIGN ATLAS
          </div>
          <div
            style={{
              fontFamily: T.serif,
              fontSize: 13.5,
              letterSpacing: "0.06em",
              color: T.accentGold,
              opacity: 0.52,
              marginTop: 5,
              lineHeight: 1.25,
            }}
          >
            Three systems in orbit
          </div>

        </div>
      )}

      {state === "atlas-landing" && (
        <div
          style={{
            position: "absolute",
            bottom: 58,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            pointerEvents: "none",
            opacity: entryInProgress ? Math.max(0, 1 - entryProgress * 1.8) : 1,
            transform: `translateY(${entryInProgress ? 5 * entryProgress : 0}px)`,
            transition: "opacity 240ms ease, transform 320ms ease",
          }}
        >
          <div style={{ width: 0.5, height: 18, background: "rgba(232,213,163,0.18)" }} />
          <div style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.24em", color: T.identityGold, opacity: 0.72 }}>ENTER OBSERVATORY</div>
        </div>
      )}

      {state === "system-awakened" && (
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 0,
            right: 0,
            padding: "22px 22px 0",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            opacity: overviewChromeVisible ? 1 : 0,
            transform: `translateY(${overviewChromeVisible ? 0 : -5}px)`,
            transition: "opacity 220ms ease, transform 260ms ease",
          }}
        >
          <div
            onClick={() => {
              setSelectedCaseStudyId("case-studies");
              setDrawerItemId("case-studies");
              setDrawerPhase("open");
              onBack();
            }}
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              letterSpacing: "0.18em",
              color: T.body,
              opacity: 0.72,
              cursor: "pointer",
              pointerEvents: overviewChromeVisible ? "auto" : "none",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
            }}
          >
            ‹ ATLAS
          </div>
        </div>
      )}

      {state === "system-overview" && (
        <div style={{ position: "absolute", top: 24, left: 0, right: 0, padding: "22px 22px 0", display: "flex", alignItems: "center", pointerEvents: "none", zIndex: 8 }}>
          <div
            onClick={onOverviewBack}
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              letterSpacing: "0.18em",
              color: T.body,
              opacity: 0.72,
              cursor: "pointer",
              pointerEvents: "auto",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
            }}
          >
            ‹ CASE STUDIES
          </div>
        </div>
      )}

      {state === "system-awakened" && (
        <ProjectPreviewDrawer
          item={drawerItem}
          phase={drawerPhase}
          arrivalVisible={overviewChromeVisible}
          onExplore={() => {
            if (drawerItem.id === "case-studies") {
              setActiveFocusIndex(0);
              onOverviewExpand();
              return;
            }
            onSelectProject?.();
          }}
        />
      )}
      {state === "system-overview" && <OverviewScrolled item={CASE_STUDY_FOCUS_ITEMS[activeFocusIndex]} />}
      {state === "atlas-landing" && <AtlasUtilitySheet />}
    </>
  );
}
