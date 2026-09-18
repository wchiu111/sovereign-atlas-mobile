import { T } from "../../components/mobileShared";
import type { ObservatoryHotspotDefinition } from "../observatoryTypes";

export default function ObservatoryHotspot({
  hotspot,
  selected,
  subdued,
  disabled,
  onSelect,
}: {
  hotspot: ObservatoryHotspotDefinition;
  selected: boolean;
  subdued: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  const textAlign =
    hotspot.align === "center"
      ? "center"
      : hotspot.align === "right"
      ? "right"
      : "left";

  return (
    <button
      type="button"
      data-observatory-hotspot={hotspot.id}
      aria-label={`${hotspot.label}. ${hotspot.description}`}
      aria-pressed={selected}
      disabled={disabled}
      onClick={onSelect}
      className="observatory-mobile-focusable"
      style={{
        position: "absolute",
        left: hotspot.x - 26,
        top: hotspot.y - 26,
        width: 52,
        height: 52,
        border: 0,
        padding: 0,
        borderRadius: "50%",
        background: "transparent",
        cursor: disabled ? "default" : "pointer",
        opacity: subdued ? 0.42 : 1,
        transition:
          "opacity 240ms ease, filter 240ms ease",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: selected ? 34 : 28,
          height: selected ? 34 : 28,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `0.75px solid ${hotspot.color}${
            selected ? "B5" : "66"
          }`,
          boxShadow: selected
            ? `0 0 16px ${hotspot.color}45, inset 0 0 10px ${hotspot.color}1C`
            : `0 0 10px ${hotspot.color}18`,
          transition: "all 280ms ease",
        }}
      />

      <span
        aria-hidden
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: selected ? 8 : 6,
          height: selected ? 8 : 6,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: hotspot.color,
          boxShadow: `0 0 9px ${hotspot.color}CC, 0 0 20px ${hotspot.color}55`,
          animation: selected
            ? "observatoryMobileSelectedCore 2.8s ease-in-out infinite"
            : "observatoryMobileIdleCore 5.6s ease-in-out infinite",
        }}
      />

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left:
            hotspot.align === "right"
              ? hotspot.labelX - hotspot.x - 96
              : hotspot.labelX - hotspot.x + 26,
          top: hotspot.labelY - hotspot.y + 24,
          width: hotspot.align === "center" ? 0 : 60,
          height: 0.5,
          background: `linear-gradient(${
            hotspot.align === "right" ? "270deg" : "90deg"
          }, ${hotspot.color}66, transparent)`,
          pointerEvents: "none",
        }}
      />

      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left:
            hotspot.labelX - hotspot.x -
            (hotspot.align === "center" ? 70 : hotspot.align === "right" ? 152 : -34),
          top: hotspot.labelY - hotspot.y - 8,
          width: hotspot.align === "center" ? 140 : 118,
          fontFamily: T.mono,
          fontSize: 8,
          lineHeight: 1.25,
          letterSpacing: "0.16em",
          textAlign,
          color: selected ? hotspot.color : T.body,
          opacity: selected ? 0.98 : 0.72,
          textShadow: "0 1px 8px rgba(0,0,0,0.92)",
          pointerEvents: "none",
          transition: "color 240ms ease, opacity 240ms ease",
          whiteSpace: "nowrap",
        }}
      >
        {hotspot.label}
      </span>
    </button>
  );
}
