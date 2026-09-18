const stars = [
  [34, 116, 1.1, 0.0],
  [68, 94, 0.8, 1.4],
  [118, 135, 0.7, 3.2],
  [152, 83, 1.0, 2.2],
  [201, 112, 0.8, 0.8],
  [242, 76, 0.7, 4.1],
  [282, 126, 1.1, 1.9],
  [334, 102, 0.8, 3.5],
  [366, 146, 0.7, 0.5],
  [46, 225, 0.7, 2.8],
  [188, 220, 0.6, 1.1],
  [274, 206, 0.8, 4.7],
  [352, 232, 0.7, 3.0],
  [22, 474, 0.8, 2.0],
  [368, 512, 0.7, 4.2],
  [66, 636, 0.6, 1.7],
  [326, 618, 0.7, 3.8],
] as const;

export default function ObservatoryAmbientLayer({
  paused = false,
}: {
  paused?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes observatoryMobileStarBreathe {
          0%, 100% { opacity: 0.18; transform: scale(0.78); }
          48% { opacity: 0.78; transform: scale(1.15); }
          74% { opacity: 0.38; transform: scale(0.94); }
        }

        @keyframes observatoryMobileFieldBreathe {
          0%, 100% { opacity: 0.22; transform: scale(0.985); }
          50% { opacity: 0.52; transform: scale(1.018); }
        }

        @keyframes observatoryMobileDustDrift {
          from { transform: translate3d(0, 12px, 0); opacity: 0.06; }
          50% { opacity: 0.18; }
          to { transform: translate3d(0, -18px, 0); opacity: 0.04; }
        }

        @media (prefers-reduced-motion: reduce) {
          .observatory-mobile-ambient-animated {
            animation: none !important;
          }
        }
      `}</style>

      <div
        className="observatory-mobile-ambient-animated"
        style={{
          position: "absolute",
          left: 195,
          top: 174,
          width: 330,
          height: 270,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(111,132,181,0.075), rgba(52,62,96,0.026) 46%, transparent 72%)",
          mixBlendMode: "screen",
          animation: "observatoryMobileFieldBreathe 12s ease-in-out infinite",
          animationPlayState: paused ? "paused" : "running",
        }}
      />

      {stars.map(([x, y, size, delay], index) => (
        <span
          key={`${x}-${y}`}
          className="observatory-mobile-ambient-animated"
          style={{
            position: "absolute",
            left: x,
            top: y,
            width: size,
            height: size,
            borderRadius: "50%",
            background:
              index % 4 === 0
                ? "rgba(232,200,109,0.92)"
                : "rgba(220,229,247,0.78)",
            boxShadow:
              index % 4 === 0
                ? "0 0 6px rgba(232,200,109,0.38)"
                : "0 0 5px rgba(176,196,232,0.26)",
            animation: `observatoryMobileStarBreathe ${
              4.8 + (index % 5) * 0.72
            }s ease-in-out -${delay}s infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
      ))}

      <div
        className="observatory-mobile-ambient-animated"
        style={{
          position: "absolute",
          inset: "14% 9% 18%",
          opacity: 0.26,
          backgroundImage:
            "radial-gradient(circle, rgba(235,220,180,0.55) 0 0.7px, transparent 0.8px)",
          backgroundSize: "31px 37px",
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.16) 78%, transparent)",
          animation: "observatoryMobileDustDrift 18s linear infinite alternate",
          animationPlayState: paused ? "paused" : "running",
        }}
      />
    </div>
  );
}
