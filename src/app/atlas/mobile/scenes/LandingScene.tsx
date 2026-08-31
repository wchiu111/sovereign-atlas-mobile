import { useRef, useState, type ReactNode } from "react";
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
  CS_FOCUS,
  OVERVIEW_CORE,
} from "../case-studies/caseStudyGeometry";
import NexusNode from "../case-studies/constellation/NexusNode";
import SystemNode from "../case-studies/constellation/SystemNode";
import CaseStudyOverviewConstellation from "../case-studies/constellation/CaseStudyOverviewConstellation";
import ProjectPreviewDrawer from "../case-studies/surfaces/ProjectPreviewDrawer";
import CaseStudiesOverviewSurface from "../case-studies/surfaces/CaseStudiesOverviewSurface";
import CaseStudiesChrome from "../case-studies/surfaces/CaseStudiesChrome";
import useCaseStudiesChoreography, {
  CASE_STUDIES_PULL_EASE,
  DRAWER_CLOSE_DURATION,
  DRAWER_OPEN_DURATION,
  REDUCED_MOTION_DRAWER_DURATION,
} from "../case-studies/hooks/useCaseStudiesChoreography";

type LandingState = "atlas-landing" | "system-awakened" | "system-overview";
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
  const {
    selectedCaseStudyId,
    drawerPhase,
    entryPhase,
    overviewChromeVisible,
    overviewLabelsVisible,
    selectionPulseId,
    isExitingCaseStudies,
    prefersReducedMotion,
    focusedEntryProjectId,
    focusedEntryProgress,
    isReturningFromReading,
    focusedReturnProgress,
    drawerItem,

    enterCaseStudies,
    selectCaseStudyOverviewItem,
    enterFocusedReading,
    exitCaseStudiesToAtlas,

    entryInProgress,
    reducedEntryInProgress,
    reducedExitInProgress,
    entryProgress,
    resolvingOverview,
    animatedCsX,
    animatedCsY,
    animatedCsOrbitR,
    selectedSystemScale,
    travelingSystemOpacity,
    overviewResolveOpacity,
    overviewResolveScale,
    overviewResolveTargets,
    exitScale,
    exitTranslateX,
    exitTranslateY,
    exitBackgroundT,
    exitChromeT,
    returnDrawerVisible,
    returnChromeVisible,
    contextRecede,
    nexusRecede,
    orbitRecedeOpacity,
  } = useCaseStudiesChoreography({
    state,
    returnProjectId,
    onSelectCaseStudies,
    onSelectProject,
    onReturnProjectComplete,
    onBack,
  });

  const csState = CS_FOCUS[state];
  const ctxOp = CTX_OP[state];
  const nexusOp = NEXUS_OP[state];
  const isActive = state !== "atlas-landing";
  const cs = SYSTEMS[0];
  const ex = SYSTEMS[1];
  const fw = SYSTEMS[2];

  const contextEntryOpacity = entryInProgress
    ? reducedEntryInProgress
      ? 1 - reducedEntryProgress
      : Math.max(0, 1 - entryProgress * 1.2)
    : ctxOp;

  // The top-level Case Studies cluster is a compressed miniature of the
  // overview constellation. Shared geometry remains authored outside the hook.
  const caseStudyMiniatureTargets = overviewResolveTargets;

  const cycleProject = (direction: -1 | 1) => {
    setActiveFocusIndex((current) => {
      const next = current + direction;
      const len = CASE_STUDY_FOCUS_ITEMS.length;
      return (next + len) % len;
    });
  };

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

      <CaseStudiesChrome
        state={state}
        overviewChromeVisible={overviewChromeVisible}
        isReturningFromReading={isReturningFromReading}
        returnChromeVisible={returnChromeVisible}
        isExitingCaseStudies={isExitingCaseStudies}
        focusedEntryProjectId={focusedEntryProjectId}
        onExitToAtlas={exitCaseStudiesToAtlas}
        onOverviewBack={onOverviewBack}
      />

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
          closeDurationMs={DRAWER_CLOSE_DURATION}
          reducedDurationMs={REDUCED_MOTION_DRAWER_DURATION}
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
      {state === "system-overview" && <CaseStudiesOverviewSurface item={CASE_STUDY_FOCUS_ITEMS[activeFocusIndex]} />}
      {state === "atlas-landing" && <AtlasUtilitySheet />}
        </>
      )}
    </>
  );
}
