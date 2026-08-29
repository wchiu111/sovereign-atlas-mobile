import { T } from "../components/mobileShared";

export default function MobileReadingHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <header
      style={{
        height: 62,
        padding: "0 20px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        background: "rgba(5,5,10,0.94)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderBottom: "0.5px solid rgba(232,213,163,0.08)",
      }}
    >
      <button
        type="button"
        onClick={onBack}
        aria-label={`Return from ${title}`}
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
        }}
      >
        <span
          aria-hidden
          style={{
            fontFamily: T.mono,
            fontSize: 11,
            opacity: 0.72,
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
            fontSize: 8.5,
            letterSpacing: "0.16em",
            color: T.body,
            opacity: 0.78,
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
          opacity: 0.42,
        }}
      >
        · · ·
      </div>
    </header>
  );
}
