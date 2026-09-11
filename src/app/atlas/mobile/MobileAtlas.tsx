/**
 * MobileAtlas — Sovereign Atlas mobile prototype orchestrator.
 */

import { useLayoutEffect, useRef, useState } from "react";
import {
  T, W, H, MOBILE_STATES,
  useStarfield,
  type MobileState,
} from "./components/mobileShared";
import LandingScene from "./scenes/LandingScene";
import ReadingScene from "./scenes/ReadingScene";
import FrameworksScene from "./scenes/FrameworksScene";
import type { MobileCaseStudyProjectId } from "./reading/mobileReadingTypes";
import type { MobileFrameworkId } from "./frameworks/mobileFrameworkTypes";
import { DEFAULT_MOBILE_FRAMEWORK_ID, mobileFrameworkFor } from "./frameworks/frameworkRegistry";

const STATE_LABELS: Record<MobileState, string> = {
  "atlas-landing":      "A · Landing",
  "system-awakened":    "B · CS Awakened",
  "system-overview":    "C · CS Overview",
  "project-reading":    "H · Reading",
  "frameworks-focus":   "J · FW Focus",
  "framework-awakened": "K · FW Awakened",
  "framework-overview": "L · FW Overview",
  "framework-reading":  "M · FW Reading",
  "framework-evidence": "N · FW Evidence",
};

const STATE_GROUPS: { label: string; color: string; states: MobileState[] }[] = [
  { label: "LANDING", color: T.gold, states: ["atlas-landing", "system-awakened", "system-overview"] },
  { label: "CASE STUDIES", color: T.caseStudies, states: ["project-reading"] },
  { label: "FRAMEWORKS", color: T.frameworks, states: ["frameworks-focus", "framework-awakened", "framework-overview", "framework-reading", "framework-evidence"] },
];

const LANDING_STATES: readonly MobileState[] = ["atlas-landing", "system-awakened", "system-overview"];
const CS_READING_STATES: readonly MobileState[] = ["project-reading"];
const FW_STATES: readonly MobileState[] = ["frameworks-focus", "framework-awakened", "framework-overview", "framework-reading", "framework-evidence"];


function isDebugMode() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debug") === "1";
}

export default function MobileAtlas() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const runtimeViewportRef = useRef<HTMLDivElement>(null);
  useStarfield(canvasRef);

  const [sceneScale, setSceneScale] = useState(1);
  const [viewportUiTarget, setViewportUiTarget] = useState<HTMLDivElement | null>(null);
  const [state, setStateRaw] = useState<MobileState>("atlas-landing");
  const [activeFrameworkId, setActiveFrameworkId] =
    useState<MobileFrameworkId>(DEFAULT_MOBILE_FRAMEWORK_ID);
  const [activeFrameworkSectionId, setActiveFrameworkSectionId] =
    useState<string>("governance");
  const [activeFrameworkEvidenceId, setActiveFrameworkEvidenceId] =
    useState<string | null>(null);
  const [activeCaseStudyProjectId, setActiveCaseStudyProjectId] =
    useState<MobileCaseStudyProjectId | null>(null);
  const [returnCaseStudyProjectId, setReturnCaseStudyProjectId] =
    useState<MobileCaseStudyProjectId | null>(null);
  const debugMode = isDebugMode();

  useLayoutEffect(() => {
    const viewport = runtimeViewportRef.current;
    if (!viewport) return;

    function updateSceneScale() {
      const width = viewport.clientWidth;
      const height = viewport.clientHeight;
      if (width <= 0 || height <= 0) return;

      // Uniform contain scaling:
      // preserve the authored 390×844 scene as one composition.
      // On wide preview surfaces, stop scaling once the mobile presentation
      // reaches the same 430px width used by Focused Mode.
      const maxPresentationScale = 430 / W;
      const nextScale = Math.min(
        width / W,
        height / H,
        maxPresentationScale,
      );
      setSceneScale(nextScale);
    }

    updateSceneScale();
    window.addEventListener("resize", updateSceneScale);

    return () => {
      window.removeEventListener("resize", updateSceneScale);
    };
  }, []);

  function setState(next: MobileState) {
    if ((MOBILE_STATES as readonly string[]).includes(next)) setStateRaw(next);
    else setStateRaw("atlas-landing");
  }

  const isLanding = (LANDING_STATES as readonly string[]).includes(state);
  const isCSReading = (CS_READING_STATES as readonly string[]).includes(state);
  const isFW = (FW_STATES as readonly string[]).includes(state);
  const isFrameworkReadingDepth = state === "framework-reading" || state === "framework-evidence";
  const isFrameworkEvidence = state === "framework-evidence";

  return (
    <>
      <style>{`
        .mobile-atlas-root,
        .mobile-atlas-root * { -webkit-tap-highlight-color: transparent; }
        .mobile-atlas-root { overscroll-behavior: contain; touch-action: manipulation; }
        .mobile-atlas-root * { scrollbar-width: none; -ms-overflow-style: none; }
        .mobile-atlas-root *::-webkit-scrollbar { width: 0; height: 0; display: none; }
        @media (prefers-reduced-motion: reduce) {
          .mobile-atlas-root *,
          .mobile-atlas-root *::before,
          .mobile-atlas-root *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>

      <div
        className="mobile-atlas-root"
        style={{
          minHeight: debugMode ? "100vh" : "100dvh",
          width: "100%",
          background: "#080810",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: debugMode ? 24 : 0,
          padding: debugMode ? "48px 24px 60px" : 0,
          fontFamily: T.mono,
        }}
      >
        {debugMode && (
          <div style={{ color: "rgba(232,213,163,0.32)", fontSize: 9, letterSpacing: "0.32em" }}>
            SOVEREIGN ATLAS · MOBILE PROTOTYPE · 390 × 844
          </div>
        )}

        <div
          ref={runtimeViewportRef}
          className="mobile-atlas-runtime-viewport"
          style={{
            position: "relative",
            width: debugMode ? W : "100%",
            height: debugMode ? H : "100dvh",
            overflow: "hidden",
            background: T.bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              display: "block",
              pointerEvents: "none",
            }}
          />

          <div style={{
            position: "relative",
            width: W,
            height: H,
            overflow: "hidden",
            overscrollBehavior: "contain",
            borderRadius: debugMode ? 48 : 0,
            border: debugMode ? "1.5px solid rgba(232,213,163,0.10)" : "none",
            boxShadow: debugMode
              ? "0 0 0 6px rgba(5,5,10,0.9), 0 0 80px rgba(138,174,200,0.055), 0 40px 120px rgba(0,0,0,0.85)"
              : "none",
            background: "transparent",
            flexShrink: 0,
            transform: `scale(${sceneScale})`,
            transformOrigin: "center center",
          }}>
            {isLanding && (
              <LandingScene
                state={state as "atlas-landing" | "system-awakened" | "system-overview"}
                onSelectCaseStudies={() => setState("system-awakened")}
                onSelectFrameworks={() => setState("frameworks-focus")}
                onOverviewExpand={() => setState("system-overview")}
                onOverviewBack={() => setState("system-awakened")}
                onSelectProject={(projectId) => {
                  setActiveCaseStudyProjectId(projectId);
                  setReturnCaseStudyProjectId(null);
                  setState("project-reading");
                }}
                returnProjectId={returnCaseStudyProjectId}
                onReturnProjectComplete={() => {
                  setReturnCaseStudyProjectId(null);
                }}
                viewportUiTarget={viewportUiTarget}
                onBack={() => {
                  setActiveCaseStudyProjectId(null);
                  setReturnCaseStudyProjectId(null);
                  setState("atlas-landing");
                }}
              />
            )}

            {isFW && !isFrameworkReadingDepth && (
              <FrameworksScene
                state={state as "frameworks-focus" | "framework-awakened" | "framework-overview"}
                activeFrameworkId={activeFrameworkId}
                activeSectionId={activeFrameworkSectionId}
                setActiveSectionId={setActiveFrameworkSectionId}
                onSelectFramework={(frameworkId) => {
                  const nextFramework = mobileFrameworkFor(frameworkId);
                  setActiveFrameworkId(frameworkId);
                  setActiveFrameworkSectionId(nextFramework.sections[0]?.id ?? "");
                  setActiveFrameworkEvidenceId(null);
                  setState("framework-awakened");
                }}
                onSelectParent={() => setState("frameworks-focus")}
                onFrameworkOverview={() => setState("framework-overview")}
                onExplore={() => setState("framework-reading")}
                onCanvas={(evidenceId) => {
                  setActiveFrameworkEvidenceId(evidenceId);
                  setState("framework-evidence");
                }}
                activeEvidenceId={activeFrameworkEvidenceId}
                onBack={() => setState("atlas-landing")}
              />
            )}

            {isFrameworkReadingDepth && (
              <>
                <FrameworksScene
                  state="framework-reading"
                  activeFrameworkId={activeFrameworkId}
                  activeSectionId={activeFrameworkSectionId}
                  setActiveSectionId={setActiveFrameworkSectionId}
                  onSelectFramework={setActiveFrameworkId}
                  onSelectParent={() => setState("frameworks-focus")}
                  onFrameworkOverview={() => setState("framework-overview")}
                  onExplore={() => setState("framework-reading")}
                  onCanvas={(evidenceId) => {
                  setActiveFrameworkEvidenceId(evidenceId);
                  setState("framework-evidence");
                }}
                activeEvidenceId={activeFrameworkEvidenceId}
                  onBack={() => setState("framework-overview")}
                />
                {isFrameworkEvidence && (
                  <FrameworksScene
                    state="framework-evidence"
                    activeFrameworkId={activeFrameworkId}
                    activeSectionId={activeFrameworkSectionId}
                    setActiveSectionId={setActiveFrameworkSectionId}
                    onSelectFramework={setActiveFrameworkId}
                    onSelectParent={() => setState("frameworks-focus")}
                    onFrameworkOverview={() => setState("framework-overview")}
                    onExplore={() => setState("framework-reading")}
                    onCanvas={(evidenceId) => {
                  setActiveFrameworkEvidenceId(evidenceId);
                  setState("framework-evidence");
                }}
                activeEvidenceId={activeFrameworkEvidenceId}
                    onBack={() => {
                      setActiveFrameworkEvidenceId(null);
                      setState("framework-reading");
                    }}
                  />
                )}
              </>
            )}
          </div>

          <div
            ref={(node) => setViewportUiTarget(node)}
            className="mobile-atlas-viewport-ui"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: "50%",
              width: "min(100%, 430px)",
              transform: "translateX(-50%)",
              zIndex: 20,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          />

          {isCSReading && (
            <div
              className="mobile-atlas-reading-layer"
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 30,
                overflow: "hidden",
                pointerEvents: "auto",
              }}
            >
              <ReadingScene
                projectId={activeCaseStudyProjectId}
                onBack={() => {
                  setReturnCaseStudyProjectId(activeCaseStudyProjectId);
                  setState("system-awakened");
                }}
              />
            </div>
          )}
        </div>

        {debugMode && (
          <>
            <div style={{ color: "rgba(232,213,163,0.28)", fontSize: 8.5, letterSpacing: "0.22em", textAlign: "center" }}>
              {STATE_LABELS[state]}
            </div>

            <div style={{
              borderTop: "0.5px solid rgba(232,213,163,0.10)",
              paddingTop: 20,
              width: "100%",
              maxWidth: 560,
            }}>
              <div style={{
                fontFamily: T.mono,
                fontSize: 7,
                letterSpacing: "0.22em",
                color: "rgba(232,213,163,0.22)",
                marginBottom: 14,
                textAlign: "center",
              }}>
                DEV · STATE SWITCHER · NOT PART OF MOBILE EXPERIENCE
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {STATE_GROUPS.map((group) => (
                  <div key={group.label} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                    <div style={{
                      fontFamily: T.mono,
                      fontSize: 6,
                      letterSpacing: "0.18em",
                      color: group.color,
                      opacity: 0.28,
                      minWidth: 80,
                      paddingRight: 8,
                      textAlign: "right",
                    }}>
                      {group.label}
                    </div>
                    <div style={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                      background: `rgba(${group.color === T.gold ? "232,213,163" : group.color === T.caseStudies ? "138,174,200" : "106,184,138"},0.05)`,
                      borderRadius: 4,
                      padding: 2,
                    }}>
                      {group.states.map((s) => (
                        <button
                          key={s}
                          onClick={() => setState(s)}
                          style={{
                            background: state === s
                              ? `rgba(${group.color === T.gold ? "232,213,163" : group.color === T.caseStudies ? "138,174,200" : "106,184,138"},0.16)`
                              : "transparent",
                            border: "none",
                            color: state === s ? group.color : `${group.color}66`,
                            fontFamily: T.mono,
                            fontSize: 7.5,
                            letterSpacing: "0.14em",
                            padding: "7px 10px",
                            cursor: "pointer",
                            borderRadius: 3,
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {STATE_LABELS[s]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              color: "rgba(232,213,163,0.12)",
              fontSize: 7.5,
              letterSpacing: "0.14em",
              textAlign: "center",
              lineHeight: 1.7,
            }}>
              MOBILE PROTOTYPE · Focused Mode Pass 2
            </div>
          </>
        )}
      </div>
    </>
  );
}
