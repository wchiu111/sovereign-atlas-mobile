import type { ObservatoryHotspotDefinition } from "../observatoryTypes";

export default function ObservatoryObjectReactions({
  hotspot,
  focused = false,
}: {
  hotspot: ObservatoryHotspotDefinition | null;
  focused?: boolean;
}) {
  if (!hotspot) return null;

  const size =
    hotspot.id === "about"
      ? 142
      : hotspot.id === "atlas"
      ? 112
      : 96;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes observatoryMobileReaction {
          0%, 100% { transform: translate(-50%, -50%) scale(0.92); opacity: 0.38; }
          50% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.82; }
        }

        @keyframes observatoryMobileReactionRing {
          0%, 100% { transform: translate(-50%, -50%) scale(0.82); opacity: 0.18; }
          54% { transform: translate(-50%, -50%) scale(1.08); opacity: 0.58; }
        }

        @media (prefers-reduced-motion: reduce) {
          .observatory-mobile-reaction {
            animation: none !important;
          }
        }
      `}</style>

      <span
        className="observatory-mobile-reaction"
        style={{
          position: "absolute",
          left: hotspot.x,
          top: hotspot.y,
          width: size,
          height: size,
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${hotspot.color}24 0%, ${hotspot.color}0F 36%, transparent 72%)`,
          mixBlendMode: "screen",
          filter: "blur(1.5px)",
          animation: focused
            ? "none"
            : "observatoryMobileReaction 4.6s ease-in-out infinite",
          opacity: focused ? 0.72 : undefined,
        }}
      />

      <span
        className="observatory-mobile-reaction"
        style={{
          position: "absolute",
          left: hotspot.x,
          top: hotspot.y,
          width: hotspot.id === "about" ? 76 : 58,
          height: hotspot.id === "about" ? 76 : 58,
          borderRadius: "50%",
          border: `0.75px solid ${hotspot.color}66`,
          boxShadow: `0 0 18px ${hotspot.color}24`,
          animation:
            "observatoryMobileReactionRing 3.8s ease-in-out -1.3s infinite",
        }}
      />
    </div>
  );
}
