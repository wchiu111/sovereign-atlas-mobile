import { MOBILE_CONTENT_INSET, T } from "../components/mobileShared";

export default function MobileReadingHeader({
  title,
  onBack,
  elevated = false,
}: {
  title: string;
  onBack: () => void;
  elevated?: boolean;
}) {
  return (
    <header
      className="mobile-reading-header"
      style={{
        minHeight: 62,
        padding:
          `max(0px, env(safe-area-inset-top)) ${MOBILE_CONTENT_INSET} 0`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        background: elevated ? "rgba(5,5,10,0.985)" : "rgba(5,5,10,0.94)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderBottom: "0.5px solid rgba(232,213,163,0.09)",
        transition: "background 220ms ease, border-color 220ms ease",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label={`Return from ${title}`}
        className="mobile-reading-focusable"
        style={{
          minHeight: 44,
          minWidth: 44,
          maxWidth: "calc(100% - 52px)",
          display: "flex",
          alignItems: "center",
          gap: 7,
          border: "none",
          background: "transparent",
          padding: 0,
          color: T.body,
          cursor: "pointer",
          borderRadius: 3,
        }}
      >
        <span
          aria-hidden
          style={{
            fontFamily: T.mono,
            fontSize: 12,
            opacity: 0.76,
            flexShrink: 0,
          }}
        >
          ‹
        </span>
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontFamily: T.mono,
            fontSize: "clamp(9px, 2.45vw, 9.5px)",
            letterSpacing: "0.15em",
            color: T.body,
            opacity: 0.82,
          }}
        >
          {title}
        </span>
      </button>

      <div
        aria-hidden
        style={{
          minWidth: 44,
          minHeight: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: T.mono,
          fontSize: 9,
          letterSpacing: "0.12em",
          color: T.body,
          opacity: 0.30,
        }}
      >
        · · ·
      </div>
    </header>
  );
}
