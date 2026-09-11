import { T } from "../../components/mobileShared";
import { FRAMEWORK_FOCUS_ITEMS } from "../frameworkOverviewData";
import {
  FRAMEWORK_RELATION_PATHS,
  type FrameworkOverviewId,
  frameworkGeometryFor,
} from "../frameworkGeometry";
import { FRAMEWORK_FADE_TRANSITION } from "../frameworkMotion";
import FrameworkNode from "./FrameworkNode";
import FrameworkParent from "./FrameworkParent";

export default function FrameworkOverviewConstellation({
  selectedId,
  onSelect,
}: {
  selectedId: FrameworkOverviewId;
  onSelect: (id: FrameworkOverviewId) => void;
}) {
  const parentSelected = selectedId === "frameworks";

  return (
    <g>
      <g
        style={{
          opacity: parentSelected ? 1 : 0.72,
          transition: FRAMEWORK_FADE_TRANSITION,
          pointerEvents: "none",
        }}
      >
        {FRAMEWORK_RELATION_PATHS.map((path) => (
          <path
            key={path}
            d={path}
            fill="none"
            stroke={T.frameworks}
            strokeWidth={0.42}
            strokeDasharray="3 7"
            opacity={0.12}
          />
        ))}
      </g>

      <FrameworkParent
        selected={parentSelected}
        onSelect={() => onSelect("frameworks")}
      />

      {FRAMEWORK_FOCUS_ITEMS.map((item) => (
        <FrameworkNode
          key={item.id}
          item={item}
          geometry={frameworkGeometryFor(item.id)}
          selected={selectedId === item.id}
          parentSelected={parentSelected}
          onSelect={() => onSelect(item.id)}
        />
      ))}
    </g>
  );
}
