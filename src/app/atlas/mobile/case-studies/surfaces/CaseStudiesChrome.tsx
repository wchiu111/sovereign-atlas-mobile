import {
  MOBILE_CHROME_MIN_HEIGHT,
  MOBILE_CONTENT_INSET,
  T,
} from "../../components/mobileShared";

type CaseStudiesChromeProps = {
  state: "atlas-landing" | "system-awakened" | "system-overview";
  overviewChromeVisible: boolean;
  isReturningFromReading: boolean;
  returnChromeVisible: boolean;
  isExitingCaseStudies: boolean;
  focusedEntryProjectId: string | null;
  onExitToAtlas: () => void;
  onOverviewBack: () => void;
};

export default function CaseStudiesChrome({
  state,
  overviewChromeVisible,
  isReturningFromReading,
  returnChromeVisible,
  isExitingCaseStudies,
  focusedEntryProjectId,
  onExitToAtlas,
  onOverviewBack,
}: CaseStudiesChromeProps) {
  return (
    <>
      {state === "system-awakened" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            minHeight: MOBILE_CHROME_MIN_HEIGHT,
            padding: `max(0px, env(safe-area-inset-top)) ${MOBILE_CONTENT_INSET} 0`,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            opacity:
              overviewChromeVisible || (isReturningFromReading && returnChromeVisible)
                ? 1
                : 0,
            transform: `translateY(${
              overviewChromeVisible ||
              (isReturningFromReading && returnChromeVisible)
                ? 0
                : -5
            }px)`,
            transition: "opacity 220ms ease, transform 260ms ease",
          }}
        >
          <div
            onClick={onExitToAtlas}
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              letterSpacing: "0.18em",
              color: T.body,
              opacity: 0.72,
              cursor: "pointer",
              pointerEvents:
                overviewChromeVisible &&
                !isExitingCaseStudies &&
                !isReturningFromReading &&
                focusedEntryProjectId === null
                  ? "auto"
                  : "none",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
            }}
          >
            ‹ ATLAS
          </div>
        </div>
      )}

      {state === "system-overview" && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            minHeight: MOBILE_CHROME_MIN_HEIGHT,
            padding: `max(0px, env(safe-area-inset-top)) ${MOBILE_CONTENT_INSET} 0`,
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
            zIndex: 8,
          }}
        >
          <div
            onClick={onOverviewBack}
            style={{
              fontFamily: T.mono,
              fontSize: 9,
              letterSpacing: "0.18em",
              color: T.body,
              opacity: 0.72,
              cursor: "pointer",
              pointerEvents: "auto",
              minHeight: 44,
              display: "flex",
              alignItems: "center",
            }}
          >
            ‹ CASE STUDIES
          </div>
        </div>
      )}
    </>
  );
}
