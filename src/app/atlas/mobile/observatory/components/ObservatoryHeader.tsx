import { T } from "../../components/mobileShared";

export default function ObservatoryHeader({
  quiet = false,
}: {
  quiet?: boolean;
}) {
  return (
    <header
      aria-label="Observatory"
      style={{
        position: "absolute",
        top: "calc(18px + env(safe-area-inset-top, 0px))",
        left: 22,
        right: 22,
        zIndex: 12,
        pointerEvents: "none",
        opacity: quiet ? 0.22 : 1,
        transition: "opacity 300ms ease",
      }}
    >
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 9,
          letterSpacing: "0.28em",
          color: T.identityGold,
          opacity: 0.94,
        }}
      >
        OBSERVATORY
      </div>

      <div
        style={{
          marginTop: 7,
          fontFamily: T.serif,
          fontSize: 12.5,
          letterSpacing: "0.04em",
          color: T.body,
          opacity: 0.52,
        }}
      >
        Choose a destination
      </div>

      <div
        aria-hidden
        style={{
          width: 36,
          height: 0.5,
          marginTop: 10,
          background:
            "linear-gradient(90deg, rgba(232,200,109,0.58), transparent)",
        }}
      />
    </header>
  );
}
