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
import CaseStudiesScene from "./scenes/CaseStudiesScene";
import ReadingScene from "./scenes/ReadingScene";
import FrameworksScene from "./scenes/FrameworksScene";

const STATE_LABELS: Record<MobileState, string> = {
  "atlas-landing":      "A · Landing",
  "system-awakened":    "B · CS Awakened",
  "system-overview":    "C · CS Overview",
  "case-studies-focus": "E · CS Focus",
  "project-awakened":   "F · Proj. Awakened",
  "project-overview":   "G · Proj. Overview",
  "project-reading":    "H · Reading",
  "evidence-viewer":    "I · Evidence",
  "frameworks-focus":   "J · FW Focus",
  "framework-awakened": "K · FW Awakened",
  "framework-overview": "L · FW Overview",
  "framework-reading":  "M · FW Reading",
  "framework-evidence": "N · FW Evidence",
};

const STATE_GROUPS: { label: string; color: string; states: MobileState[] }[] = [
  { label: "LANDING", color: T.gold, states: ["atlas-landing", "system-awakened", "system-overview"] },
  { label: "CASE STUDIES", color: T.caseStudies, states: ["case-studies-focus", "project-awakened", "project-overview", "project-reading", "evidence-viewer"] },
  { label: "FRAMEWORKS", color: T.frameworks, states: ["frameworks-focus", "framework-awakened", "framework-overview", "framework-reading", "framework-evidence"] },
];

const LANDING_STATES: readonly MobileState[] = ["atlas-landing", "system-awakened", "system-overview"];
const CS_FOCUS_STATES: readonly MobileState[] = ["case-studies-focus", "project-awakened", "project-overview"];
const CS_READING_STATES: readonly MobileState[] = ["project-reading", "evidence-viewer"];
const FW_STATES: readonly MobileState[] = ["frameworks-focus", "framework-awakened", "framework-overview", "framework-reading", "framework-evidence"];

type CaseStudyProjectId =
  | "agentic-insurance"
  | "globality"
  | "oracle"
  | "sovereign-atlas";

function isDebugMode() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).get("debug") === "1";
}

export default function MobileAtlas() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const runtimeViewportRef = useRef<HTMLDivElement>(null);
  useStarfield(canvasRef);

  const [sceneScale, setSceneScale] = useState(1);
  const [state, setStateRaw] = useState<MobileState>("atlas-landing");
  const [activeLayer, setActiveLayer] = useState<string>("governance");
  const [activeCaseStudyProjectId, setActiveCaseStudyProjectId] =
    useState<CaseStudyProjectId | null>(null);
  const [returnCaseStudyProjectId, setReturnCaseStudyProjectId] =
    useState<CaseStudyProjectId | null>(null);
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
      const nextScale = Math.min(width / W, height / H);
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
  const isCSFocus = (CS_FOCUS_STATES as readonly string[]).includes(state);
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
              onExplore={() => setState("case-studies-focus")}
              onSelectProject={(projectId) => {
                setActiveCaseStudyProjectId(projectId);
                setReturnCaseStudyProjectId(null);
                setState("project-reading");
              }}
              returnProjectId={returnCaseStudyProjectId}
              onReturnProjectComplete={() => {
                setReturnCaseStudyProjectId(null);
              }}
              onBack={() => {
                setActiveCaseStudyProjectId(null);
                setReturnCaseStudyProjectId(null);
                setState("atlas-landing");
              }}
            />
          )}

          {isCSFocus && (
            <CaseStudiesScene
              state={state as "case-studies-focus" | "project-awakened" | "project-overview"}
              onSelectProject={() => setState("project-awakened")}
              onProjectOverview={() => setState("project-overview")}
              onExplore={() => setState("project-reading")}
              onBack={() => setState("system-overview")}
            />
          )}

          {isCSReading && (
            <ReadingScene
              state="project-reading"
              onEvidence={() => setState("project-reading")}
              onBack={() => {
                setReturnCaseStudyProjectId(activeCaseStudyProjectId);
                setState("system-awakened");
              }}
            />
          )}

          {isFW && !isFrameworkReadingDepth && (
            <FrameworksScene
              state={state as "frameworks-focus" | "framework-awakened" | "framework-overview"}
              activeLayer={activeLayer}
              setActiveLayer={setActiveLayer}
              onSelectFramework={() => setState("framework-awakened")}
              onFrameworkOverview={() => setState("framework-overview")}
              onExplore={() => setState("framework-reading")}
              onCanvas={() => setState("framework-evidence")}
              onBack={() => {
                if (state === "framework-overview") setState("frameworks-focus");
                else if (state === "framework-awakened") setState("frameworks-focus");
                else setState("atlas-landing");
              }}
            />
          )}

          {isFrameworkReadingDepth && (
            <>
              <FrameworksScene
                state="framework-reading"
                activeLayer={activeLayer}
                setActiveLayer={setActiveLayer}
                onSelectFramework={() => setState("framework-awakened")}
                onFrameworkOverview={() => setState("framework-overview")}
                onExplore={() => setState("framework-reading")}
                onCanvas={() => setState("framework-evidence")}
                onBack={() => setState("framework-overview")}
              />
              {isFrameworkEvidence && (
                <FrameworksScene
                  state="framework-evidence"
                  activeLayer={activeLayer}
                  setActiveLayer={setActiveLayer}
                  onSelectFramework={() => setState("framework-awakened")}
                  onFrameworkOverview={() => setState("framework-overview")}
                  onExplore={() => setState("framework-reading")}
                  onCanvas={() => setState("framework-evidence")}
                  onBack={() => setState("framework-reading")}
                />
              )}
            </>
          )}
          </div>
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
