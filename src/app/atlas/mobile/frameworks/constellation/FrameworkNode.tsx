import { T } from "../../components/mobileShared";
import type { FrameworkFocusItem } from "../frameworkOverviewData";
import type { FrameworkOverviewGeometry } from "../frameworkGeometry";
import { FRAMEWORK_POSITION_TRANSITION } from "../frameworkMotion";

export default function FrameworkNode({
  item,
  geometry,
  selected,
  parentSelected,
  onSelect,
}: {
  item: FrameworkFocusItem;
  geometry: FrameworkOverviewGeometry;
  selected: boolean;
  parentSelected: boolean;
  onSelect: () => void;
}) {
  const coreR = selected ? 7.5 : 6.5;
  const siblingOpacity = selected ? 1 : parentSelected ? 0.86 : 0.78;

  const activate = () => onSelect();

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={item.title}
      aria-pressed={selected}
      onClick={activate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activate();
        }
      }}
      style={{
        cursor: "pointer",
        opacity: siblingOpacity,
        transition: FRAMEWORK_POSITION_TRANSITION,
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <g
        style={{
          transform: `translate(${geometry.x}px,${geometry.y}px)`,
          transformOrigin: `${geometry.x}px ${geometry.y}px`,
          transition: FRAMEWORK_POSITION_TRANSITION,
        }}
      >
        <circle
          r={selected ? 30 : 24}
          fill={T.frameworks}
          opacity={selected ? 0.13 : 0.07}
          pointerEvents="none"
        />
        <circle
          r={selected ? 18 : 14}
          fill={T.frameworks}
          opacity={selected ? 0.24 : 0.14}
          pointerEvents="none"
        />
        <circle
          r={selected ? 21 : 17}
          fill="none"
          stroke={T.frameworks}
          strokeWidth={selected ? 0.7 : 0.5}
          opacity={selected ? 0.44 : 0.24}
          pointerEvents="none"
        />
        <circle
          r={coreR}
          fill={T.frameworks}
          opacity={selected ? 1 : 0.84}
          pointerEvents="none"
        />
        <circle r={28} fill="transparent" pointerEvents="all" />
      </g>

      <text
        x={geometry.labelX}
        y={geometry.labelY}
        textAnchor={geometry.anchor}
        fontFamily={T.mono}
        fontSize={9.25}
        letterSpacing="0.08em"
        fill={T.frameworks}
        opacity={selected ? 1 : parentSelected ? 0.86 : 0.78}
        pointerEvents="none"
      >
        {item.labelLines.map((line, index) => (
          <tspan
            key={line}
            x={geometry.labelX}
            dy={index === 0 ? 0 : 11}
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
}
