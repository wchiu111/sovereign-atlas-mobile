import { T } from "../../components/mobileShared";
import { FRAMEWORK_PARENT_CORE } from "../frameworkGeometry";
import { FRAMEWORK_POSITION_TRANSITION } from "../frameworkMotion";

export default function FrameworkParent({
  selected,
  selectionPulse,
  ambientPaused,
  onSelect,
}: {
  selected: boolean;
  selectionPulse: boolean;
  ambientPaused: boolean;
  onSelect: () => void;
}) {
  const activate = () => onSelect();
  const animationPlayState =
    ambientPaused && !selectionPulse ? "paused" : "running";

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="Frameworks"
      aria-pressed={selected}
      onClick={activate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      }}
      style={{
        transform: `translate(${FRAMEWORK_PARENT_CORE.x}px,${FRAMEWORK_PARENT_CORE.y}px)`,
        transformOrigin: `${FRAMEWORK_PARENT_CORE.x}px ${FRAMEWORK_PARENT_CORE.y}px`,
        transition: FRAMEWORK_POSITION_TRANSITION,
        cursor: "pointer",
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <g
        className={
          selectionPulse
            ? "framework-selection-pulse"
            : selected
            ? "framework-parent-selected"
            : "framework-parent-available"
        }
        style={{ animationPlayState }}
      >
        <circle
          r={selected ? 74 : 62}
          fill={T.frameworks}
          opacity={selected ? 0.10 : 0.035}
          pointerEvents="none"
        />
        <circle
          r={selected ? 48 : 42}
          fill={T.frameworks}
          opacity={selected ? 0.18 : 0.065}
          pointerEvents="none"
        />
        <circle
          r={selected ? 57 : 50}
          fill="none"
          stroke={T.frameworks}
          strokeWidth={selected ? 0.72 : 0.42}
          opacity={selected ? 0.36 : 0.14}
          pointerEvents="none"
        />
        <circle
          r={selected ? 34 : 30}
          fill="none"
          stroke={T.frameworks}
          strokeWidth={0.35}
          opacity={selected ? 0.23 : 0.09}
          pointerEvents="none"
        />
        <circle
          r={selected ? 14 : 11}
          fill={T.frameworks}
          opacity={selected ? 1 : 0.55}
          pointerEvents="none"
        />
      </g>

      <circle r={36} fill="transparent" pointerEvents="all" />

      <text
        y={selected ? 29 : 27}
        textAnchor="middle"
        fontFamily={T.mono}
        fontSize={7.4}
        letterSpacing="0.19em"
        fill={T.frameworks}
        opacity={selected ? 0.90 : 0.55}
        pointerEvents="none"
      >
        FRAMEWORKS
      </text>
    </g>
  );
}
