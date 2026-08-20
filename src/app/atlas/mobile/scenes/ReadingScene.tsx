/**
 * ReadingScene — project-reading | evidence-viewer
 * Agentic Insurance reading surface + evidence image inspection.
 */

import { useState } from "react";
import { T } from "../components/mobileShared";
import evidenceImg from "../../../../imports/case-studies/agentic-insurance/03-approach/3-adjusters-claim-overview.png";

// ── Reading surface (project-reading) ─────────────────────────────────────────
function ReadingSurface({ onEvidence, onBack }: { onEvidence: () => void; onBack: () => void }) {
  const c = T.caseStudies;
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div style={{
      position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
      background: `linear-gradient(
        to bottom,
        rgba(5,5,10,0.18) 0px,
        rgba(5,5,10,0.72) 80px,
        rgba(5,5,10,0.95) 160px,
        rgba(5,5,10,0.98) 220px
      )`,
      boxSizing: "border-box",
    }}>
      {/* Reading top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        padding: "22px 22px 0",
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
      }}>
        <div onClick={onBack} style={{
          fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.18em",
          color: T.gold, opacity: 0.36, cursor: "pointer", minHeight: 44,
          display: "flex", alignItems: "center",
        }}>
          ‹ OVERVIEW
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.18em", color: c, opacity: 0.72 }}>
            AGENTIC INSURANCE
          </div>
          <div
            onClick={() => setShowPicker((v) => !v)}
            style={{
              fontFamily: T.mono, fontSize: 7, letterSpacing: "0.16em",
              color: T.gold, opacity: 0.38, marginTop: 3, cursor: "pointer",
            }}
          >
            · · ·
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{
        position: "absolute", top: 100, bottom: 0, left: 0, right: 0,
        overflowY: "auto", padding: "0 28px 80px", boxSizing: "border-box",
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 18, paddingBottom: 14,
          borderBottom: "0.5px solid rgba(138,174,200,0.14)",
        }}>
          <div
            onClick={() => setShowPicker((v) => !v)}
            style={{
              fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.18em", color: c, opacity: 0.72, cursor: "pointer",
            }}
          >
            03 / 06 · APPROACH
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 7, color: T.gold, opacity: 0.28 }}>↕</div>
        </div>

        <div style={{ fontFamily: T.serif, fontSize: 22, color: T.gold, opacity: 0.82, lineHeight: 1.30, marginBottom: 8 }}>
          Using AI to investigate the role, not impersonate validation
        </div>
        <div style={{ height: 0.5, background: "rgba(232,213,163,0.10)", marginBottom: 20 }} />

        {[
          "I used public research, job descriptions, workflow documentation, industry material, and AI-assisted role simulation to build a more complete picture of the claim-adjuster experience.",
          "The AI-generated persona was not treated as a substitute for a real person. It was used as a research instrument — a way to ask more specific questions about the role, pressure-test assumptions, and identify areas I needed to investigate further.",
          "From that research, I mapped a customer and adjuster journey and explored where AI-assisted tools might support the process.",
        ].map((para, i) => (
          <div key={i} style={{
            fontFamily: T.serif, fontSize: 14, color: T.gold, opacity: 0.64,
            lineHeight: 1.68, marginBottom: 18,
          }}>
            {para}
          </div>
        ))}

        {/* Evidence entry */}
        <div
          onClick={onEvidence}
          style={{
            borderRadius: 4,
            border: `0.5px solid rgba(138,174,200,0.22)`,
            overflow: "hidden",
            marginBottom: 22,
            cursor: "pointer",
          }}
        >
          <img
            src={evidenceImg}
            alt="Adjuster Claims Overview"
            style={{ width: "100%", height: 110, objectFit: "cover", display: "block", opacity: 0.85 }}
          />
          <div style={{ background: "rgba(5,5,10,0.85)", padding: "10px 14px 12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <div style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.16em", color: c, opacity: 0.72 }}>
                03 · ADJUSTER CLAIMS OVERVIEW
              </div>
              <div style={{ fontFamily: T.mono, fontSize: 7, color: c, opacity: 0.42 }}>→ INSPECT</div>
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 6.5, letterSpacing: "0.12em", color: T.gold, opacity: 0.30 }}>
              UI CONCEPT
            </div>
          </div>
        </div>

        <div style={{ fontFamily: T.serif, fontSize: 14, color: T.gold, opacity: 0.60, lineHeight: 1.68, marginBottom: 18 }}>
          The concepts focused on areas such as summarizing claim information, identifying missing or conflicting evidence,
          surfacing jurisdictional or policy considerations, explaining why a case may require escalation, helping the adjuster
          compare possible next steps, and preserving a clear record of how a decision was reached.
        </div>

        <div style={{
          borderLeft: `1.5px solid rgba(138,174,200,0.30)`,
          paddingLeft: 16, marginBottom: 8,
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 7, letterSpacing: "0.18em", color: c, opacity: 0.45, marginBottom: 8 }}>
            SECTION INSIGHT
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 14.5, color: T.gold, opacity: 0.72, lineHeight: 1.60, fontStyle: "italic" }}>
            "AI was most useful when it helped me ask better questions about an unfamiliar role — not when it pretended to be the final source of truth."
          </div>
        </div>
      </div>

      {/* Section picker */}
      {showPicker && (
        <div
          onClick={() => setShowPicker(false)}
          style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(5,5,10,0.96)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            borderTop: `0.5px solid rgba(138,174,200,0.22)`,
            padding: "16px 0 48px",
            boxSizing: "border-box",
          }}
        >
          <div style={{
            fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.22em",
            color: T.gold, opacity: 0.28, padding: "0 28px", marginBottom: 12,
          }}>
            SECTIONS
          </div>
          {[["01", "CONTEXT"], ["02", "PROBLEM"], ["03", "APPROACH"], ["04", "DECISIONS"], ["05", "OUTCOMES"], ["06", "LESSONS"]].map(([num, name]) => (
            <div
              key={num}
              onClick={() => setShowPicker(false)}
              style={{
                padding: "13px 28px",
                display: "flex", alignItems: "center", gap: 16,
                borderBottom: `0.5px solid rgba(138,174,200,0.07)`,
                cursor: "pointer",
              }}
            >
              <div style={{ fontFamily: T.mono, fontSize: 8, color: c, opacity: 0.35, minWidth: 20 }}>
                {num}
              </div>
              <div style={{
                fontFamily: T.mono, fontSize: 9.5, letterSpacing: "0.16em",
                color: name === "APPROACH" ? c : T.gold,
                opacity: name === "APPROACH" ? 0.90 : 0.44,
              }}>
                {name}
              </div>
              {name === "APPROACH" && (
                <div style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: c, opacity: 0.7 }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Evidence viewer (evidence-viewer) ─────────────────────────────────────────
function EvidenceViewer({ onClose }: { onClose: () => void }) {
  const c = T.caseStudies;
  return (
    <div style={{
      position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
      background: "rgba(5,5,10,0.97)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{
        padding: "22px 22px 14px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0,
        borderBottom: `0.5px solid rgba(138,174,200,0.12)`,
      }}>
        <div onClick={onClose} style={{
          fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.18em",
          color: T.gold, opacity: 0.36, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
          minHeight: 44, paddingRight: 12,
        }}>
          ‹ APPROACH
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: "0.16em", color: c, opacity: 0.55 }}>
            03 · ADJUSTER CLAIMS OVERVIEW
          </div>
          <div style={{ fontFamily: T.mono, fontSize: 6.5, letterSpacing: "0.14em", color: T.gold, opacity: 0.28, marginTop: 2 }}>
            UI CONCEPT
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 60px" }}>
        <img
          src={evidenceImg}
          alt="Adjuster Claims Overview — a unified claims workspace supporting triage and faster orientation"
          style={{ width: "100%", display: "block", maxHeight: 520, objectFit: "contain" }}
        />
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          padding: "10px 0 18px",
          borderBottom: `0.5px solid rgba(138,174,200,0.10)`,
        }}>
          <div style={{ fontFamily: T.mono, fontSize: 7, letterSpacing: "0.18em", color: T.gold, opacity: 0.22 }}>
            PINCH TO INSPECT
          </div>
        </div>
        <div style={{ padding: "18px 28px 0" }}>
          <div style={{ fontFamily: T.mono, fontSize: 7, letterSpacing: "0.16em", color: c, opacity: 0.38, marginBottom: 8 }}>
            CAPTION
          </div>
          <div style={{ fontFamily: T.serif, fontSize: 13, color: T.gold, opacity: 0.54, lineHeight: 1.64 }}>
            A unified claims workspace intended to support triage, workload awareness, and faster orientation before the adjuster begins deeper analysis.
          </div>
        </div>
        <div style={{
          margin: "18px 28px 0",
          padding: "12px 0",
          borderTop: `0.5px solid rgba(232,213,163,0.07)`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: c, opacity: 0.45 }} />
          <div style={{ fontFamily: T.mono, fontSize: 6.5, letterSpacing: "0.16em", color: c, opacity: 0.35 }}>
            AGENTIC INSURANCE · 03 APPROACH
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
interface ReadingSceneProps {
  state: "project-reading" | "evidence-viewer";
  onEvidence: () => void;   // project-reading → evidence-viewer
  onBack: () => void;       // → project-overview (reading) | project-reading (evidence)
}

export default function ReadingScene({ state, onEvidence, onBack }: ReadingSceneProps) {
  return (
    <>
      {state === "project-reading" && (
        <ReadingSurface onEvidence={onEvidence} onBack={onBack} />
      )}
      {state === "evidence-viewer" && (
        <EvidenceViewer onClose={onBack} />
      )}
    </>
  );
}
