import { T } from "../components/mobileShared";
import type { MobileEvidenceItem } from "./sovereignAtlasEvidence";

export default function MobileEvidenceBlock({
  evidence,
  onInspect,
}: {
  evidence: MobileEvidenceItem;
  onInspect: (item: MobileEvidenceItem) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onInspect(evidence)}
      aria-label={`Inspect evidence: ${evidence.title}`}
      style={{
        width: "100%",
        margin: "28px 0 30px",
        padding: 0,
        overflow: "hidden",
        borderRadius: 5,
        border: `0.5px solid ${T.identityGold}33`,
        background: "rgba(7,7,13,0.78)",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          minHeight: 150,
          maxHeight: 250,
          background: "rgba(3,3,8,0.96)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <img
          src={evidence.image}
          alt={evidence.alt}
          style={{
            width: "100%",
            maxHeight: 250,
            objectFit: evidence.imageFit,
            display: "block",
            opacity: 0.92,
          }}
        />
      </div>

      <div style={{ padding: "13px 14px 15px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              minWidth: 0,
              fontFamily: T.mono,
              fontSize: 7.5,
              letterSpacing: "0.14em",
              color: T.identityGold,
              opacity: 0.82,
              lineHeight: 1.45,
            }}
          >
            {evidence.number} · {evidence.title.toUpperCase()}
          </div>
          <div
            aria-hidden
            style={{
              flexShrink: 0,
              fontFamily: T.mono,
              fontSize: 7,
              letterSpacing: "0.12em",
              color: T.identityGold,
              opacity: 0.72,
            }}
          >
            INSPECT →
          </div>
        </div>

        <div
          style={{
            fontFamily: T.mono,
            fontSize: 6.5,
            letterSpacing: "0.13em",
            color: T.body,
            opacity: 0.48,
            marginBottom: 9,
          }}
        >
          {evidence.type.toUpperCase()}
        </div>

        <div
          style={{
            fontFamily: T.serif,
            fontSize: 13,
            lineHeight: 1.5,
            color: T.body,
            opacity: 0.74,
          }}
        >
          {evidence.caption}
        </div>
      </div>
    </button>
  );
}
