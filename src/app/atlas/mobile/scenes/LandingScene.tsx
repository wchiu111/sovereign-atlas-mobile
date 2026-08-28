import { useRef, useState } from "react";
/**
 * LandingScene — atlas-landing | system-awakened | system-overview
 * Renders the full-atlas SVG and Case Studies overview surfaces.
 */

import type { MobileState } from "../components/mobileShared";
import { T, ANIM, FADE, W, H, NEXUS, BASE_R, EX_POS, FW_POS, ORBIT_R, SYSTEMS } from "../components/mobileShared";
import type { SystemDef, Planet } from "../components/mobileShared";
import AtlasUtilitySheet from "../components/AtlasUtilitySheet";

type LandingState = "atlas-landing" | "system-awakened" | "system-overview";

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

const CS_FOCUS: Record<LandingState, { x: number; y: number; orbitR: number; opacity: number }> = {
  "atlas-landing":  { x: 95,  y: 178, orbitR: 36, opacity: 1    },
  "system-awakened":{ x: 195, y: 250, orbitR: 72, opacity: 1    },
  "system-overview":{ x: 195, y: 82,  orbitR: 24, opacity: 0.45 },
};

const CTX_OP: Record<LandingState, number> = {
  "atlas-landing":  1,    "system-awakened": 0.10, "system-overview": 0.07,
};
const NEXUS_OP: Record<LandingState, number> = {
  "atlas-landing":  1,    "system-awakened": 0.16, "system-overview": 0.08,
};
const CS_ARC_OP: Record<LandingState, number> = {
  "atlas-landing": 0.20, "system-awakened": 0,    "system-overview": 0,
};
const CTX_ARC_OP: Record<LandingState, number> = {
  "atlas-landing": 0.20, "system-awakened": 0.04, "system-overview": 0.02,
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

function PlanetCluster({ planets, orbitR, color, awakened, dimmed }: {
  planets: Planet[]; orbitR: number; color: string; awakened: boolean; dimmed: boolean;
}) {
  const ringScale  = orbitR / 36;
  const showLabels = awakened && orbitR >= 44;
  return (
    <g>
      <g style={{ transform: `scale(${ringScale})`, transition: ANIM }}>
        <circle r={36} fill="none" stroke={color} strokeWidth={0.4} strokeDasharray="2.5 5"
          opacity={dimmed ? 0.04 : awakened ? 0.22 : 0.09} style={{ transition: FADE }} />
      </g>
      {planets.map((p, i) => {
        const rad = (p.angle * Math.PI) / 180;
        const lpx = Math.cos(rad) * orbitR;
        const lpy = Math.sin(rad) * orbitR;
        const ldx = Math.cos(rad);
        const ldy = Math.sin(rad);
        const ta  = ldx > 0.28 ? "start" : ldx < -0.28 ? "end" : "middle";
        const db  = ldy > 0.28 ? "hanging" : ldy < -0.28 ? "auto" : "middle";
        return (
          <g key={i} style={{ transform: `translate(${lpx}px,${lpy}px)`, transition: ANIM }}>
            <circle r={(awakened ? 9.5 : 5.5) * SYSTEM_VISUAL_SCALE} fill={color}
              opacity={dimmed ? 0.03 : awakened ? 0.16 : 0.07} style={{ transition: FADE }} />
            <circle r={(awakened ? 3 : 1.7) * SYSTEM_VISUAL_SCALE} fill={color}
              opacity={dimmed ? 0.18 : awakened ? 1 : 0.52} style={{ transition: FADE }} />
            {showLabels && (
              <text x={ldx * 11} y={ldy * 11}
                textAnchor={ta} dominantBaseline={db}
                fontFamily={T.mono} fontSize={PLANET_LABEL_SIZE} letterSpacing="0.08em" fill={color} opacity={0.88}>
                {p.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

function SystemNode({ sys, cx, cy, orbitR, awakened, dimmed, showLabel }: {
  sys: SystemDef; cx: number; cy: number; orbitR: number;
  awakened: boolean; dimmed: boolean; showLabel: boolean;
}) {
  const atmoR  = (awakened ? BASE_R * 1.45 : BASE_R * 0.82) * SYSTEM_VISUAL_SCALE;
  const outerR = (awakened ? BASE_R * 3.2  : BASE_R * 1.9) * SYSTEM_VISUAL_SCALE;
  const coreR  = (awakened ? BASE_R * 0.52 : BASE_R * 0.36) * SYSTEM_VISUAL_SCALE;
  return (
    <g style={{ transform: `translate(${cx}px,${cy}px)`, transition: ANIM }}>
      <PlanetCluster planets={sys.planets} orbitR={orbitR} color={sys.color} awakened={awakened} dimmed={dimmed} />
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
  const isSystemFocus = activeIndex === 0;

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

  const projectSlots = isSystemFocus
    ? []
    : [
        {
          item: CASE_STUDY_PROJECTS[(activeIndex - 2 + CASE_STUDY_PROJECTS.length) % CASE_STUDY_PROJECTS.length],
          offset: -1,
        },
        {
          item: CASE_STUDY_PROJECTS[activeIndex - 1],
          offset: 0,
        },
        {
          item: CASE_STUDY_PROJECTS[activeIndex % CASE_STUDY_PROJECTS.length],
          offset: 1,
        },
      ];

  return (
    <g
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "pan-y" }}
    >
      <text
        x={195}
        y={102}
        textAnchor="middle"
        fontFamily={T.mono}
        fontSize={10.5}
        letterSpacing="0.15em"
        fill={active.color}
        opacity={0.98}
      >
        {active.label}
      </text>

      {isSystemFocus ? (
        <>
          <g
            style={{
              transform: "translate(195px,250px)",
              transition: ANIM,
            }}
          >
            <circle r={68} fill={T.caseStudies} opacity={0.10} />
            <circle r={42} fill={T.caseStudies} opacity={0.18} />
            <circle
              r={51}
              fill="none"
              stroke={T.caseStudies}
              strokeWidth={0.65}
              strokeDasharray="3 6"
              opacity={0.34}
            />
            <circle r={14} fill={T.caseStudies} opacity={1} />
            <circle r={32} fill="transparent" pointerEvents="all" />
          </g>

          {[
            { projectIndex: 0, x: 195, y: 160 },
            { projectIndex: 1, x: 304, y: 250 },
            { projectIndex: 2, x: 195, y: 340 },
            { projectIndex: 3, x: 86, y: 250 },
          ].map(({ projectIndex, x, y }) => {
            const project = CASE_STUDY_PROJECTS[projectIndex];
            return (
              <g
                key={project.id}
                style={{
                  transform: `translate(${x}px,${y}px)`,
                  transition: ANIM,
                  cursor: "pointer",
                }}
                onClick={() => onSelect(projectIndex + 1)}
              >
                <circle r={24} fill={project.color} opacity={0.05} />
                <circle r={13} fill={project.color} opacity={0.12} />
                <circle
                  r={16}
                  fill="none"
                  stroke={project.color}
                  strokeWidth={0.5}
                  opacity={0.22}
                />
                <circle r={5.8} fill={project.color} opacity={0.9} />
                <circle r={26} fill="transparent" pointerEvents="all" />
              </g>
            );
          })}
        </>
      ) : (
        <>
          {projectSlots.map(({ item, offset }) => {
            const isActive = offset === 0;
            const x = isActive ? 195 : offset < 0 ? 52 : 338;
            const y = 250;
            const outer = isActive ? 64 : 28;
            const inner = isActive ? 36 : 15;
            const core = isActive ? 12.5 : 6.2;

            return (
              <g
                key={`${item.id}-${offset}`}
                style={{
                  transform: `translate(${x}px,${y}px)`,
                  transition: ANIM,
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (isActive) {
                    onSelect(activeIndex);
                    return;
                  }
                  onSwipe(offset < 0 ? -1 : 1);
                }}
              >
                <circle
                  r={outer}
                  fill={item.color}
                  opacity={isActive ? 0.11 : 0.04}
                  style={{ transition: FADE }}
                />
                <circle
                  r={inner}
                  fill={item.color}
                  opacity={isActive ? 0.22 : 0.09}
                  style={{ transition: FADE }}
                />
                <circle
                  r={isActive ? 44 : 19}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={0.55}
                  strokeDasharray={isActive ? "3 6" : undefined}
                  opacity={isActive ? 0.34 : 0.14}
                />
                <circle
                  r={core}
                  fill={item.color}
                  opacity={isActive ? 1 : 0.62}
                />
                {!isActive && (
                  <text
                    x={offset < 0 ? -16 : 16}
                    y={3}
                    textAnchor={offset < 0 ? "end" : "start"}
                    fontFamily={T.mono}
                    fontSize={8}
                    letterSpacing="0.08em"
                    fill={item.color}
                    opacity={0.8}
                  >
                    {item.label}
                  </text>
                )}
                <circle r={28} fill="transparent" pointerEvents="all" />
              </g>
            );
          })}

          <g transform="translate(195,318)" opacity={0.82}>
            <rect
              x={-26}
              y={0}
              width={52}
              height={18}
              rx={9}
              fill="rgba(5,5,10,0.82)"
              stroke={active.color}
              strokeOpacity={0.36}
              strokeWidth={0.7}
            />
            <text
              x={0}
              y={12}
              textAnchor="middle"
              fontFamily={T.mono}
              fontSize={6.5}
              letterSpacing="0.11em"
              fill={active.color}
              opacity={0.94}
            >
              OPEN
            </text>
          </g>
        </>
      )}

      <g transform="translate(195,352)">
        {(isSystemFocus ? CASE_STUDY_FOCUS_ITEMS : CASE_STUDY_PROJECTS).map((item, i) => {
          const isActiveDot = isSystemFocus
            ? i === 0
            : i === activeIndex - 1;
          const count = isSystemFocus ? CASE_STUDY_FOCUS_ITEMS.length : CASE_STUDY_PROJECTS.length;
          return (
            <circle
              key={item.id}
              cx={(i - (count - 1) / 2) * 14}
              cy={0}
              r={isActiveDot ? 3.2 : 2.5}
              fill={T.caseStudies}
              opacity={isActiveDot ? 0.95 : 0.34}
            />
          );
        })}
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
  const csState  = CS_FOCUS[state];
  const ctxOp    = CTX_OP[state];
  const nexusOp  = NEXUS_OP[state];
  const isActive = state !== "atlas-landing";
  const cs = SYSTEMS[0];
  const ex = SYSTEMS[1];
  const fw = SYSTEMS[2];

  const cycleProject = (direction: -1 | 1) => {
    setActiveFocusIndex((current) => {
      if (current === 0) return direction > 0 ? 1 : CASE_STUDY_PROJECTS.length;
      const projectIndex = current - 1;
      const nextProject = (projectIndex + direction + CASE_STUDY_PROJECTS.length) % CASE_STUDY_PROJECTS.length;
      return nextProject + 1;
    });
  };

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }} aria-hidden>
        {[22, 67, 112, 157, 202, 247, 292, 337].map((deg) => {
          const r = (deg * Math.PI) / 180;
          return <line key={deg} x1={NEXUS.x} y1={NEXUS.y} x2={NEXUS.x + Math.cos(r) * 295} y2={NEXUS.y + Math.sin(r) * 295}
            stroke={T.gold} strokeWidth={0.28} opacity={isActive ? 0.014 : 0.036} style={{ transition: FADE }} />;
        })}
        <path d={cs.orbitPath} fill="none" stroke={cs.color} strokeWidth={0.55} strokeDasharray="4.5 7" opacity={CS_ARC_OP[state]} style={{ transition: FADE }} />
        <path d={ex.orbitPath} fill="none" stroke={ex.color} strokeWidth={0.55} strokeDasharray="4.5 7" opacity={CTX_ARC_OP[state]} style={{ transition: FADE }} />
        <path d={fw.orbitPath} fill="none" stroke={fw.color} strokeWidth={0.55} strokeDasharray="4.5 7" opacity={CTX_ARC_OP[state]} style={{ transition: FADE }} />
        <NexusNode op={nexusOp} />
        <g style={{ opacity: ctxOp, transition: FADE }}><SystemNode sys={ex} cx={EX_POS.x} cy={EX_POS.y} orbitR={ORBIT_R} awakened={false} dimmed={isActive} showLabel={!isActive} /></g>
        <g style={{ opacity: ctxOp, transition: FADE }}><SystemNode sys={fw} cx={FW_POS.x} cy={FW_POS.y} orbitR={ORBIT_R} awakened={false} dimmed={isActive} showLabel={!isActive} /></g>
        <g style={{ opacity: state === "system-overview" ? 0 : csState.opacity, transition: FADE }}><SystemNode sys={cs} cx={csState.x} cy={csState.y} orbitR={csState.orbitR} awakened={isActive} dimmed={false} showLabel={state === "atlas-landing"} /></g>
        {state === "atlas-landing" && (
          <>
            <circle cx={95} cy={178} r={56} fill="transparent" onClick={onSelectCaseStudies} style={{ cursor: "pointer" }} />
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
        <div style={{ position: "absolute", bottom: 58, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, pointerEvents: "none" }}>
          <div style={{ width: 0.5, height: 18, background: "rgba(232,213,163,0.18)" }} />
          <div style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.24em", color: T.identityGold, opacity: 0.72 }}>ENTER OBSERVATORY</div>
        </div>
      )}

      {state === "system-awakened" && (
        <div style={{ position: "absolute", top: 24, left: 0, right: 0, padding: "22px 22px 0", display: "flex", alignItems: "center", pointerEvents: "none" }}>
          <div onClick={onBack} style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.18em", color: T.body, opacity: 0.72, cursor: "pointer", pointerEvents: "auto", minHeight: 44, display: "flex", alignItems: "center" }}>‹ ATLAS</div>
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

      {state === "system-awakened" && <OverviewInitial onExplore={() => { setActiveFocusIndex(0); onOverviewExpand(); }} />}
      {state === "system-overview" && <OverviewScrolled item={CASE_STUDY_FOCUS_ITEMS[activeFocusIndex]} />}
      {state === "atlas-landing" && <AtlasUtilitySheet />}
    </>
  );
}
