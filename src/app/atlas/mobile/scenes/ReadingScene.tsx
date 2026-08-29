/**
 * ReadingScene — Focused Mode Pass 3
 *
 * Continuous Sovereign Atlas reading with inline evidence.
 * Evidence inspection overlays the mounted reading document so the reader
 * returns to the exact previous scroll position.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { T } from "../components/mobileShared";
import MobileReadingHeader from "../reading/MobileReadingHeader";
import MobileSectionRail from "../reading/MobileSectionRail";
import MobileReadingSection from "../reading/MobileReadingSection";
import MobileEvidenceViewer from "../reading/MobileEvidenceViewer";
import type { MobileEvidenceItem } from "../reading/sovereignAtlasEvidence";
import {
  SOVEREIGN_ATLAS_READING,
  type SovereignAtlasSectionId,
} from "../reading/sovereignAtlasReadingScaffold";

function SovereignAtlasReadingSurface({ onBack }: { onBack: () => void }) {
  const sections = SOVEREIGN_ATLAS_READING.sections;
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef(
    new Map<SovereignAtlasSectionId, HTMLElement>(),
  );

  const [activeId, setActiveId] = useState<SovereignAtlasSectionId>(
    sections[0].id,
  );
  const [selectedEvidence, setSelectedEvidence] =
    useState<MobileEvidenceItem | null>(null);

  const sectionIds = useMemo(
    () => sections.map((section) => section.id),
    [sections],
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (selectedEvidence) setSelectedEvidence(null);
      else onBack();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onBack, selectedEvidence]);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    let frame = 0;

    const updateActiveSection = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rootTop = scroller.getBoundingClientRect().top;
        const activationLine = rootTop + 156;

        let bestId = sectionIds[0];
        let bestDistance = Number.POSITIVE_INFINITY;

        for (const id of sectionIds) {
          const node = sectionRefs.current.get(id);
          if (!node) continue;

          const rect = node.getBoundingClientRect();
          const distance = Math.abs(rect.top - activationLine);

          if (rect.top <= activationLine + 24 && distance < bestDistance) {
            bestId = id;
            bestDistance = distance;
          }
        }

        const lastId = sectionIds[sectionIds.length - 1];
        const lastNode = sectionRefs.current.get(lastId);

        if (
          lastNode &&
          scroller.scrollTop + scroller.clientHeight >=
            scroller.scrollHeight - 24
        ) {
          bestId = lastId;
        }

        setActiveId(bestId);
      });
    };

    updateActiveSection();
    scroller.addEventListener("scroll", updateActiveSection, {
      passive: true,
    });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sectionIds]);

  const scrollToSection = (id: SovereignAtlasSectionId) => {
    const node = sectionRefs.current.get(id);
    const scroller = scrollRef.current;
    if (!node || !scroller) return;

    setActiveId(id);

    const scrollerTop = scroller.getBoundingClientRect().top;
    const nodeTop = node.getBoundingClientRect().top;
    const target = scroller.scrollTop + nodeTop - scrollerTop - 2;

    scroller.scrollTo({
      top: target,
      behavior: "smooth",
    });
  };

  const activeSection =
    sections.find((section) => section.id === activeId) ?? sections[0];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "rgba(5,5,10,0.99)",
        color: T.body,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          zIndex: 10,
        }}
      >
        <MobileReadingHeader
          title={SOVEREIGN_ATLAS_READING.title}
          onBack={onBack}
        />
        <MobileSectionRail
          sections={sections}
          activeId={activeId}
          onSelect={scrollToSection}
        />
      </div>

      <div
        ref={scrollRef}
        role="main"
        aria-label="Sovereign Atlas case study"
        style={{
          position: "absolute",
          top: 114,
          right: 0,
          bottom: 0,
          left: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          overscrollBehaviorY: "contain",
        }}
      >
        <div
          style={{
            padding: "32px 26px 28px",
            borderBottom: "0.5px solid rgba(232,213,163,0.08)",
          }}
        >
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 8,
              letterSpacing: "0.18em",
              color: T.identityGold,
              opacity: 0.64,
              marginBottom: 10,
            }}
          >
            CASE STUDY
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontFamily: T.serif,
              fontSize: 30,
              fontWeight: 600,
              letterSpacing: "0.04em",
              lineHeight: 1.08,
              color: T.identityGold,
            }}
          >
            Sovereign Atlas
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: 335,
              fontFamily: T.serif,
              fontSize: 15,
              lineHeight: 1.55,
              color: T.body,
              opacity: 0.72,
            }}
          >
            {SOVEREIGN_ATLAS_READING.subtitle}
          </p>
        </div>

        {sections.map((section) => (
          <MobileReadingSection
            key={section.id}
            section={section}
            setRef={(node) => {
              if (node) sectionRefs.current.set(section.id, node);
              else sectionRefs.current.delete(section.id);
            }}
            onInspectEvidence={(item) => setSelectedEvidence(item)}
          />
        ))}

        <div
          style={{
            padding: "42px 26px 72px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              fontFamily: T.mono,
              fontSize: 8,
              letterSpacing: "0.18em",
              color: T.identityGold,
              opacity: 0.52,
              marginBottom: 12,
            }}
          >
            END OF CASE STUDY
          </div>

          <button
            type="button"
            onClick={onBack}
            style={{
              minHeight: 44,
              border: "none",
              background: "transparent",
              padding: 0,
              fontFamily: T.mono,
              fontSize: 9,
              letterSpacing: "0.16em",
              color: T.caseStudies,
              opacity: 0.86,
              cursor: "pointer",
            }}
          >
            ← RETURN TO CASE STUDIES
          </button>
        </div>
      </div>

      {selectedEvidence && (
        <MobileEvidenceViewer
          item={selectedEvidence}
          sectionLabel={activeSection.label}
          onClose={() => setSelectedEvidence(null)}
        />
      )}
    </div>
  );
}

interface ReadingSceneProps {
  state: "project-reading" | "evidence-viewer";
  onEvidence: () => void;
  onBack: () => void;
}

export default function ReadingScene({
  onBack,
}: ReadingSceneProps) {
  return <SovereignAtlasReadingSurface onBack={onBack} />;
}
