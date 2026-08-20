/**
 * ReadingScene — project-reading | evidence-viewer
 * Agentic Insurance reading surface + evidence image inspection.
 */

import { useEffect, useRef, useState } from "react";
import { T } from "../components/mobileShared";
import evidenceImg from "../../../../imports/case-studies/agentic-insurance/03-approach/3-adjusters-claim-overview.png";

function InspectableImage({
  src,
  alt,
  accent,
  maxHeight = 520,
}: {
  src: string;
  alt: string;
  accent: string;
  maxHeight?: number;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastTap = useRef(0);

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    pinchStart.current = null;
    panStart.current = null;
  };

  const clampScale = (next: number) => Math.min(4, Math.max(1, next));

  function distance() {
    const pts = [...pointers.current.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 1 && scale > 1) {
      panStart.current = { x: e.clientX, y: e.clientY, tx: translate.x, ty: translate.y };
    }

    if (pointers.current.size === 2) {
      pinchStart.current = { distance: distance(), scale };
      panStart.current = null;
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size >= 2 && pinchStart.current) {
      const d = distance();
      if (pinchStart.current.distance > 0) {
        setScale(clampScale(pinchStart.current.scale * (d / pinchStart.current.distance)));
      }
      return;
    }

    if (pointers.current.size === 1 && panStart.current && scale > 1) {
      setTranslate({
        x: panStart.current.tx + (e.clientX - panStart.current.x),
        y: panStart.current.ty + (e.clientY - panStart.current.y),
      });
    }
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
    if (pointers.current.size === 0) panStart.current = null;
  }

  function onDoubleTap() {
    const now = Date.now();
    if (now - lastTap.current < 280) {
      if (scale > 1) reset();
      else setScale(2);
    }
    lastTap.current = now;
  }

  return (
    <div>
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={onDoubleTap}
        style={{
          position: "relative",
          overflow: "hidden",
          touchAction: "none",
          background: "rgba(3,3,8,0.96)",
          borderBottom: `0.5px solid ${accent}22`,
          cursor: scale > 1 ? "grab" : "zoom-in",
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            width: "100%",
            display: "block",
            maxHeight,
            objectFit: "contain",
            transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${scale})`,
            transformOrigin: "center center",
            transition: pointers.current.size ? "none" : "transform 160ms ease",
            userSelect: "none",
            WebkitUserDrag: "none",
          }}
        />
      </div>

      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: 44,
        padding: "0 22px",
        borderBottom: `0.5px solid ${accent}1A`,
      }}>
        <div style={{
          fontFamily: T.mono,
          fontSize: 7,
          letterSpacing: "0.18em",
          color: T.gold,
          opacity: 0.24,
        }}>
          PINCH OR DOUBLE-TAP TO INSPECT
        </div>

        <button
          type="button"
          onClick={reset}
          disabled={scale === 1 && translate.x === 0 && translate.y === 0}
          style={{
            minWidth: 44,
            minHeight: 44,
            border: "none",
            background: "transparent",
            padding: 0,
            fontFamily: T.mono,
            fontSize: 7,
            letterSpacing: "0.16em",
            color: accent,
            opacity: scale === 1 && translate.x === 0 && translate.y === 0 ? 0.20 : 0.58,
            cursor: scale === 1 && translate.x === 0 && translate.y === 0 ? "default" : "pointer",
          }}
        >
          RESET
        </button>
      </div>
    </div>
  );
}

function ReadingSurface({ onEvidence, onBack }: { onEvidence: () => void; onBack: () => void }) {
  const c = T.caseStudies;
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      if (showPicker) setShowPicker(false);
      else onBack();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showPicker, onBack]);

  const sections = [
    ["01", "CONTEXT"],
    ["02", "PROBLEM"],
    ["03", "APPROACH"],
    ["04", "DECISIONS"],
    ["05", "OUTCOMES"],
    ["06", "LESSONS"],
  ] as const;

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
          <button
            type="button"
            aria-label="Open case study section picker"
            onClick={() => setShowPicker((v) => !v)}
            style={{
              minWidth: 44,
              minHeight: 44,
              marginTop: -4,
              marginRight: -10,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              background: "transparent",
              padding: 0,
              fontFamily: T.mono,
              fontSize: 8,
              letterSpacing: "0.16em",
              color: T.gold,
              opacity: 0.42,
              cursor: "pointer",
            }}
          >
            · · ·
          </button>
        </div>
      </div>

      <div style={{
        position: "absolute", top: 100, bottom: 0, left: 0, right: 0,
        overflowY: "auto", padding: "0 28px 80px", boxSizing: "border-box",
      }}>
        <button
          type="button"
          onClick={() => setShowPicker((v) => !v)}
          style={{
            width: "100%",
            minHeight: 44,
            padding: "0 0 14px",
            marginBottom: 18,
            border: "none",
            borderBottom: "0.5px solid rgba(138,174,200,0.14)",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <span style={{ fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.18em", color: c, opacity: 0.72 }}>
            03 / 06 · APPROACH
          </span>
          <span style={{ fontFamily: T.mono, fontSize: 7, color: T.gold, opacity: 0.28 }}>↕</span>
        </button>

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

      {showPicker && (
        <div style={{
          position: "absolute",
          inset: 0,
          background: "rgba(5,5,10,0.44)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}>
          <div
            onClick={() => setShowPicker(false)}
            style={{ position: "absolute", inset: 0 }}
          />
          <div
            role="dialog"
            aria-label="Case study sections"
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "rgba(5,5,10,0.97)",
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

            {sections.map(([num, name]) => {
              const isActive = name === "APPROACH";
              return (
                <button
                  type="button"
                  key={num}
                  disabled={!isActive}
                  onClick={() => isActive && setShowPicker(false)}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    width: "100%",
                    minHeight: 48,
                    padding: "0 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    border: "none",
                    borderBottom: `0.5px solid rgba(138,174,200,0.07)`,
                    background: "transparent",
                    textAlign: "left",
                    cursor: isActive ? "pointer" : "default",
                    opacity: isActive ? 1 : 0.42,
                  }}
                >
                  <span style={{ fontFamily: T.mono, fontSize: 8, color: c, opacity: 0.35, minWidth: 20 }}>
                    {num}
                  </span>
                  <span style={{
                    fontFamily: T.mono, fontSize: 9.5, letterSpacing: "0.16em",
                    color: isActive ? c : T.gold,
                    opacity: isActive ? 0.90 : 0.44,
                  }}>
                    {name}
                  </span>
                  {isActive && (
                    <span style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: c, opacity: 0.7 }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function EvidenceViewer({ onClose }: { onClose: () => void }) {
  const c = T.caseStudies;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

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
        <InspectableImage
          src={evidenceImg}
          alt="Adjuster Claims Overview — a unified claims workspace supporting triage and faster orientation"
          accent={c}
        />

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

interface ReadingSceneProps {
  state: "project-reading" | "evidence-viewer";
  onEvidence: () => void;
  onBack: () => void;
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
