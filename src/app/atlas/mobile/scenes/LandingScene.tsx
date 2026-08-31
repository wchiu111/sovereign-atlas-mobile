import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
/**
 * LandingScene — atlas-landing | system-awakened | system-overview
 * Renders the full-atlas SVG and Case Studies overview surfaces.
 */

import { T, ANIM, FADE, W, H, NEXUS, EX_POS, FW_POS, ORBIT_R, SYSTEMS } from "../components/mobileShared";
import AtlasUtilitySheet from "../components/AtlasUtilitySheet";
import {
  CASE_STUDY_COLORS,
  CASE_STUDY_FOCUS_ITEMS,
  CASE_STUDY_PROJECTS,
} from "../case-studies/caseStudyData";
import {
  CASE_STUDY_MINIATURE_SCALE,
  CASE_STUDY_OVERVIEW_LAYOUT,
  CS_FOCUS,
  OVERVIEW_CORE,
  lerp,
} from "../case-studies/caseStudyGeometry";
import NexusNode from "../case-studies/constellation/NexusNode";
import SystemNode from "../case-studies/constellation/SystemNode";
import CaseStudyOverviewConstellation from "../case-studies/constellation/CaseStudyOverviewConstellation";

type LandingState = "atlas-landing" | "system-awakened" | "system-overview";
type CaseStudiesEntryPhase =
  | "idle"
  | "acknowledge"
  | "pulling"
  | "resolving"
  | "settled";

const CASE_STUDIES_ENTRY_DURATION = 900;
const CASE_STUDIES_EXIT_DURATION = 820;
const CASE_STUDIES_PULL_EASE = "cubic-bezier(0.22,1,0.36,1)";
const SELECTION_PULSE_DURATION = 420;
const DRAWER_CLOSE_DURATION = 240;
const DRAWER_OPEN_DURATION = 320;
const OVERVIEW_LABEL_REVEAL_DELAY = 110;
const OVERVIEW_CHROME_REVEAL_DELAY = 170;
const REDUCED_MOTION_TRANSITION_DURATION = 160;
const REDUCED_MOTION_DRAWER_DURATION = 140;
const PROJECT_READING_HANDOFF_DURATION = 520;
const PROJECT_READING_REDUCED_HANDOFF_DURATION = 160;
const PROJECT_RETURN_DURATION = 480;
const PROJECT_RETURN_REDUCED_DURATION = 160;
const PROJECT_BREATH_DURATION = 4.2;


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
  reducedMotion = false,
}: {
  item: (typeof CASE_STUDY_FOCUS_ITEMS)[number];
  phase: "open" | "closing" | "opening";
  onExplore: () => void;
  arrivalVisible?: boolean;
  reducedMotion?: boolean;
}) {
  const isCaseStudies = item.id === "case-studies";
  const translateY = reducedMotion
    ? "0%"
    : phase === "closing"
    ? "100%"
    : arrivalVisible
    ? "0%"
    : "18px";
  const opacity =
    phase === "closing" ? (reducedMotion ? 0 : 0.08) : arrivalVisible ? 1 : 0;

  return (
    <div
      style={{
        position: "absolute",
        top: "auto",
        bottom: 0,
        height: "min(374px, 48dvh)",
        left: 0,
        right: 0,
        boxSizing: "border-box",
        borderTop: `1px solid ${isCaseStudies ? T.caseStudies : item.color}44`,
        background: "rgba(5,5,10,0.96)",
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        padding: "22px 28px calc(26px + env(safe-area-inset-bottom, 0px))",
        display: "flex",
        flexDirection: "column",
        transform: `translateY(${translateY})`,
        opacity,
        transition: reducedMotion
          ? `opacity ${REDUCED_MOTION_DRAWER_DURATION}ms ease`
          : phase === "closing"
          ? `transform ${DRAWER_CLOSE_DURATION}ms cubic-bezier(0.4,0,0.2,1), opacity 180ms ease`
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
        top: "auto",
        bottom: 0,
        height: "min(382px, 48dvh)",
        left: 0,
        right: 0,
        boxSizing: "border-box",
        borderTop: `1px solid ${item.id === "case-studies" ? T.caseStudies : item.color}44`,
        background: "rgba(5,5,10,0.94)",
        backdropFilter: "blur(26px)",
        WebkitBackdropFilter: "blur(26px)",
        padding: "20px 28px calc(28px + env(safe-area-inset-bottom, 0px))",
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
  onSelectProject?: (projectId: (typeof CASE_STUDY_PROJECTS)[number]["id"]) => void;
  returnProjectId?: (typeof CASE_STUDY_PROJECTS)[number]["id"] | null;
  onReturnProjectComplete?: () => void;
  viewportUiTarget?: HTMLElement | null;
}

export default function LandingScene({
  state,
  onSelectCaseStudies,
  onSelectFrameworks,
  onOverviewExpand,
  onExplore,
  onBack,
  onOverviewBack,
  onSelectProject,
  returnProjectId = null,
  onReturnProjectComplete,
  viewportUiTarget = null,
}: LandingSceneProps) {
  const [activeFocusIndex, setActiveFocusIndex] = useState(0);
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<(typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"]>(
    returnProjectId ?? "case-studies",
  );
  const [drawerItemId, setDrawerItemId] = useState<(typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"]>(
    returnProjectId ?? "case-studies",
  );
  const [drawerPhase, setDrawerPhase] = useState<"open" | "closing" | "opening">("open");
  const [entryPhase, setEntryPhase] =
    useState<CaseStudiesEntryPhase>("idle");
  const [overviewChromeVisible, setOverviewChromeVisible] = useState(false);
  const [overviewLabelsVisible, setOverviewLabelsVisible] = useState(false);
  const [selectionPulseId, setSelectionPulseId] = useState<
    (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"] | null
  >(null);
  const [exitProgress, setExitProgress] = useState(0);
  const [isExitingCaseStudies, setIsExitingCaseStudies] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [reducedEntryProgress, setReducedEntryProgress] = useState(0);
  const [reducedExitProgress, setReducedExitProgress] = useState(0);
  const [focusedEntryProjectId, setFocusedEntryProjectId] = useState<
    (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"] | null
  >(null);
  const [focusedEntryProgress, setFocusedEntryProgress] = useState(0);
  const [isReturningFromReading, setIsReturningFromReading] = useState(false);
  const [focusedReturnProgress, setFocusedReturnProgress] = useState(0);
  const focusedReturnFrameRef = useRef<number | null>(null);
  const focusedEntryFrameRef = useRef<number | null>(null);
  const reducedEntryFrameRef = useRef<number | null>(null);
  const reducedExitFrameRef = useRef<number | null>(null);
  const exitFrameRef = useRef<number | null>(null);
  const selectionPulseTimerRef = useRef<number | null>(null);
  const drawerTimersRef = useRef<number[]>([]);
  const entryTimersRef = useRef<number[]>([]);
  const csState  = CS_FOCUS[state];
  const ctxOp    = CTX_OP[state];
  const nexusOp  = NEXUS_OP[state];
  const isActive = state !== "atlas-landing";
  const cs = SYSTEMS[0];
  const ex = SYSTEMS[1];
  const fw = SYSTEMS[2];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(media.matches);
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    return () => {
      entryTimersRef.current.forEach(window.clearTimeout);
      entryTimersRef.current = [];
      drawerTimersRef.current.forEach(window.clearTimeout);
      drawerTimersRef.current = [];
      if (selectionPulseTimerRef.current !== null) {
        window.clearTimeout(selectionPulseTimerRef.current);
      }
      if (exitFrameRef.current !== null) {
        cancelAnimationFrame(exitFrameRef.current);
      }
      if (reducedEntryFrameRef.current !== null) {
        cancelAnimationFrame(reducedEntryFrameRef.current);
      }
      if (reducedExitFrameRef.current !== null) {
        cancelAnimationFrame(reducedExitFrameRef.current);
      }
      if (focusedEntryFrameRef.current !== null) {
        cancelAnimationFrame(focusedEntryFrameRef.current);
      }
      if (focusedReturnFrameRef.current !== null) {
        cancelAnimationFrame(focusedReturnFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (state === "atlas-landing") {
      setOverviewChromeVisible(false);
      setOverviewLabelsVisible(false);
    }

    if (state === "system-awakened") {
      if (entryPhase === "idle") setEntryPhase("settled");
      if (returnProjectId) return;

      // Geometry lands first. Labels and chrome enter afterward.
      const labelsTimer = window.setTimeout(() => {
        setOverviewLabelsVisible(true);
      }, prefersReducedMotion ? 0 : OVERVIEW_LABEL_REVEAL_DELAY);
      const chromeTimer = window.setTimeout(() => {
        setOverviewChromeVisible(true);
      }, prefersReducedMotion ? 0 : OVERVIEW_CHROME_REVEAL_DELAY);

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
  }, [state, entryPhase, prefersReducedMotion]);

  useEffect(() => {
    if (state !== "system-awakened" || !returnProjectId) return;

    setSelectedCaseStudyId(returnProjectId);
    setDrawerItemId(returnProjectId);
    setDrawerPhase("open");
    setOverviewLabelsVisible(false);
    setOverviewChromeVisible(false);
    setIsReturningFromReading(true);
    setFocusedReturnProgress(0);

    const duration = prefersReducedMotion
      ? PROJECT_RETURN_REDUCED_DURATION
      : PROJECT_RETURN_DURATION;
    const start = performance.now();

    const tickFocusedReturn = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      const eased = prefersReducedMotion
        ? raw
        : raw * raw * (3 - 2 * raw);

      setFocusedReturnProgress(eased);

      if (raw < 1) {
        focusedReturnFrameRef.current =
          requestAnimationFrame(tickFocusedReturn);
        return;
      }

      focusedReturnFrameRef.current = null;
      setFocusedReturnProgress(1);
      setOverviewLabelsVisible(true);
      setOverviewChromeVisible(true);
      setIsReturningFromReading(false);
      onReturnProjectComplete?.();
    };

    focusedReturnFrameRef.current =
      requestAnimationFrame(tickFocusedReturn);

    return () => {
      if (focusedReturnFrameRef.current !== null) {
        cancelAnimationFrame(focusedReturnFrameRef.current);
        focusedReturnFrameRef.current = null;
      }
    };
  }, [
    state,
    returnProjectId,
    prefersReducedMotion,
    onReturnProjectComplete,
  ]);

  const enterCaseStudies = () => {
    entryTimersRef.current.forEach(window.clearTimeout);
    entryTimersRef.current = [];

    if (prefersReducedMotion) {
      setEntryPhase("acknowledge");
      setReducedEntryProgress(0);
      const start = performance.now();

      const tickReducedEntry = (now: number) => {
        const raw = Math.min(
          1,
          (now - start) / REDUCED_MOTION_TRANSITION_DURATION,
        );
        setReducedEntryProgress(raw);

        if (raw < 1) {
          reducedEntryFrameRef.current = requestAnimationFrame(tickReducedEntry);
          return;
        }

        reducedEntryFrameRef.current = null;
        setEntryPhase("settled");
        setReducedEntryProgress(0);
        onSelectCaseStudies();
      };

      reducedEntryFrameRef.current = requestAnimationFrame(tickReducedEntry);
      return;
    }

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
    if (drawerPhase === "closing") return;

    // First tap selects a project and reveals its contextual preview.
    // Tapping the already-selected project again enters Focused Mode.
    if (id === selectedCaseStudyId) {
      if (id !== "case-studies") {
        enterFocusedReading(id);
      }
      return;
    }

    if (selectionPulseTimerRef.current !== null) {
      window.clearTimeout(selectionPulseTimerRef.current);
      selectionPulseTimerRef.current = null;
    }
    drawerTimersRef.current.forEach(window.clearTimeout);
    drawerTimersRef.current = [];

    // Visual acknowledgement happens immediately, before the drawer moves.
    setSelectionPulseId(prefersReducedMotion ? null : id);
    setSelectedCaseStudyId(id);

    if (prefersReducedMotion) {
      setDrawerPhase("closing");

      drawerTimersRef.current.push(
        window.setTimeout(() => {
          setDrawerItemId(id);
          setDrawerPhase("opening");

          drawerTimersRef.current.push(
            window.setTimeout(() => {
              setDrawerPhase("open");
            }, REDUCED_MOTION_DRAWER_DURATION),
          );
        }, REDUCED_MOTION_DRAWER_DURATION),
      );
      return;
    }

    setDrawerPhase("closing");

    selectionPulseTimerRef.current = window.setTimeout(() => {
      setSelectionPulseId(null);
      selectionPulseTimerRef.current = null;
    }, SELECTION_PULSE_DURATION);

    drawerTimersRef.current.push(
      window.setTimeout(() => {
        setDrawerItemId(id);
        setDrawerPhase("opening");

        drawerTimersRef.current.push(
          window.setTimeout(() => {
            setDrawerPhase("open");
          }, DRAWER_OPEN_DURATION),
        );
      }, DRAWER_CLOSE_DURATION),
    );
  };

  const enterFocusedReading = (
    projectId: (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"],
  ) => {
    if (focusedEntryProjectId || isExitingCaseStudies) return;
    if (projectId === "case-studies") return;

    if (selectionPulseTimerRef.current !== null) {
      window.clearTimeout(selectionPulseTimerRef.current);
      selectionPulseTimerRef.current = null;
      setSelectionPulseId(null);
    }
    drawerTimersRef.current.forEach(window.clearTimeout);
    drawerTimersRef.current = [];

    setFocusedEntryProjectId(projectId);
    setFocusedEntryProgress(0);
    setOverviewChromeVisible(false);
    setDrawerPhase("closing");

    const duration = prefersReducedMotion
      ? PROJECT_READING_REDUCED_HANDOFF_DURATION
      : PROJECT_READING_HANDOFF_DURATION;
    const start = performance.now();

    const tickFocusedEntry = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      const eased = prefersReducedMotion
        ? raw
        : raw * raw * (3 - 2 * raw);

      setFocusedEntryProgress(eased);

      if (raw < 1) {
        focusedEntryFrameRef.current =
          requestAnimationFrame(tickFocusedEntry);
        return;
      }

      focusedEntryFrameRef.current = null;
      setFocusedEntryProgress(1);
      onSelectProject?.(
        projectId as (typeof CASE_STUDY_PROJECTS)[number]["id"],
      );
    };

    focusedEntryFrameRef.current =
      requestAnimationFrame(tickFocusedEntry);
  };

  const exitCaseStudiesToAtlas = () => {
    if (isExitingCaseStudies) return;

    if (prefersReducedMotion) {
      setIsExitingCaseStudies(true);
      setOverviewLabelsVisible(false);
      setOverviewChromeVisible(false);
      setDrawerPhase("closing");
      setReducedExitProgress(0);

      const start = performance.now();

      const tickReducedExit = (now: number) => {
        const raw = Math.min(
          1,
          (now - start) / REDUCED_MOTION_TRANSITION_DURATION,
        );
        setReducedExitProgress(raw);

        if (raw < 1) {
          reducedExitFrameRef.current = requestAnimationFrame(tickReducedExit);
          return;
        }

        reducedExitFrameRef.current = null;
        setSelectedCaseStudyId("case-studies");
        setDrawerItemId("case-studies");
        setDrawerPhase("open");
        setIsExitingCaseStudies(false);
        setReducedExitProgress(0);
        onBack();
      };

      reducedExitFrameRef.current = requestAnimationFrame(tickReducedExit);
      return;
    }

    if (selectionPulseTimerRef.current !== null) {
      window.clearTimeout(selectionPulseTimerRef.current);
      selectionPulseTimerRef.current = null;
      setSelectionPulseId(null);
    }

    setIsExitingCaseStudies(true);
    setOverviewLabelsVisible(false);
    setOverviewChromeVisible(false);
    setDrawerPhase("closing");
    setExitProgress(0);

    const start = performance.now();

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / CASE_STUDIES_EXIT_DURATION);

      // Smoothstep mirrors the calm settle of the entry transition.
      const eased = raw * raw * (3 - 2 * raw);
      setExitProgress(eased);

      if (raw < 1) {
        exitFrameRef.current = requestAnimationFrame(tick);
        return;
      }

      exitFrameRef.current = null;
      setSelectedCaseStudyId("case-studies");
      setDrawerItemId("case-studies");
      setDrawerPhase("open");
      setIsExitingCaseStudies(false);
      setExitProgress(0);
      onBack();
    };

    exitFrameRef.current = requestAnimationFrame(tick);
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
  const reducedEntryInProgress =
    prefersReducedMotion &&
    state === "atlas-landing" &&
    entryPhase === "acknowledge" &&
    reducedEntryProgress > 0;
  const reducedExitInProgress =
    prefersReducedMotion && isExitingCaseStudies && reducedExitProgress > 0;

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

  const animatedCsX = reducedEntryInProgress
    ? lerp(95, 103, reducedEntryProgress)
    : 95 + (195 - 95) * entryProgress;
  const pullTargetY = 250;
  const baseAnimatedCsY = reducedEntryInProgress
    ? lerp(178, 186, reducedEntryProgress)
    : 178 + (pullTargetY - 178) * entryProgress;
  const animatedCsY =
    entryPhase === "resolving"
      ? lerp(baseAnimatedCsY, OVERVIEW_CORE.y, resolveT)
      : baseAnimatedCsY;
  const animatedCsOrbitR = reducedEntryInProgress
    ? 36
    : 36 + (72 - 36) * entryProgress;
  const contextEntryOpacity = entryInProgress
    ? reducedEntryInProgress
      ? lerp(1, 0, reducedEntryProgress)
      : Math.max(0, 1 - entryProgress * 1.2)
    : ctxOp;
  const selectedSystemScale = reducedEntryInProgress
    ? 1
    : entryPhase === "acknowledge"
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

  const exitScale = reducedExitInProgress
    ? 1
    : lerp(1, CASE_STUDY_MINIATURE_SCALE, exitProgress);
  const exitTranslateX = reducedExitInProgress
    ? lerp(0, -8, reducedExitProgress)
    : lerp(0, 95 - OVERVIEW_CORE.x, exitProgress);
  const exitTranslateY = reducedExitInProgress
    ? lerp(0, -6, reducedExitProgress)
    : lerp(0, 178 - OVERVIEW_CORE.y, exitProgress);

  // Background stays quiet until the overview has clearly begun contracting.
  const exitBackgroundT = reducedExitInProgress
    ? reducedExitProgress
    : Math.max(0, Math.min(1, (exitProgress - 0.42) / 0.58));
  const exitChromeT = reducedExitInProgress
    ? reducedExitProgress
    : Math.max(0, Math.min(1, (exitProgress - 0.62) / 0.38));
  const returnDrawerVisible =
    !isReturningFromReading || focusedReturnProgress >= 0.58;
  const returnChromeVisible =
    !isReturningFromReading || focusedReturnProgress >= 0.72;

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

  const renderViewportUi = (node: ReactNode) =>
    viewportUiTarget ? createPortal(node, viewportUiTarget) : null;

  return (
    <>
      <style>{`
        @keyframes atlasNodeBrightnessFromParent {
          0%, 100% {
            opacity: 0.50;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes atlasNodeBrightnessFromSibling {
          0%, 100% {
            opacity: 0.34;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes atlasParentCoreAvailableBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.32;
          }
          50% {
            transform: scale(1.026);
            opacity: 0.74;
          }
        }

        @keyframes atlasAvailableHaloBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.92;
          }
          50% {
            transform: scale(1.08);
            opacity: 1;
          }
        }

        @keyframes atlasAvailableCoreBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.96;
          }
          50% {
            transform: scale(1.018);
            opacity: 1;
          }
        }

        @keyframes atlasSelectedHaloBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.90;
          }
          50% {
            transform: scale(1.035);
            opacity: 1;
          }
        }

        @keyframes atlasSelectedCoreBreath {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.010);
          }
        }

        @keyframes atlasSelectionPulse {
          0% {
            transform: scale(1);
            opacity: 0.92;
          }
          38% {
            transform: scale(1.16);
            opacity: 1;
          }
          100% {
            transform: scale(1.04);
            opacity: 1;
          }
        }

        @keyframes atlasCoreBreath {
          0%, 100% {
            transform: scale(1);
            opacity: 0.96;
          }
          50% {
            transform: scale(1.012);
            opacity: 1;
          }
        }

        .atlas-halo-available,
        .atlas-halo-selected,
        .atlas-core-available,
        .atlas-core-selected,
        .atlas-selection-pulse,
        .atlas-parent-core-selected {
          transform-box: fill-box;
          transform-origin: center;
          will-change: transform, opacity;
        }

        .atlas-halo-available {
          animation: atlasAvailableHaloBreath 4.2s ease-in-out infinite;
        }

        .atlas-core-available {
          animation: atlasAvailableCoreBreath 4.2s ease-in-out infinite;
        }

        .atlas-halo-selected {
          animation: atlasSelectedHaloBreath 5.8s ease-in-out infinite;
        }

        .atlas-core-selected {
          animation: atlasSelectedCoreBreath 5.8s ease-in-out infinite;
        }

        .atlas-selection-pulse {
          animation: atlasSelectionPulse 420ms cubic-bezier(0.22,1,0.36,1) both;
        }

        .atlas-parent-core-selected {
          animation: atlasCoreBreath 6.2s ease-in-out infinite;
        }

        .atlas-parent-core-available {
          transform-box: fill-box;
          transform-origin: center;
          animation: atlasParentCoreAvailableBreath 5.2s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .atlas-ambient-paused {
          animation-play-state: paused !important;
        }

        .atlas-node-brightness-parent {
          animation: atlasNodeBrightnessFromParent 4.2s ease-in-out infinite;
          will-change: opacity;
        }

        .atlas-node-brightness-sibling {
          animation: atlasNodeBrightnessFromSibling 4.2s ease-in-out infinite;
          will-change: opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .atlas-halo-available,
          .atlas-halo-selected,
          .atlas-core-available,
          .atlas-core-selected,
          .atlas-selection-pulse,
          .atlas-parent-core-selected,
          .atlas-parent-core-available,
          .atlas-node-brightness-parent,
          .atlas-node-brightness-sibling {
            animation: none !important;
            transform: none !important;
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
                : isExitingCaseStudies
                ? 0.036 * exitBackgroundT
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
              : isExitingCaseStudies
              ? 0.20 * exitChromeT
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
          opacity={
            isExitingCaseStudies
              ? 0.20 * exitBackgroundT
              : entryInProgress
              ? (orbitRecedeOpacity ?? CTX_ARC_OP[state])
              : CTX_ARC_OP[state]
          }
          style={{ transition: "opacity 360ms ease" }}
        />
        <path
          d={fw.orbitPath}
          fill="none"
          stroke={fw.color}
          strokeWidth={0.55}
          strokeDasharray="4.5 7"
          opacity={
            isExitingCaseStudies
              ? 0.20 * exitBackgroundT
              : entryInProgress
              ? (orbitRecedeOpacity ?? CTX_ARC_OP[state])
              : CTX_ARC_OP[state]
          }
          style={{ transition: "opacity 360ms ease" }}
        />
        <g
          style={{
            opacity: isExitingCaseStudies
              ? exitBackgroundT
              : entryInProgress
              ? nexusRecede.opacity
              : nexusOp,
            transform: `scale(${
              isExitingCaseStudies
                ? lerp(0.972, 1, exitBackgroundT)
                : entryInProgress
                ? nexusRecede.scale
                : 1
            })`,
            transformOrigin: `${NEXUS.x}px ${NEXUS.y}px`,
            transition: `opacity 260ms ease, transform 520ms ${CASE_STUDIES_PULL_EASE}`,
          }}
        >
          <NexusNode op={1} />
        </g>
        <g
          style={{
            opacity: isExitingCaseStudies
              ? exitBackgroundT
              : entryInProgress
              ? contextRecede.opacity
              : contextEntryOpacity,
            transform: `scale(${
              isExitingCaseStudies
                ? lerp(0.978, 1, exitBackgroundT)
                : entryInProgress
                ? contextRecede.scale
                : 1
            })`,
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
            dimmed={entryInProgress || (isActive && !isExitingCaseStudies)}
            showLabel={!isActive || isExitingCaseStudies}
          />
        </g>
        <g
          style={{
            opacity: isExitingCaseStudies
              ? exitBackgroundT
              : entryInProgress
              ? contextRecede.opacity
              : contextEntryOpacity,
            transform: `scale(${
              isExitingCaseStudies
                ? lerp(0.978, 1, exitBackgroundT)
                : entryInProgress
                ? contextRecede.scale
                : 1
            })`,
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
            dimmed={entryInProgress || (isActive && !isExitingCaseStudies)}
            showLabel={!isActive || isExitingCaseStudies}
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
              selectionPulseId={null}
              ambientPaused
              focusedEntryId={null}
              focusedEntryProgress={0}
              focusedReturnId={null}
              focusedReturnProgress={0}
              reducedMotion={prefersReducedMotion}
            />
          </g>
        )}
        {state === "system-awakened" && (
          <g
            style={{
              opacity: reducedExitInProgress
                ? 1 - reducedExitProgress
                : 1,
              transform: isExitingCaseStudies
                ? `translate(${exitTranslateX}px, ${exitTranslateY}px) scale(${exitScale})`
                : "translate(0px, 0px) scale(1)",
              transformOrigin: `${OVERVIEW_CORE.x}px ${OVERVIEW_CORE.y}px`,
              transition: isExitingCaseStudies
                ? "none"
                : `opacity 180ms ease, transform 220ms ${CASE_STUDIES_PULL_EASE}`,
              pointerEvents: isExitingCaseStudies ? "none" : "auto",
            }}
          >
            <CaseStudyOverviewConstellation
              selectedId={
                isExitingCaseStudies ? "case-studies" : selectedCaseStudyId
              }
              onSelect={selectCaseStudyOverviewItem}
              labelsVisible={
                isExitingCaseStudies
                  ? false
                  : isReturningFromReading
                  ? true
                  : overviewLabelsVisible
              }
              selectionPulseId={isExitingCaseStudies ? null : selectionPulseId}
              ambientPaused={
                isExitingCaseStudies ||
                isReturningFromReading ||
                focusedEntryProjectId !== null ||
                drawerPhase !== "open" ||
                selectionPulseId !== null
              }
              focusedEntryId={focusedEntryProjectId}
              focusedEntryProgress={focusedEntryProgress}
              focusedReturnId={isReturningFromReading ? returnProjectId : null}
              focusedReturnProgress={focusedReturnProgress}
              reducedMotion={prefersReducedMotion}
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

      {renderViewportUi(
        <>
          {(state === "atlas-landing" || isExitingCaseStudies) && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "calc(44px + env(safe-area-inset-top, 0px)) 22px 0",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            pointerEvents: "none",
            opacity: isExitingCaseStudies
              ? exitChromeT
              : reducedEntryInProgress
              ? 1 - reducedEntryProgress
              : entryInProgress
              ? Math.max(0, 1 - entryProgress * 1.35)
              : 1,
            transform: `translateY(${
              isExitingCaseStudies
                ? lerp(-6, 0, exitChromeT)
                : entryInProgress
                ? -6 * entryProgress
                : 0
            }px)`,
            transition: isExitingCaseStudies
              ? "none"
              : "opacity 320ms ease, transform 420ms ease",
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

      {(state === "atlas-landing" || isExitingCaseStudies) && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(58px + env(safe-area-inset-bottom, 0px))",
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            pointerEvents: "none",
            opacity: isExitingCaseStudies
              ? exitChromeT
              : reducedEntryInProgress
              ? 1 - reducedEntryProgress
              : entryInProgress
              ? Math.max(0, 1 - entryProgress * 1.8)
              : 1,
            transform: `translateY(${
              isExitingCaseStudies
                ? lerp(5, 0, exitChromeT)
                : entryInProgress
                ? 5 * entryProgress
                : 0
            }px)`,
            transition: isExitingCaseStudies
              ? "none"
              : "opacity 240ms ease, transform 320ms ease",
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
            top: 0,
            left: 0,
            right: 0,
            padding: "calc(46px + env(safe-area-inset-top, 0px)) 22px 0",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            opacity:
              overviewChromeVisible || (isReturningFromReading && returnChromeVisible)
                ? 1
                : 0,
            transform: `translateY(${
              overviewChromeVisible ||
              (isReturningFromReading && returnChromeVisible)
                ? 0
                : -5
            }px)`,
            transition: "opacity 220ms ease, transform 260ms ease",
          }}
        >
          <div
            onClick={exitCaseStudiesToAtlas}
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              letterSpacing: "0.18em",
              color: T.body,
              opacity: 0.72,
              cursor: "pointer",
              pointerEvents:
                overviewChromeVisible &&
                !isExitingCaseStudies &&
                !isReturningFromReading &&
                focusedEntryProjectId === null
                  ? "auto"
                  : "none",
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
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "calc(46px + env(safe-area-inset-top, 0px)) 22px 0", display: "flex", alignItems: "center", pointerEvents: "none", zIndex: 8 }}>
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
        <div
          style={{
            pointerEvents:
              focusedEntryProjectId || isReturningFromReading
                ? "none"
                : "auto",
          }}
        >
        <ProjectPreviewDrawer
          item={drawerItem}
          phase={drawerPhase}
          arrivalVisible={
            isReturningFromReading
              ? returnDrawerVisible
              : overviewChromeVisible
          }
          reducedMotion={prefersReducedMotion}
          onExplore={() => {
            if (drawerItem.id === "case-studies") {
              setActiveFocusIndex(0);
              onOverviewExpand();
              return;
            }
            enterFocusedReading(drawerItem.id);
          }}
        />
        </div>
      )}
      {state === "system-overview" && <OverviewScrolled item={CASE_STUDY_FOCUS_ITEMS[activeFocusIndex]} />}
      {state === "atlas-landing" && <AtlasUtilitySheet />}
        </>
      )}
    </>
  );
}
