import MobileBackControl from "../../components/MobileBackControl";
import {
  MOBILE_CHROME_MIN_HEIGHT,
  MOBILE_CONTENT_INSET,
} from "../../components/mobileShared";

export default function FrameworksChrome({
  onExitToAtlas,
}: {
  onExitToAtlas: () => void;
}) {
  return (
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
      <MobileBackControl
        label="ATLAS"
        onBack={onExitToAtlas}
        ariaLabel="Return to Atlas"
      />
    </div>
  );
}
