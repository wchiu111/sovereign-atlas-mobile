/**
 * MobileAtlas — Sovereign Atlas mobile prototype orchestrator.
 *
 * DESIGN PROTOTYPE ONLY — isolated from production Atlas.
 * Does not modify any existing desktop Atlas components.
 *
 * Semantic state machine:
 *   atlas-landing        A  Full atlas, all systems at rest
 *   system-awakened      B  Case Studies activated on landing
 *   system-overview      C/D Case Studies overview (scrollable)
 *   case-studies-focus   E  CS project constellation
 *   project-awakened     F  Agentic Insurance enlarged
 *   project-overview     G  AI project overview panel
 *   project-reading      H  Reading surface
 *   evidence-viewer      I  Evidence image inspection
 *   frameworks-focus     J  6-framework constellation
 *   framework-awakened   K  Behavioral Architecture enlarged
 *   framework-overview   L  BA overview panel
 *   framework-reading    M  BA layer navigation
 *   framework-evidence   N  BA artifact / canvas
 */

import { useRef, useState } from "react";
import {
  T, W, H, MOBILE_STATES,
  useStarfield,
  type MobileState,
} from "./components/mobileShared";
import LandingScene   from "./scenes/LandingScene";
import CaseStudiesScene from "./scenes/CaseStudiesScene";
import ReadingScene   from "./scenes/ReadingScene";
import FrameworksScene from "./scenes/FrameworksScene";

// ── Semantic state labels for dev switcher ────────────────────────────────────
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
  {
    label: "LANDING",
    color: T.gold,
    states: ["atlas-landing", "system-awakened", "system-overview"],
  },
  {
    label: "CASE STUDIES",
    color: T.caseStudies,
    states: ["case-studies-focus", "project-awakened", "project-overview", "project-reading", "evidence-viewer"],
  },
  {
    label: "FRAMEWORKS",
    color: T.frameworks,
    states: ["frameworks-focus", "framework-awakened", "framework-overview", "framework-reading", "framework-evidence"],
  },
];

// ── State classification helpers ──────────────────────────────────────────────
const LANDING_STATES:    readonly MobileState[] = ["atlas-landing", "system-awakened", "system-overview"];
const CS_FOCUS_STATES:   readonly MobileState[] = ["case-studies-focus", "project-awakened", "project-overview"];
const CS_READING_STATES: readonly MobileState[] = ["project-reading", "evidence-viewer"];
const FW_STATES:         readonly MobileState[] = ["frameworks-focus", "framework-awakened", "framework-overview", "framework-reading", "framework-evidence"];

// ── Main orchestrator ─────────────────────────────────────────────────────────
export default function MobileAtlas() {
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  useStarfield(canvasRef);

  const [state, setStateRaw] = useState<MobileState>("atlas-landing");
  const [activeLayer, setActiveLayer] = useState<string>("governance");

  // Explicit validation guard — prevents blank preview from stale dev state
  function setState(next: MobileState) {
    if ((MOBILE_STATES as readonly string[]).includes(next)) {
      setStateRaw(next);
    } else {
      setStateRaw("atlas-landing");
    }
  }

  // Scene classification
  const isLanding   = (LANDING_STATES    as readonly string[]).includes(state);
  const isCSFocus   = (CS_FOCUS_STATES   as readonly string[]).includes(state);
  const isCSReading = (CS_READING_STATES as readonly string[]).includes(state);
  const isFW        = (FW_STATES         as readonly string[]).includes(state);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080810",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      padding: "48px 24px 60px",
      fontFamily: T.mono,
    }}>
      {/* Header */}
      <div style={{ color: "rgba(232,213,163,0.32)", fontSize: 9, letterSpacing: "0.32em" }}>
        SOVEREIGN ATLAS · MOBILE PROTOTYPE · 390 × 844
      </div>

      {/* ── Phone frame ──────────────────────────────────────────────────────── */}
      <div style={{
        position: "relative", width: W, height: H,
        overflow: "hidden", borderRadius: 48,
        border: "1.5px solid rgba(232,213,163,0.10)",
        boxShadow:
          "0 0 0 6px rgba(5,5,10,0.9), " +
          "0 0 80px rgba(138,174,200,0.055), " +
          "0 40px 120px rgba(0,0,0,0.85)",
        background: T.bg, flexShrink: 0,
      }}>
        {/* Starfield — always running */}
        <canvas ref={canvasRef}
          style={{ position: "absolute", inset: 0, width: W, height: H, display: "block" }} />

        {/* ── Landing scene (atlas-landing | system-awakened | system-overview) ── */}
        {isLanding && (
          <LandingScene
            state={state as "atlas-landing" | "system-awakened" | "system-overview"}
            onSelectCaseStudies={() => setState("system-awakened")}
            onSelectFrameworks={() => setState("frameworks-focus")}
            onOverviewExpand={() => setState("system-overview")}
            onExplore={() => setState("case-studies-focus")}
            onBack={() => setState("atlas-landing")}
          />
        )}

        {/* ── Case Studies constellation (case-studies-focus | project-awakened | project-overview) ── */}
        {isCSFocus && (
          <CaseStudiesScene
            state={state as "case-studies-focus" | "project-awakened" | "project-overview"}
            onSelectProject={() => setState("project-awakened")}
            onProjectOverview={() => setState("project-overview")}
            onExplore={() => setState("project-reading")}
            onBack={() => setState("system-overview")}
          />
        )}

        {/* ── Reading + evidence (project-reading | evidence-viewer) ── */}
        {isCSReading && (
          <ReadingScene
            state={state as "project-reading" | "evidence-viewer"}
            onEvidence={() => setState("evidence-viewer")}
            onBack={() => {
              if (state === "evidence-viewer") setState("project-reading");
              else setState("project-overview");
            }}
          />
        )}

        {/* ── Frameworks (frameworks-focus | framework-awakened | framework-overview | framework-reading | framework-evidence) ── */}
        {isFW && (
          <FrameworksScene
            state={state as "frameworks-focus" | "framework-awakened" | "framework-overview" | "framework-reading" | "framework-evidence"}
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            onSelectFramework={() => setState("framework-awakened")}
            onFrameworkOverview={() => setState("framework-overview")}
            onExplore={() => setState("framework-reading")}
            onCanvas={() => setState("framework-evidence")}
            onBack={() => {
              if (state === "framework-evidence") setState("framework-reading");
              else if (state === "framework-reading") setState("framework-overview");
              else if (state === "framework-overview") setState("frameworks-focus");
              else if (state === "framework-awakened") setState("frameworks-focus");
              else setState("atlas-landing");
            }}
          />
        )}
      </div>
      {/* ── End phone frame ──────────────────────────────────────────────────── */}

      {/* State label */}
      <div style={{ color: "rgba(232,213,163,0.28)", fontSize: 8.5, letterSpacing: "0.22em", textAlign: "center" }}>
        {STATE_LABELS[state]}
      </div>

      {/* ── Dev state switcher (outside viewport, prototype tooling only) ─────── */}
      <div style={{
        borderTop: "0.5px solid rgba(232,213,163,0.10)",
        paddingTop: 20,
        width: "100%",
        maxWidth: 560,
      }}>
        <div style={{
          fontFamily: T.mono, fontSize: 7, letterSpacing: "0.22em",
          color: "rgba(232,213,163,0.22)", marginBottom: 14, textAlign: "center",
        }}>
          DEV · STATE SWITCHER · NOT PART OF MOBILE EXPERIENCE
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {STATE_GROUPS.map((group) => (
            <div key={group.label} style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <div style={{
                fontFamily: T.mono, fontSize: 6, letterSpacing: "0.18em",
                color: group.color, opacity: 0.28, minWidth: 80,
                paddingRight: 8, textAlign: "right",
              }}>
                {group.label}
              </div>
              <div style={{
                display: "flex", gap: 2, flexWrap: "wrap",
                background: `rgba(${group.color === T.gold ? "232,213,163" : group.color === T.caseStudies ? "138,174,200" : "106,184,138"},0.05)`,
                borderRadius: 4, padding: 2,
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
                      color: state === s
                        ? group.color
                        : `${group.color}66`,
                      fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.14em",
                      padding: "7px 10px", cursor: "pointer", borderRadius: 3,
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

      {/* Prototype note */}
      <div style={{ color: "rgba(232,213,163,0.12)", fontSize: 7.5, letterSpacing: "0.14em", textAlign: "center", lineHeight: 1.7 }}>
        MOBILE PROTOTYPE · Phase 3 · Isolated from production Atlas
      </div>
    </div>
  );
}
