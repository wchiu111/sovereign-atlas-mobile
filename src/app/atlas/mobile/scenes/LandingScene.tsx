/**
 * LandingScene — atlas-landing | system-awakened | system-overview
 * Renders the full-atlas SVG and Case Studies overview surfaces.
 */

import type { MobileState } from "../components/mobileShared";
import { T, ANIM, FADE, W, H, NEXUS, BASE_R, EX_POS, FW_POS, ORBIT_R, SYSTEMS } from "../components/mobileShared";
import type { SystemDef, Planet } from "../components/mobileShared";
import AtlasUtilitySheet from "../components/AtlasUtilitySheet";

type LandingState = "atlas-landing" | "system-awakened" | "system-overview";

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
      <circle r={130} fill="none" stroke={T.gold} strokeWidth={0.3} opacity={0.045} />
      <circle r={96}  fill="none" stroke={T.gold} strokeWidth={0.4} opacity={0.075} />
      <circle r={68}  fill="none" stroke={T.gold} strokeWidth={0.5} opacity={0.11}  />
      <circle r={60}  fill="rgba(232,213,163,0.028)" />
      <circle r={33}  fill="rgba(232,213,163,0.065)" />
      <circle r={27}  fill="none" stroke={T.gold} strokeWidth={0.8} opacity={0.17} />
      <circle r={17}  fill="rgba(232,213,163,0.12)" />
      <circle r={8}   fill={T.gold} />
      <text y={-46} textAnchor="middle" fontFamily={T.mono} fontSize={7.5}
        letterSpacing="0.22em" fill={T.gold} opacity={0.42}>
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
            <circle r={awakened ? 9.5 : 5.5} fill={color}
              opacity={dimmed ? 0.03 : awakened ? 0.16 : 0.07} style={{ transition: FADE }} />
            <circle r={awakened ? 3 : 1.7} fill={color}
              opacity={dimmed ? 0.18 : awakened ? 1 : 0.52} style={{ transition: FADE }} />
            {showLabels && (
              <text x={ldx * 7.5} y={ldy * 7.5}
                textAnchor={ta} dominantBaseline={db}
                fontFamily={T.mono} fontSize={4.8} fill={color} opacity={0.72}>
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
  const atmoR  = awakened ? BASE_R * 1.45 : BASE_R * 0.82;
  const outerR = awakened ? BASE_R * 3.2  : BASE_R * 1.9;
  const coreR  = awakened ? BASE_R * 0.52 : BASE_R * 0.36;
  return (
    <g style={{ transform: `translate(${cx}px,${cy}px)`, transition: ANIM }}>
      <PlanetCluster planets={sys.planets} orbitR={orbitR} color={sys.color} awakened={awakened} dimmed={dimmed} />
      <circle r={outerR} fill={sys.color} opacity={awakened ? 0.08 : 0.032} style={{ transition: FADE }} />
      <circle r={atmoR} fill={sys.color} opacity={awakened ? 0.18 : 0.082} style={{ transition: FADE }} />
      <circle r={28} fill="none" stroke={sys.color} strokeWidth={0.5} opacity={awakened ? 0.32 : 0.13} style={{ transition: FADE }} />
      <circle r={42} fill="none" stroke={sys.color} strokeWidth={0.3} opacity={awakened ? 0.18 : 0.07} style={{ transition: FADE }} />
      <circle r={coreR} fill={sys.color} opacity={awakened ? 1 : 0.88} style={{ transition: FADE }} />
      {showLabel && (
        <text y={BASE_R * 2.2 + 14} textAnchor="middle" fontFamily={T.mono} fontSize={8} letterSpacing="0.14em" fill={sys.color} opacity={0.38}>
          {sys.label}
        </text>
      )}
    </g>
  );
}

function OverviewInitial({ onExplore }: { onExplore: () => void }) {
  const c = T.caseStudies;
  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      borderTop: `0.5px solid rgba(138,174,200,0.22)`,
      background: "rgba(5,5,10,0.91)",
      backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
      padding: "20px 28px 52px", boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: "0.24em", color: c, opacity: 0.9 }}>CASE STUDIES</div>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: c, opacity: 0.55 }} />
      </div>
      <div style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.18em", color: T.gold, opacity: 0.40, marginBottom: 14 }}>4 PROJECTS</div>
      <div style={{ height: 0.5, background: "rgba(232,213,163,0.10)", marginBottom: 14 }} />
      <div style={{ fontFamily: T.serif, fontSize: 14, color: T.gold, opacity: 0.64, lineHeight: 1.58, marginBottom: 20 }}>
        Real-world product work, decisions, and outcomes.
      </div>
      <div onClick={onExplore} style={{
        minHeight: 44, display: "flex", alignItems: "center", width: "fit-content", paddingRight: 16,
        fontFamily: T.mono, fontSize: 9.5, letterSpacing: "0.18em", color: c, opacity: 0.88, cursor: "pointer",
      }}>EXPLORE →</div>
    </div>
  );
}

function OverviewScrolled({ onExplore, onBack }: { onExplore: () => void; onBack: () => void }) {
  const c = T.caseStudies;
  const projects = [
    { name: "AGENTIC INSURANCE", desc: "Exploring where AI could support insurance claim decisions — and where human authority had to remain." },
    { name: "GLOBALITY", desc: "Redesigning an AI-assisted procurement platform around orientation, work states, and next decisions." },
    { name: "ORACLE", desc: "Enterprise software product strategy and positioning under real organizational constraints." },
    { name: "SOVEREIGN ATLAS", desc: "This navigational system — its design, structure, and the decisions made in building it." },
  ];
  return (
    <div style={{
      position: "absolute", top: 0, bottom: 0, left: 0, right: 0,
      background: `linear-gradient(to bottom, rgba(5,5,10,0.22) 0px, rgba(5,5,10,0.62) 70px, rgba(5,5,10,0.92) 140px, rgba(5,5,10,0.97) 200px)`,
      overflowY: "auto", overflowX: "hidden", boxSizing: "border-box",
    }}>
      <div onClick={onBack} style={{ height: 80, display: "flex", alignItems: "flex-end", paddingBottom: 10, paddingLeft: 28, cursor: "pointer" }}>
        <span style={{ fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.18em", color: T.gold, opacity: 0.32 }}>‹ ATLAS</span>
      </div>
      <div style={{ padding: "0 28px", marginBottom: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.22em", color: c, opacity: 0.50 }}>CASE STUDIES</div>
        <div style={{ fontFamily: T.mono, fontSize: 7, letterSpacing: "0.16em", color: T.gold, opacity: 0.28 }}>4 PROJECTS</div>
      </div>
      <div style={{ margin: "0 28px 24px", height: 0.5, background: "rgba(232,213,163,0.09)" }} />
      <div style={{ padding: "0 28px" }}>
        {[
          { label: "WHAT", body: "A portfolio of four product design engagements. Real constraints, real stakeholders, and decisions made under genuine uncertainty and time pressure." },
          { label: "WHY", body: "Design is consequential. Choices made in ambiguous situations shape outcomes more than technical execution. Process over artifacts." },
          { label: "RESEARCH FOCUS", body: "How design authority is established and maintained across situations where requirements are incomplete, stakeholders disagree, and constraints shift." },
          { label: "KEY DISCOVERY", body: "Sustainable design authority emerges from clarity about process — not confidence in output. The decisions are the artifact." },
        ].map(({ label, body }) => (
          <div key={label} style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.20em", color: T.gold, opacity: 0.36, marginBottom: 7 }}>{label}</div>
            <div style={{ fontFamily: T.serif, fontSize: 13.5, color: T.gold, opacity: 0.66, lineHeight: 1.62 }}>{body}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: "6px 28px 22px", height: 0.5, background: "rgba(232,213,163,0.09)" }} />
      <div style={{ padding: "0 28px" }}>
        <div style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.20em", color: T.gold, opacity: 0.30, marginBottom: 18 }}>CONTAINED PROJECTS</div>
        {projects.map((p, i) => (
          <div key={p.name} style={{
            display: "flex", gap: 12, alignItems: "flex-start",
            marginBottom: i < projects.length - 1 ? 18 : 0,
            paddingBottom: i < projects.length - 1 ? 18 : 0,
            borderBottom: i < projects.length - 1 ? "0.5px solid rgba(232,213,163,0.07)" : "none",
          }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: c, opacity: 0.60, marginTop: 5, flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: T.mono, fontSize: 8.5, letterSpacing: "0.18em", color: c, opacity: 0.78, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontFamily: T.serif, fontSize: 12.5, color: T.gold, opacity: 0.52, lineHeight: 1.56 }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "28px 28px 60px", borderTop: "0.5px solid rgba(138,174,200,0.12)", marginTop: 28 }}>
        <div onClick={onExplore} style={{
          minHeight: 44, display: "flex", alignItems: "center", width: "fit-content", paddingRight: 16,
          fontFamily: T.mono, fontSize: 9.5, letterSpacing: "0.18em", color: c, opacity: 0.86, cursor: "pointer",
        }}>EXPLORE →</div>
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
}

export default function LandingScene({ state, onSelectCaseStudies, onSelectFrameworks, onOverviewExpand, onExplore, onBack }: LandingSceneProps) {
  const csState  = CS_FOCUS[state];
  const ctxOp    = CTX_OP[state];
  const nexusOp  = NEXUS_OP[state];
  const isActive = state !== "atlas-landing";
  const cs = SYSTEMS[0];
  const ex = SYSTEMS[1];
  const fw = SYSTEMS[2];

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
        <g style={{ opacity: csState.opacity, transition: FADE }}><SystemNode sys={cs} cx={csState.x} cy={csState.y} orbitR={csState.orbitR} awakened={isActive} dimmed={false} showLabel={state === "atlas-landing"} /></g>
        {state === "atlas-landing" && (
          <>
            <circle cx={95} cy={178} r={56} fill="transparent" onClick={onSelectCaseStudies} style={{ cursor: "pointer" }} />
            <circle cx={FW_POS.x} cy={FW_POS.y} r={56} fill="transparent" onClick={onSelectFrameworks} style={{ cursor: "pointer" }} />
          </>
        )}
      </svg>

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
              letterSpacing: "0.24em",
              color: T.gold,
              opacity: 0.86,
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
              color: T.gold,
              opacity: 0.42,
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
          <div style={{ fontFamily: T.mono, fontSize: 7.5, letterSpacing: "0.24em", color: T.gold, opacity: 0.28 }}>ENTER OBSERVATORY</div>
        </div>
      )}

      {state === "system-awakened" && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "22px 22px 0", display: "flex", justifyContent: "space-between", alignItems: "center", pointerEvents: "none" }}>
          <div onClick={onBack} style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.18em", color: T.gold, opacity: 0.38, cursor: "pointer", pointerEvents: "auto", minHeight: 44, display: "flex", alignItems: "center" }}>‹ ATLAS</div>
          <div style={{ fontFamily: T.mono, fontSize: 9, letterSpacing: "0.22em", color: T.caseStudies, opacity: 0.62 }}>CASE STUDIES</div>
        </div>
      )}

      {state === "system-awakened" && <OverviewInitial onExplore={onOverviewExpand} />}
      {state === "system-overview" && <OverviewScrolled onExplore={onExplore} onBack={onBack} />}
      {state === "atlas-landing" && <AtlasUtilitySheet />}
    </>
  );
}
