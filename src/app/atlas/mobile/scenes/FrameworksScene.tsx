/**
 * FrameworksScene — frameworks-focus | framework-awakened | framework-overview
 *                   | framework-reading | framework-evidence
 * FW constellation + BA overview, layer reading, and canvas inspection.
 */

import { useEffect, useRef, useState } from "react";
import { T, ANIM, FADE, W, H } from "../components/mobileShared";
import baEvidenceImg from "../../../../imports/frameworks/behavioral-architecture/01-governance/behavioral-architecture.jpg";

interface FwDef { id: string; label: string; x: number; y: number; }

const FW_FRAMEWORKS: FwDef[] = [
  { id: "authority-gradient",     label: "AUTHORITY GRADIENT",     x: 90,  y: 192 },
  { id: "model-design",           label: "MODEL DESIGN",           x: 293, y: 220 },
  { id: "relational-ai-literacy", label: "RELATIONAL AI LITERACY", x: 90,  y: 360 },
  { id: "presence-navigation",    label: "PRESENCE NAVIGATION",    x: 292, y: 372 },
  { id: "regenerative-systems",   label: "REGENERATIVE SYSTEMS",   x: 118, y: 512 },
  { id: "application-kit",        label: "APPLICATION KIT",        x: 270, y: 510 },
];

const FW_CTR = { x: 192, y: 358 };

const BA_LAYERS = [
  { id: "governance",            label: "GOVERNANCE",            short: "G", deg: -160 },
  { id: "constraints",           label: "CONSTRAINTS",           short: "C", deg: -128 },
  { id: "behavioral-integrity",  label: "BEHAVIORAL INTEGRITY",  short: "I", deg:  -93 },
  { id: "regenerative-capacity", label: "REGENERATIVE CAPACITY", short: "R", deg:  -30 },
];

type FWState = "frameworks-focus" | "framework-awakened" | "framework-overview" | "framework-reading" | "framework-evidence";

const MD_STATE: Record<FWState, { x: number; y: number; orbitR: number; opacity: number }> = {
  "frameworks-focus":    { x: 293, y: 220, orbitR: 26, opacity: 1    },
  "framework-awakened":  { x: 195, y: 248, orbitR: 56, opacity: 1    },
  "framework-overview":  { x: 195, y: 232, orbitR: 50, opacity: 1    },
  "framework-reading":   { x: 195, y: 82,  orbitR: 22, opacity: 0.38 },
  "framework-evidence":  { x: 195, y: 82,  orbitR: 22, opacity: 0.20 },
};

const FW_SIBLING_OP: Record<FWState, number> = {
  "frameworks-focus": 1, "framework-awakened": 0.10, "framework-overview": 0.10, "framework-reading": 0.06, "framework-evidence": 0.04,
};
const FW_PARENT_OP: Record<FWState, number> = {
  "frameworks-focus": 0.20, "framework-awakened": 0.10, "framework-overview": 0.08, "framework-reading": 0.05, "framework-evidence": 0.03,
};
const LAYER_STAR_OP: Record<FWState, number> = {
  "frameworks-focus": 0, "framework-awakened": 0.95, "framework-overview": 0.82, "framework-reading": 0, "framework-evidence": 0,
};
const CONN_OP: Record<FWState, number> = {
  "frameworks-focus": 1, "framework-awakened": 0.22, "framework-overview": 0.08, "framework-reading": 0.04, "framework-evidence": 0.04,
};

function FWParentNode({ op }: { op: number }) {
  const c = T.frameworks;
  return (
    <g style={{ transform: `translate(${FW_CTR.x}px,${FW_CTR.y}px)`, opacity: op, transition: FADE }}>
      <circle r={72} fill="none" stroke={c} strokeWidth={0.3} opacity={0.05} />
      <circle r={48} fill="none" stroke={c} strokeWidth={0.35} opacity={0.08} />
      <circle r={28} fill="none" stroke={c} strokeWidth={0.4} opacity={0.12} />
      <circle r={10} fill={c} opacity={0.40} />
      <circle r={4} fill={c} opacity={0.80} />
      <text y={26} textAnchor="middle" fontFamily={T.mono} fontSize={6.5} letterSpacing="0.2em" fill={c} opacity={0.66}>
        FRAMEWORKS
      </text>
    </g>
  );
}

function FrameworkNode({ label, cx, cy, awakened, onClick }: {
  label: string; cx: number; cy: number; awakened: boolean; onClick?: () => void;
}) {
  const c = T.frameworks;
  const coreR = awakened ? 8 : 5;
  const innerR = awakened ? 20 : 13;
  const outerR = awakened ? 36 : 20;

  return (
    <g onClick={onClick} style={{ transform: `translate(${cx}px,${cy}px)`, transition: ANIM, cursor: onClick ? "pointer" : "default" }}>
      <circle r={outerR} fill={c} opacity={awakened ? 0.09 : 0.04} pointerEvents="none" style={{ transition: FADE }} />
      <circle r={innerR} fill={c} opacity={awakened ? 0.19 : 0.10} pointerEvents="none" style={{ transition: FADE }} />
      <circle r={awakened ? 26 : 16} fill="none" stroke={c} strokeWidth={0.5} opacity={awakened ? 0.30 : 0.09} pointerEvents="none" style={{ transition: FADE }} />
      <circle r={coreR} fill={c} pointerEvents="none" style={{ transition: FADE }} />
      <text y={coreR + 16} textAnchor="middle" fontFamily={T.mono} fontSize={7.5} letterSpacing="0.13em" fill={c} opacity={0.70} pointerEvents="none">
        {label}
      </text>
      {onClick && <circle r={22} fill="transparent" pointerEvents="all" />}
    </g>
  );
}

function FwConstellationConnections({ op }: { op: number }) {
  const c = T.frameworks;
  const [ag, md, ral, pn, rs, ak] = FW_FRAMEWORKS;
  return (
    <g style={{ opacity: op, transition: FADE }}>
      <line x1={ag.x} y1={ag.y} x2={md.x} y2={md.y} stroke={c} strokeWidth={0.32} strokeDasharray="3 7" opacity={0.16} />
      <line x1={ral.x} y1={ral.y} x2={pn.x} y2={pn.y} stroke={c} strokeWidth={0.32} strokeDasharray="3 7" opacity={0.14} />
      <line x1={rs.x} y1={rs.y} x2={ak.x} y2={ak.y} stroke={c} strokeWidth={0.32} strokeDasharray="3 7" opacity={0.16} />
      <line x1={ag.x} y1={ag.y} x2={ral.x} y2={ral.y} stroke={c} strokeWidth={0.28} strokeDasharray="2 9" opacity={0.10} />
      <line x1={ral.x} y1={ral.y} x2={rs.x} y2={rs.y} stroke={c} strokeWidth={0.28} strokeDasharray="2 9" opacity={0.10} />
      <line x1={md.x} y1={md.y} x2={pn.x} y2={pn.y} stroke={c} strokeWidth={0.28} strokeDasharray="2 9" opacity={0.09} />
      <line x1={rs.x} y1={rs.y} x2={md.x} y2={md.y} stroke={c} strokeWidth={0.22} strokeDasharray="1.5 11" opacity={0.06} />
      {FW_FRAMEWORKS.map((f) => <line key={f.id} x1={f.x} y1={f.y} x2={FW_CTR.x} y2={FW_CTR.y} stroke={c} strokeWidth={0.22} opacity={0.04} />)}
    </g>
  );
}

function LayerStars({
  mdX, mdY, radius, opacity,
}: {
  mdX: number; mdY: number; radius: number; opacity: number;
}) {
  const c = T.frameworks;
  return (
    <g style={{ opacity, transition: FADE }}>
      <path
        d={(() => {
          const startDeg = -160;
          const endDeg   =  -30;
          const sx = mdX + radius * Math.cos((startDeg * Math.PI) / 180);
          const sy = mdY + radius * Math.sin((startDeg * Math.PI) / 180);
          const ex = mdX + radius * Math.cos((endDeg   * Math.PI) / 180);
          const ey = mdY + radius * Math.sin((endDeg   * Math.PI) / 180);
          return `M ${sx} ${sy} A ${radius} ${radius} 0 0 1 ${ex} ${ey}`;
        })()}
        fill="none" stroke={c} strokeWidth={0.4} strokeDasharray="2.5 5.5" opacity={0.18}
      />
      {BA_LAYERS.map((layer) => {
        const rad = (layer.deg * Math.PI) / 180;
        const lx  = mdX + Math.cos(rad) * radius;
        const ly  = mdY + Math.sin(rad) * radius;
        const ldx = Math.cos(rad);
        const ldy = Math.sin(rad);
        const ta  = ldx > 0.28 ? "start" : ldx < -0.28 ? "end" : "middle";
        const db  = ldy > 0.28 ? "hanging" : ldy < -0.28 ? "auto" : "middle";
        return (
          <g key={layer.id} style={{ transform: `translate(${lx}px,${ly}px)`, transition: ANIM }}>
            <line
              x1={-Math.cos(rad) * (radius - 6)} y1={-Math.sin(rad) * (radius - 6)}
              x2={0} y2={0}
              stroke={c} strokeWidth={0.3} opacity={0.12}
            />
            <circle r={2.5} fill={c} opacity={0.65} />
            <circle r={8}   fill={c} opacity={0.09} />
            <text x={ldx * 7} y={ldy * 7}
              textAnchor={ta} dominantBaseline={db}
              fontFamily={T.mono} fontSize={5} letterSpacing="0.12em"
              fill={c} opacity={0.52}>
              {layer.label}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function FWFocusTopBar({ onBack }: { onBack: () => void }) {
  const c = T.frameworks;
  return (
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "22px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", pointerEvents: "none" }}>
      <div onClick={onBack} style={{ display: "flex", alignItems: "center", pointerEvents: "auto", cursor: "pointer", minHeight: 44 }}>
        <span style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.18em", color: T.body, opacity: 0.72 }}>‹ ATLAS</span>
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.22em", color: c, opacity: 0.78 }}>FRAMEWORKS</div>
    </div>
  );
}

function BehavioralOverviewSurface({ onExplore }: { onExplore: () => void }) {
  const c = T.frameworks;
  return (
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, boxSizing: "border-box", borderTop: `0.5px solid rgba(106,184,138,0.24)`, background: "rgba(5,5,10,0.92)", backdropFilter: "blur(28px)", padding: "22px 28px 52px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 3 }}>
        <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: "0.20em", color: c, opacity: 0.92 }}>BEHAVIORAL ARCHITECTURE</div>
        <div style={{ fontFamily: T.mono, fontSize: 7, letterSpacing: "0.14em", color: T.body, opacity: 0.68, marginTop: 2 }}>FRAMEWORK</div>
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.16em", color: T.body, opacity: 0.68, marginBottom: 14 }}>CORE FRAMEWORK · SYSTEM CHARACTER</div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
        {BA_LAYERS.map((layer) => <div key={layer.id} style={{ fontFamily: T.mono, fontSize: 6.5, letterSpacing: "0.14em", color: c, opacity: 0.72, border: `0.5px solid rgba(106,184,138,0.26)`, borderRadius: 2, padding: "3px 8px" }}>{layer.label}</div>)}
      </div>
      <div style={{ height: 0.5, background: "rgba(232,213,163,0.09)", marginBottom: 16 }} />
      {[
        { label: "WHAT", body: "A framework for designing the structures around an AI model that give its behavior a stable, trustworthy shape." },
        { label: "KEY DISCOVERY", body: "Trustworthy behavior does not come from the model alone. It emerges from the architecture governing what the system may do, how its behavior is evaluated, and how it recovers when alignment begins to drift." },
      ].map(({ label, body }) => (
        <div key={label} style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: T.mono, fontSize: 7, letterSpacing: "0.20em", color: T.accentGold, opacity: 0.72, marginBottom: 6 }}>{label}</div>
          <div style={{ fontFamily: T.serif, fontSize: 13, color: T.body, opacity: 0.84, lineHeight: 1.60 }}>{body}</div>
        </div>
      ))}
      <div onClick={onExplore} style={{ minHeight: 44, display: "flex", alignItems: "center", width: "fit-content", paddingRight: 16, fontFamily: T.mono, fontSize: 9.5, letterSpacing: "0.18em", color: c, opacity: 0.88, cursor: "pointer", marginTop: 6 }}>
        EXPLORE →
      </div>
    </div>
  );
}

const LAYER_CONTENT = [
  {
    id: "governance", label: "GOVERNANCE", short: "G",
    subtitle: "Who has the authority to shape and redirect behavior.",
    content: "Governance defines who may establish the system's purpose, change its operating rules, evaluate its behavior, and intervene when it begins to drift. It turns responsibility into an explicit structure instead of leaving it distributed across product decisions, model settings, and informal team assumptions.\n\nThis is related to Authority Gradient, but it asks a different question. Authority Gradient locates where meaningful human authority should remain. Governance determines how that authority is exercised: who can redirect the system, which changes require review, what conditions trigger escalation, and where accountability ultimately sits.",
    insight: "If no one can clearly explain who may change or stop the system, its behavior is already being governed by something else.",
    hasEvidence: true,
  },
  {
    id: "constraints", label: "CONSTRAINTS", short: "C",
    subtitle: "Why trustworthy systems require deliberate limits.",
    content: "Constraints define what the system may do, what it must not do, and which conditions require confirmation, refusal, or escalation. They include capability boundaries, prohibited actions, confidence thresholds, required evidence, and clear statements about the limits of the system's role.\n\nConstraints are often treated as restrictions added after capability has been designed. In Behavioral Architecture, they are part of the system's identity. A system becomes more understandable when users can anticipate where it will act, where it will pause, and where human judgment must re-enter.",
    insight: "A system without meaningful constraints does not have greater intelligence. It has less definition.",
    hasEvidence: false,
  },
  {
    id: "behavioral-integrity", label: "BEHAVIORAL INTEGRITY", short: "I",
    subtitle: "Whether the system behaves like the system it claims to be.",
    content: "Behavioral Integrity examines whether the system's actual conduct remains consistent with its stated purpose and operating boundaries across different users, contexts, and levels of pressure. It compares what the system promises with what it repeatedly does.\n\nTeams must observe authority creep, assumption disclosure, boundary violations, inconsistent refusals, changes introduced by updates, and differences between routine and high-risk behavior. A system may remain accurate while becoming less transparent, more forceful, or harder to redirect.",
    insight: "Alignment is not proven by what the system says about itself. It is revealed through repeated behavior.",
    hasEvidence: false,
  },
  {
    id: "regenerative-capacity", label: "REGENERATIVE CAPACITY", short: "R",
    subtitle: "How the system returns when alignment begins to drift.",
    content: "Regenerative Capacity determines what happens after behavioral integrity begins to fail. It includes detecting the affected layer, containing harmful behavior, restoring prior boundaries, correcting memory or context, and re-entering safely after a failure.\n\nRecovery should not quietly rewrite the system's purpose in order to make a failure disappear. It should preserve a record of what changed, clarify which intervention restored alignment, and escalate when the system cannot repair itself within its legitimate authority.",
    insight: "A trustworthy system is not one that never fails. It is one that can recover without hiding the failure or repeating its cause.",
    hasEvidence: false,
  },
];

function BehavioralDeeperView({ onCanvas, onBack, activeLayer, setActiveLayer }: {
  onCanvas: () => void; onBack: () => void; activeLayer: string; setActiveLayer: (id: string) => void;
}) {
  const c = T.frameworks;
  const current = LAYER_CONTENT.find((l) => l.id === activeLayer) ?? LAYER_CONTENT[0];

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onBack();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBack]);

  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,5,10,0.15) 0px, rgba(5,5,10,0.72) 80px, rgba(5,5,10,0.96) 160px, rgba(5,5,10,0.99) 220px)" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "22px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div onClick={onBack} style={{ fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.18em", color: T.body, opacity: 0.72, cursor: "pointer", display: "flex", alignItems: "center", minHeight: 44 }}>‹ OVERVIEW</div>
        <div style={{ fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.16em", color: c, opacity: 0.68 }}>BEHAVIORAL ARCHITECTURE</div>
      </div>

      <div style={{ position: "absolute", top: 100, bottom: 0, left: 0, right: 0, overflowY: "auto" }}>
        <div style={{ padding: "0 22px 16px", borderBottom: `0.5px solid rgba(106,184,138,0.12)`, marginBottom: 20 }}>
          <div style={{ fontFamily: T.mono, fontSize: 6.5, letterSpacing: "0.18em", color: T.body, opacity: 0.66, marginBottom: 10 }}>BEHAVIORAL LOOP</div>
          <svg viewBox="0 0 340 96" width="100%" style={{ overflow: "visible", display: "block" }}>
            {([
              [0, 1], [1, 2], [2, 3],
            ] as [number, number][]).map(([from, to]) => {
              const positions = [
                { x: 20,  y: 48 },
                { x: 113, y: 24 },
                { x: 220, y: 24 },
                { x: 316, y: 48 },
              ];
              const p1 = positions[from];
              const p2 = positions[to];
              return (
                <g key={`${from}-${to}`}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={c} strokeWidth={0.5} opacity={0.18} />
                  <text x={(p1.x + p2.x) / 2} y={(p1.y + p2.y) / 2 - 4}
                    textAnchor="middle" fontFamily={T.mono} fontSize={4} fill={c} opacity={0.25}>→</text>
                </g>
              );
            })}
            <path d="M 316 48 C 340 75 340 90 195 90 C 50 90 0 75 20 48"
              fill="none" stroke={c} strokeWidth={0.4} strokeDasharray="2 5" opacity={0.14} />
            <text x={195} y={86} textAnchor="middle" fontFamily={T.mono} fontSize={4} fill={c} opacity={0.20}>↩ LOOP</text>

            {LAYER_CONTENT.map((layer, i) => {
              const px = [20, 113, 220, 316][i];
              const py = [48, 24, 24, 48][i];
              const isActive = layer.id === activeLayer;
              return (
                <g key={layer.id} onClick={() => setActiveLayer(layer.id)} style={{ cursor: "pointer" }}>
                  <circle cx={px} cy={py} r={isActive ? 8 : 5} fill={c} opacity={isActive ? 1 : 0.28} pointerEvents="none" />
                  <circle cx={px} cy={py} r={isActive ? 16 : 10} fill={c} opacity={isActive ? 0.12 : 0.04} pointerEvents="none" />
                  <text x={px} y={py + (i === 0 || i === 3 ? 22 : -14)} textAnchor="middle" fontFamily={T.mono} fontSize={5.5} letterSpacing="0.10em" fill={c} opacity={isActive ? 0.88 : 0.36} pointerEvents="none">
                    {layer.short} {layer.label}
                  </text>
                  <circle cx={px} cy={py} r={22} fill="transparent" pointerEvents="all" />
                </g>
              );
            })}
          </svg>
        </div>

        <div style={{ padding: "0 28px 80px" }}>
          <div style={{ fontFamily: T.serif, fontSize: 21, color: T.gold, opacity: 0.80, lineHeight: 1.30, marginBottom: 6 }}>{current.subtitle}</div>
          <div style={{ height: 0.5, background: "rgba(232,213,163,0.10)", marginBottom: 18 }} />

          {current.content.split("\n\n").map((para, i) => (
            <div key={i} style={{ fontFamily: T.serif, fontSize: 13.5, color: T.body, opacity: 0.84, lineHeight: 1.68, marginBottom: 16 }}>{para}</div>
          ))}

          <div style={{ borderLeft: `1.5px solid rgba(106,184,138,0.30)`, paddingLeft: 16, marginBottom: 22 }}>
            <div style={{ fontFamily: T.mono, fontSize: 7, letterSpacing: "0.18em", color: c, opacity: 0.72, marginBottom: 8 }}>LAYER INSIGHT</div>
            <div style={{ fontFamily: T.serif, fontSize: 14, color: T.body, opacity: 0.84, lineHeight: 1.58, fontStyle: "italic" }}>"{current.insight}"</div>
          </div>

          {current.hasEvidence && (
            <div onClick={onCanvas} style={{ borderRadius: 4, border: `0.5px solid rgba(106,184,138,0.22)`, overflow: "hidden", cursor: "pointer" }}>
              <img src={baEvidenceImg} alt="Behavioral Architecture — AI system with visible governance, constraints, integrity, and recovery layers" style={{ width: "100%", height: 110, objectFit: "cover", display: "block", opacity: 0.82 }} />
              <div style={{ background: "rgba(5,5,10,0.88)", padding: "10px 14px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                  <div style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.14em", color: c, opacity: 0.70 }}>02 · BEHAVIORAL ARCHITECTURE</div>
                  <div style={{ fontFamily: T.mono, fontSize: 7, color: c, opacity: 0.70 }}>→ INSPECT</div>
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 6.5, letterSpacing: "0.12em", color: T.body, opacity: 0.66 }}>INTERACTIVE EXAMPLE · GOVERNANCE</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FrameworkCanvas({ onClose }: { onClose: () => void }) {
  const c = T.frameworks;
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null);
  const panStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const lastTap = useRef(0);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const reset = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  };

  const getDistance = () => {
    const pts = [...pointers.current.values()];
    if (pts.length < 2) return 0;
    return Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
  };

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1 && scale > 1) {
      panStart.current = { x: e.clientX, y: e.clientY, tx: translate.x, ty: translate.y };
    }
    if (pointers.current.size === 2) {
      pinchStart.current = { distance: getDistance(), scale };
      panStart.current = null;
    }
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size >= 2 && pinchStart.current) {
      const d = getDistance();
      if (pinchStart.current.distance > 0) setScale(Math.min(4, Math.max(1, pinchStart.current.scale * d / pinchStart.current.distance)));
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
    <div style={{ position: "absolute", inset: 0, background: "rgba(5,5,10,0.98)", backdropFilter: "blur(24px)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "22px 22px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, borderBottom: `0.5px solid rgba(106,184,138,0.12)` }}>
        <div onClick={onClose} style={{ fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.18em", color: T.body, opacity: 0.72, cursor: "pointer", display: "flex", alignItems: "center", minHeight: 44, paddingRight: 12 }}>‹ GOVERNANCE</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: T.mono, fontSize: 8, letterSpacing: "0.14em", color: c, opacity: 0.74 }}>02 · BEHAVIORAL ARCHITECTURE</div>
          <div style={{ fontFamily: T.mono, fontSize: 6.5, letterSpacing: "0.12em", color: T.body, opacity: 0.66, marginTop: 2 }}>INTERACTIVE EXAMPLE</div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 0 60px" }}>
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerUp}
          onClick={onDoubleTap}
          style={{ overflow: "hidden", touchAction: "none", background: "rgba(3,3,8,0.96)", cursor: scale > 1 ? "grab" : "zoom-in" }}
        >
          <img
            src={baEvidenceImg}
            alt="AI coding assistant showing behavioral layers: governance, constraints, behavioral integrity, and regenerative capacity"
            draggable={false}
            style={{
              width: "100%",
              display: "block",
              objectFit: "contain",
              transform: `translate3d(${translate.x}px, ${translate.y}px, 0) scale(${scale})`,
              transformOrigin: "center center",
              transition: pointers.current.size ? "none" : "transform 160ms ease",
              userSelect: "none",
              WebkitUserDrag: "none",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 44, padding: "0 22px", borderBottom: `0.5px solid rgba(106,184,138,0.10)` }}>
          <div style={{ fontFamily: T.mono, fontSize: 7, letterSpacing: "0.18em", color: T.body, opacity: 0.66 }}>PINCH OR DOUBLE-TAP TO INSPECT</div>
          <button
            type="button"
            onClick={reset}
            disabled={scale === 1 && translate.x === 0 && translate.y === 0}
            style={{ minWidth: 44, minHeight: 44, border: "none", background: "transparent", padding: 0, fontFamily: T.mono, fontSize: 7, letterSpacing: "0.16em", color: c, opacity: scale === 1 && translate.x === 0 && translate.y === 0 ? 0.20 : 0.58 }}
          >
            RESET
          </button>
        </div>

        <div style={{ padding: "18px 28px 0" }}>
          <div style={{ fontFamily: T.mono, fontSize: 7, letterSpacing: "0.16em", color: c, opacity: 0.70, marginBottom: 8 }}>CAPTION</div>
          <div style={{ fontFamily: T.serif, fontSize: 13, color: T.body, opacity: 0.80, lineHeight: 1.64 }}>
            The interface makes the behavioral system surrounding the AI visible before asking the person to trust its output.
            Trust shifts from the artifact to the governed, bounded, observable, and recoverable process that produced it.
          </div>
        </div>
        <div style={{ margin: "18px 28px 0", padding: "12px 0", borderTop: `0.5px solid rgba(232,213,163,0.07)`, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 4, height: 4, borderRadius: "50%", background: c, opacity: 0.45 }} />
          <div style={{ fontFamily: T.mono, fontSize: 6.5, letterSpacing: "0.14em", color: c, opacity: 0.68 }}>
            BEHAVIORAL ARCHITECTURE · GOVERNANCE · 01 TRADITIONAL AI vs 02 BEHAVIORAL ARCHITECTURE
          </div>
        </div>
      </div>
    </div>
  );
}

interface FrameworksSceneProps {
  state: FWState;
  activeLayer: string;
  setActiveLayer: (id: string) => void;
  onSelectFramework: () => void;
  onFrameworkOverview: () => void;
  onExplore: () => void;
  onCanvas: () => void;
  onBack: () => void;
}

export default function FrameworksScene({
  state, activeLayer, setActiveLayer, onSelectFramework, onFrameworkOverview, onExplore, onCanvas, onBack,
}: FrameworksSceneProps) {
  const mdState = MD_STATE[state];
  const fwSibOp = FW_SIBLING_OP[state];
  const fwParentOp = FW_PARENT_OP[state];
  const layerStarOp = LAYER_STAR_OP[state];
  const connOp = CONN_OP[state];

  const showConstellation = state !== "framework-reading" && state !== "framework-evidence";

  return (
    <>
      {showConstellation && (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0 }} aria-hidden>
          {[0, 60, 120, 180, 240, 300].map((deg) => {
            const r = (deg * Math.PI) / 180;
            return (
              <line key={deg}
                x1={FW_CTR.x} y1={FW_CTR.y}
                x2={FW_CTR.x + Math.cos(r) * 320}
                y2={FW_CTR.y + Math.sin(r) * 320}
                stroke={T.frameworks} strokeWidth={0.18} opacity={0.035}
              />
            );
          })}

          <FwConstellationConnections op={connOp} />
          <FWParentNode op={fwParentOp} />
          <LayerStars mdX={mdState.x} mdY={mdState.y} radius={mdState.orbitR + 42} opacity={layerStarOp} />

          <g style={{ opacity: fwSibOp, transition: FADE }}>
            {FW_FRAMEWORKS.filter((f) => f.id !== "model-design").map((f) => (
              <FrameworkNode key={f.id} label={f.label} cx={f.x} cy={f.y} awakened={false} />
            ))}
          </g>

          <g style={{ opacity: mdState.opacity, transition: FADE }}>
            <FrameworkNode
              label="MODEL DESIGN"
              cx={mdState.x}
              cy={mdState.y}
              awakened={state !== "frameworks-focus"}
              onClick={() => {
                if (state === "frameworks-focus") onSelectFramework();
                if (state === "framework-awakened") onFrameworkOverview();
              }}
            />
          </g>
        </svg>
      )}

      {showConstellation && <FWFocusTopBar onBack={onBack} />}
      {state === "framework-overview" && <BehavioralOverviewSurface onExplore={onExplore} />}
      {state === "framework-reading" && (
        <BehavioralDeeperView onCanvas={onCanvas} onBack={onBack} activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
      )}
      {state === "framework-evidence" && <FrameworkCanvas onClose={onBack} />}
    </>
  );
}
