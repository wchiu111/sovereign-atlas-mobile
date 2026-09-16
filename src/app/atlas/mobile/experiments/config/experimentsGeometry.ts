import type { MobileExperimentId } from "../experimentsTypes";
import type {
  ConstellationNodeGeometry,
  ConstellationRelation,
} from "../template/constellationTypes";

export const EXPERIMENTS_PARENT_CORE = { x: 195, y: 270 } as const;

/**
 * Authored, intentionally non-uniform overview geometry.
 *
 * The template accepts explicit geometry instead of forcing every future
 * constellation into a circle. Experiments uses an irregular five-node field
 * to keep the system exploratory while preserving readable mobile spacing.
 */
export const EXPERIMENTS_OVERVIEW_LAYOUT: readonly ConstellationNodeGeometry<MobileExperimentId>[] = [
  {
    id: "ai-evaluation",
    x: 94,
    y: 156,
    labelX: 94,
    labelY: 188,
    anchor: "middle",
  },
  {
    id: "authority-drift",
    x: 294,
    y: 158,
    labelX: 294,
    labelY: 190,
    anchor: "middle",
  },
  {
    id: "design-philosophy",
    x: 321,
    y: 292,
    labelX: 321,
    labelY: 324,
    anchor: "middle",
  },
  {
    id: "gestalt-principles",
    x: 232,
    y: 402,
    labelX: 232,
    labelY: 434,
    anchor: "middle",
  },
  {
    id: "think-like-a-designer",
    x: 70,
    y: 334,
    labelX: 70,
    labelY: 366,
    anchor: "middle",
  },
] as const;

function point(id: MobileExperimentId) {
  return (
    EXPERIMENTS_OVERVIEW_LAYOUT.find((item) => item.id === id) ??
    EXPERIMENTS_OVERVIEW_LAYOUT[0]
  );
}

function spoke(id: MobileExperimentId) {
  const target = point(id);
  return `M${EXPERIMENTS_PARENT_CORE.x} ${EXPERIMENTS_PARENT_CORE.y} L${target.x} ${target.y}`;
}

const ai = point("ai-evaluation");
const authority = point("authority-drift");
const design = point("design-philosophy");
const gestalt = point("gestalt-principles");
const thinking = point("think-like-a-designer");

export const EXPERIMENTS_RELATIONS: readonly ConstellationRelation[] = [
  ...([
    "ai-evaluation",
    "authority-drift",
    "design-philosophy",
    "gestalt-principles",
    "think-like-a-designer",
  ] as const).map((id) => ({
    id: `parent-${id}`,
    d: spoke(id),
    strength: "primary" as const,
    dashed: true,
  })),
  {
    id: "evaluation-authority",
    d: `M${ai.x} ${ai.y} C${ai.x + 46} ${ai.y - 24} ${authority.x - 46} ${authority.y - 24} ${authority.x} ${authority.y}`,
    strength: "secondary",
  },
  {
    id: "design-gestalt",
    d: `M${design.x} ${design.y} C${design.x + 6} ${design.y + 52} ${gestalt.x + 54} ${gestalt.y - 44} ${gestalt.x} ${gestalt.y}`,
    strength: "secondary",
  },
  {
    id: "thinking-ai",
    d: `M${thinking.x} ${thinking.y} C${thinking.x - 18} ${thinking.y - 72} ${ai.x - 34} ${ai.y + 52} ${ai.x} ${ai.y}`,
    strength: "secondary",
  },
] as const;
