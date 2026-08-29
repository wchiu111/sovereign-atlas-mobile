import { Fragment, useEffect, useRef, useState } from "react";
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
  const localRef = useRef<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);
  const evidence = evidenceForSection(section.id);

  useEffect(() => {
    const node = localRef.current;
    if (!node || entered) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [entered]);

  const evidenceAfter = (paragraphIndex: number) =>
    evidence.filter((item) => item.insertAfterParagraph === paragraphIndex);

  return (
    <section
      id={`mobile-reading-${section.id}`}
      ref={(node) => {
        localRef.current = node;
        setRef(node);
      }}
      data-section-id={section.id}
      style={{
        scrollMarginTop: 138,
        padding:
          "clamp(34px, 9vw, 40px) clamp(22px, 6.6vw, 28px) clamp(54px, 14vw, 64px)",
        borderBottom: "0.5px solid rgba(232,213,163,0.08)",
      }}
    >
      <div
        style={{
          transform: entered ? "translateY(0)" : "translateY(10px)",
          opacity: entered ? 1 : 0,
          transition:
            "transform 360ms cubic-bezier(0.22,1,0.36,1), opacity 280ms ease",
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
              fontSize: "clamp(8px, 2.2vw, 8.5px)",
              letterSpacing: "0.14em",
              color: T.identityGold,
              opacity: 0.56,
            }}
          >
            {section.number}
          </div>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "clamp(8.5px, 2.3vw, 9px)",
              letterSpacing: "0.18em",
              color: "#F0E9D8",
              opacity: 0.84,
            }}
          >
            {section.label}
          </div>
          <div
            style={{
              fontFamily: T.mono,
              fontSize: "clamp(7.5px, 2vw, 8px)",
              letterSpacing: "0.14em",
              color: T.accentGold,
              opacity: 0.54,
            }}
          >
            OF 05
          </div>
        </div>

        <h2
          style={{
            margin: "0 0 10px",
            maxWidth: 336,
            fontFamily: T.serif,
            fontSize: "clamp(30px, 8vw, 34px)",
            fontWeight: 600,
            lineHeight: 1.08,
            color: "#F0E9D8",
            opacity: 0.98,
          }}
        >
          {section.label
            .toLowerCase()
            .replace(/\b\w/g, (letter) => letter.toUpperCase())}
        </h2>

        <div
          style={{
            maxWidth: 330,
            fontFamily: T.serif,
            fontSize: "clamp(18px, 4.9vw, 20px)",
            fontWeight: 500,
            lineHeight: 1.28,
            color: T.accentGold,
            opacity: 0.88,
          }}
        >
          {section.subtitle}
        </div>
      </div>

      <div
        style={{
          height: 0.5,
          background: "rgba(232,213,163,0.11)",
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
                        : "0 0 21px",
                maxWidth: 340,
                fontFamily: T.serif,
                fontSize: isShortEmphasis
                  ? "clamp(17px, 4.6vw, 18px)"
                  : "clamp(15px, 4.1vw, 16px)",
                fontWeight: isShortEmphasis ? 600 : 400,
                lineHeight: isShortEmphasis ? 1.42 : 1.7,
                color: isShortEmphasis ? T.accentGold : "#F0E9D8",
                opacity: isShortEmphasis ? 0.92 : 0.89,
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

      <aside
        aria-label={`${section.label} section insight`}
        style={{
          marginTop: 36,
          padding: "0 0 2px 16px",
          borderLeft: `1.5px solid ${T.caseStudies}66`,
        }}
      >
        <div
          style={{
            marginBottom: 9,
            fontFamily: T.mono,
            fontSize: "clamp(7.5px, 2vw, 8px)",
            letterSpacing: "0.18em",
            color: T.caseStudies,
            opacity: 0.82,
          }}
        >
          SECTION INSIGHT
        </div>
        <div
          style={{
            maxWidth: 326,
            fontFamily: T.serif,
            fontSize: "clamp(15px, 4vw, 16px)",
            fontStyle: "italic",
            lineHeight: 1.62,
            color: "#F0E9D8",
            opacity: 0.86,
          }}
        >
          “{section.insight}”
        </div>
      </aside>

      <div
        style={{
          marginTop: 28,
          fontFamily: T.mono,
          fontSize: 7.5,
          letterSpacing: "0.16em",
          color: T.body,
          opacity: 0.34,
        }}
      >
        {section.readingTime} MIN READ
      </div>
    </section>
  );
}
