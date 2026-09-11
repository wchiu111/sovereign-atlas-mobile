import { MOBILE_FRAMEWORKS } from "./frameworkRegistry";
import { FRAMEWORK_LABEL_LINES } from "./frameworkGeometry";

/**
 * Overview-specific presentation data for the five active frameworks.
 *
 * The registry remains the source of truth for authored framework documents.
 * This focus dataset adds only overview/presentation metadata so visual
 * interaction can evolve without polluting the content documents.
 */
export const FRAMEWORK_FOCUS_ITEMS = MOBILE_FRAMEWORKS.map(
  (framework, index) => ({
    ...framework,
    meta: `FRAMEWORK ${index + 1} OF ${MOBILE_FRAMEWORKS.length}`,
    labelLines: FRAMEWORK_LABEL_LINES[framework.id],
  }),
);

export type FrameworkFocusItem = (typeof FRAMEWORK_FOCUS_ITEMS)[number];
