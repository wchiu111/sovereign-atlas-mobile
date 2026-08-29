import { Fragment } from "react";
import { T } from "../components/mobileShared";
import MobileEvidenceBlock from "./MobileEvidenceBlock";
import {
  evidenceForSection,
  type MobileEvidenceItem,
} from "./sovereignAtlasEvidence";
import type { SovereignAtlasReadingSection } from "./sovereignAtlasReadingScaffold";

export default function MobileReadingSection({
  section,
  setRef,
  onInspectEvidence,
}: {
  section: SovereignAtlasReadingSection;
  setRef: (node: HTMLElement | null) => void;
  onInspectEvidence: (item: MobileEvidenceItem) => void;
}) {
  const evidence = evidenceForSection(section.id);

  const evidenceAfter = (paragraphIndex: number) =>
    evidence.filter(
      (item) => item.insertAfterParagraph === paragraphIndex,
    );

  return (
    <section
      id={`mobile-reading-${section.id}`}
      ref={setRef}
      data-section-id={section.id}
      style={{
        scrollMarginTop: 138,
        padding: "36px 26px 58px",
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
          maxWidth: 324,
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
          marginBottom: 24,
        }}
      />

      {section.paragraphs.map((paragraph, index) => {
        const isShortEmphasis =
          paragraph.length < 58 &&
          !paragraph.endsWith(".") &&
          !paragraph.endsWith("?");

        const inlineEvidence = evidenceAfter(index);

        return (
          <Fragment key={index}>
            <p
              style={{
                margin:
                  inlineEvidence.length > 0
                    ? "0 0 20px"
                    : index === section.paragraphs.length - 1
                      ? 0
                      : isShortEmphasis
                        ? "0 0 18px"
                        : "0 0 20px",
                fontFamily: T.serif,
                fontSize: isShortEmphasis ? 17 : 15,
                fontWeight: isShortEmphasis ? 600 : 400,
                lineHeight: isShortEmphasis ? 1.42 : 1.7,
                color: isShortEmphasis ? T.gold : T.body,
                opacity: isShortEmphasis ? 0.9 : 0.88,
              }}
            >
              {paragraph}
            </p>

            {inlineEvidence.map((item) => (
              <MobileEvidenceBlock
                key={item.id}
                evidence={item}
                onInspect={onInspectEvidence}
              />
            ))}
          </Fragment>
        );
      })}

      <div
        style={{
          marginTop: 34,
          padding: "0 0 2px 16px",
          borderLeft: `1.5px solid ${T.identityGold}4D`,
        }}
      >
        <div
          style={{
            marginBottom: 9,
            fontFamily: T.mono,
            fontSize: 7.5,
            letterSpacing: "0.18em",
            color: T.identityGold,
            opacity: 0.68,
          }}
        >
          SECTION INSIGHT
        </div>
        <div
          style={{
            fontFamily: T.serif,
            fontSize: 15,
            fontStyle: "italic",
            lineHeight: 1.62,
            color: T.body,
            opacity: 0.86,
          }}
        >
          “{section.insight}”
        </div>
      </div>

      <div
        style={{
          marginTop: 28,
          fontFamily: T.mono,
          fontSize: 7,
          letterSpacing: "0.16em",
          color: T.body,
          opacity: 0.30,
        }}
      >
        {section.readingTime} MIN READ
      </div>
    </section>
  );
}
