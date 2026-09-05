import {
  MOBILE_CONTENT_INSET,
  MOBILE_NARRATIVE_SURFACE_BOTTOM,
  MOBILE_NARRATIVE_SURFACE_TOP,
  T,
} from "../../components/mobileShared";
import { CASE_STUDY_FOCUS_ITEMS } from "../caseStudyData";

export default function ProjectPreviewDrawer({
  item,
  phase,
  onExplore,
  arrivalVisible = true,
  reducedMotion = false,
  closeDurationMs,
  reducedDurationMs,
}: {
  item: (typeof CASE_STUDY_FOCUS_ITEMS)[number];
  phase: "open" | "closing" | "opening";
  onExplore: () => void;
  arrivalVisible?: boolean;
  reducedMotion?: boolean;
  closeDurationMs: number;
  reducedDurationMs: number;
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
        padding: `${MOBILE_NARRATIVE_SURFACE_TOP}px ${MOBILE_CONTENT_INSET} calc(${MOBILE_NARRATIVE_SURFACE_BOTTOM}px + env(safe-area-inset-bottom, 0px))`,
        display: "flex",
        flexDirection: "column",
        transform: `translateY(${translateY})`,
        opacity,
        transition: reducedMotion
          ? `opacity ${reducedDurationMs}ms ease`
          : phase === "closing"
          ? `transform ${closeDurationMs}ms cubic-bezier(0.4,0,0.2,1), opacity 180ms ease`
          : "transform 360ms cubic-bezier(0.22,1,0.36,1), opacity 260ms ease",
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          width: "100%",
          minWidth: 0,
          flex: 1,
          display: "flex",
          flexDirection: "column",
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
    </div>
  );
}
