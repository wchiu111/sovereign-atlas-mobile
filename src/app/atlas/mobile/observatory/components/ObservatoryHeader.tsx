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
        top: "calc(68px + env(safe-area-inset-top, 0px))",
        left: 4.5,
        right: 4.5,
        zIndex: 12,
        pointerEvents: "none",
        textAlign: "center",
        opacity: quiet ? 0.22 : 1,
        transition: "opacity 300ms ease",
      }}
    >
      <div
        style={{
          fontFamily: T.mono,
          fontSize: 11,
          lineHeight: "14.9px",
          letterSpacing: "2.78px",
          color: T.identityGold,
          opacity: 1,
          whiteSpace: "nowrap",
        }}
      >
        OBSERVATORY
      </div>

      <div
        style={{
          marginTop: 4,
          fontFamily: T.serif,
          fontSize: 11,
          lineHeight: "20.7px",
          letterSpacing: "0.55px",
          color: T.body,
          opacity: 0.75,
          whiteSpace: "nowrap",
        }}
      >
        Choose a destination
      </div>
    </header>
  );
}
