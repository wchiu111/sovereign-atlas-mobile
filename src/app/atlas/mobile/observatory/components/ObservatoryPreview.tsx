import { T } from "../../components/mobileShared";
import type { ObservatoryHotspotDefinition } from "../observatoryTypes";

export default function ObservatoryPreview({
  hotspot,
  onExplore,
}: {
  hotspot: ObservatoryHotspotDefinition;
  onExplore: () => void;
}) {
  return (
    <section
      aria-label={`${hotspot.label} preview`}
      data-observatory-interactive="true"
      onPointerDown={(event) => event.stopPropagation()}
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        bottom: "calc(22px + env(safe-area-inset-bottom, 0px))",
        zIndex: 18,
        overflow: "hidden",
        border: `0.5px solid ${hotspot.color}55`,
        borderRadius: 5,
        background:
          "linear-gradient(180deg, rgba(6,8,14,0.88), rgba(4,6,11,0.96))",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        boxShadow: `0 18px 46px rgba(0,0,0,0.34), 0 0 34px ${hotspot.color}0E`,
        animation:
          "observatoryMobilePreviewIn 320ms cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <div style={{ padding: "15px 16px 13px" }}>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 7,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: hotspot.color,
            opacity: 0.78,
          }}
        >
          {hotspot.eyebrow}
        </div>

        <div
          style={{
            marginTop: 7,
            fontFamily: T.serif,
            fontSize: 22,
            lineHeight: 1.05,
            color: "#F0E9D8",
          }}
        >
          {hotspot.label
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase())}
        </div>

        <p
          style={{
            margin: "9px 0 0",
            fontFamily: T.serif,
            fontSize: 14,
            lineHeight: 1.45,
            color: T.body,
            opacity: 0.76,
          }}
        >
          {hotspot.description}
        </p>
      </div>

      <button
        type="button"
        onClick={onExplore}
        className="observatory-mobile-focusable"
        style={{
          minHeight: 48,
          width: "100%",
          border: 0,
          borderTop: `0.5px solid ${hotspot.color}2B`,
          background: "transparent",
          fontFamily: T.mono,
          fontSize: 8,
          letterSpacing: "0.18em",
          color: hotspot.color,
          cursor: "pointer",
        }}
      >
        {hotspot.id === "atlas" ? "ENTER ATLAS →" : "EXPLORE →"}
      </button>
    </section>
  );
}
