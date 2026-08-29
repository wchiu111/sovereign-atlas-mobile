import { T } from "../components/mobileShared";
import type { SovereignAtlasReadingSection } from "./sovereignAtlasReadingScaffold";

export default function MobileReadingSection({
  section,
  setRef,
}: {
  section: SovereignAtlasReadingSection;
  setRef: (node: HTMLElement | null) => void;
}) {
  return (
    <section
      id={`mobile-reading-${section.id}`}
      ref={setRef}
      data-section-id={section.id}
      style={{
        scrollMarginTop: 138,
        padding: "34px 26px 54px",
        borderBottom: "0.5px solid rgba(232,213,163,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 8,
            letterSpacing: "0.14em",
            color: T.identityGold,
            opacity: 0.52,
          }}
        >
          {section.number}
        </div>
        <div
          style={{
            fontFamily: T.mono,
            fontSize: 8.5,
            letterSpacing: "0.18em",
            color: T.identityGold,
            opacity: 0.82,
          }}
        >
          {section.label}
        </div>
      </div>

      <h2
        style={{
          margin: "0 0 18px",
          maxWidth: 320,
          fontFamily: T.serif,
          fontSize: 25,
          fontWeight: 600,
          lineHeight: 1.18,
          color: T.gold,
          opacity: 0.94,
        }}
      >
        {section.subtitle}
      </h2>

      <div
        style={{
          height: 0.5,
          background: "rgba(232,213,163,0.10)",
          marginBottom: 22,
        }}
      />

      {section.previewParagraphs.map((paragraph, index) => (
        <p
          key={index}
          style={{
            margin: index === section.previewParagraphs.length - 1 ? 0 : "0 0 19px",
            fontFamily: T.serif,
            fontSize: 15,
            lineHeight: 1.68,
            color: T.body,
            opacity: 0.88,
          }}
        >
          {paragraph}
        </p>
      ))}

      <div
        style={{
          marginTop: 24,
          fontFamily: T.mono,
          fontSize: 7,
          letterSpacing: "0.16em",
          color: T.body,
          opacity: 0.32,
        }}
      >
        {section.readingTime} MIN READ
      </div>
    </section>
  );
}
