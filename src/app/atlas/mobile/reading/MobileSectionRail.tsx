import { useEffect, useRef } from "react";
import { T } from "../components/mobileShared";
import type {
  SovereignAtlasReadingSection,
  SovereignAtlasSectionId,
} from "./sovereignAtlasReadingScaffold";

export default function MobileSectionRail({
  sections,
  activeId,
  onSelect,
}: {
  sections: readonly SovereignAtlasReadingSection[];
  activeId: SovereignAtlasSectionId;
  onSelect: (id: SovereignAtlasSectionId) => void;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef(
    new Map<SovereignAtlasSectionId, HTMLButtonElement>(),
  );

  useEffect(() => {
    const activeButton = buttonRefs.current.get(activeId);
    activeButton?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeId]);

  return (
    <nav
      aria-label="Sovereign Atlas case study sections"
      style={{
        height: 52,
        background: "rgba(5,5,10,0.96)",
        backdropFilter: "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        borderBottom: "0.5px solid rgba(232,213,163,0.08)",
      }}
    >
      <div
        ref={railRef}
        style={{
          height: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          display: "flex",
          alignItems: "stretch",
          gap: 22,
          padding: "0 22px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {sections.map((section) => {
          const active = section.id === activeId;

          return (
            <button
              key={section.id}
              ref={(node) => {
                if (node) buttonRefs.current.set(section.id, node);
                else buttonRefs.current.delete(section.id);
              }}
              type="button"
              onClick={() => onSelect(section.id)}
              aria-current={active ? "location" : undefined}
              style={{
                position: "relative",
                flex: "0 0 auto",
                minHeight: 44,
                border: "none",
                background: "transparent",
                padding: "0 0 2px",
                fontFamily: T.mono,
                fontSize: 8.5,
                letterSpacing: "0.14em",
                color: active ? T.identityGold : T.body,
                opacity: active ? 0.96 : 0.48,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {section.label}
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 1,
                  background: T.identityGold,
                  transform: `scaleX(${active ? 1 : 0})`,
                  transformOrigin: "left center",
                  transition: "transform 220ms ease, opacity 220ms ease",
                  opacity: active ? 0.82 : 0,
                }}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
