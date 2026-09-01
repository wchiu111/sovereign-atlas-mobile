import { FADE, T } from "../../components/mobileShared";
import { CASE_STUDY_FOCUS_ITEMS, CASE_STUDY_PROJECTS } from "../caseStudyData";
import { CASE_STUDY_OVERVIEW_LAYOUT, OVERVIEW_CORE } from "../caseStudyGeometry";
import { CASE_STUDIES_PULL_EASE, PROJECT_BREATH_DELAYS } from "../caseStudyMotion";

export default function CaseStudyOverviewConstellation({
  selectedId,
  onSelect,
  transitionPreview = false,
  labelsVisible = true,
  selectionPulseId = null,
  ambientPaused = false,
  focusedEntryId = null,
  focusedEntryProgress = 0,
  focusedReturnId = null,
  focusedReturnProgress = 0,
  reducedMotion = false,
}: {
  selectedId: (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"];
  onSelect: (id: (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"]) => void;
  transitionPreview?: boolean;
  labelsVisible?: boolean;
  selectionPulseId?: (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"] | null;
  ambientPaused?: boolean;
  focusedEntryId?: (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"] | null;
  focusedEntryProgress?: number;
  focusedReturnId?: (typeof CASE_STUDY_FOCUS_ITEMS)[number]["id"] | null;
  focusedReturnProgress?: number;
  reducedMotion?: boolean;
}) {
  const caseStudiesSelected = selectedId === "case-studies";

  return (
    <g>
      <path
        d="M92 344 C118 242 160 174 232 190 C304 205 332 274 294 368"
        fill="none"
        stroke={T.caseStudies}
        strokeWidth={0.55}
        strokeDasharray="4 7"
        opacity={transitionPreview ? 0.015 : focusedEntryId ? 0.14 * (1 - focusedEntryProgress) : focusedReturnId ? 0.14 * focusedReturnProgress : 0.14}
      />
      <path
        d="M118 300 C172 222 248 220 315 278"
        fill="none"
        stroke={T.caseStudies}
        strokeWidth={0.35}
        strokeDasharray="2 6"
        opacity={transitionPreview ? 0.008 : focusedEntryId ? 0.08 * (1 - focusedEntryProgress) : focusedReturnId ? 0.08 * focusedReturnProgress : 0.08}
      />

      <g
        style={{
          transform: `translate(${OVERVIEW_CORE.x}px,${OVERVIEW_CORE.y}px) scale(1)`,
          transformOrigin: "center",
          transition: `transform 260ms ${CASE_STUDIES_PULL_EASE}, opacity 220ms ease`,
          cursor: transitionPreview ? "default" : "pointer",
          opacity: transitionPreview
            ? 0.86
            : focusedEntryId
            ? 1 - focusedEntryProgress
            : focusedReturnId
            ? focusedReturnProgress
            : 1,
        }}
        onClick={() => { if (!transitionPreview) onSelect("case-studies"); }}
      >
        <g
          className={
            transitionPreview
              ? undefined
              : selectionPulseId === "case-studies"
              ? "atlas-selection-pulse"
              : caseStudiesSelected
              ? "atlas-parent-core-selected"
              : "atlas-parent-core-available"
          }
          style={{
            animationDelay:
              selectionPulseId === "case-studies" || caseStudiesSelected
                ? "0s"
                : "0.45s",
            animationPlayState:
              ambientPaused && selectionPulseId !== "case-studies"
                ? "paused"
                : "running",
          }}
        >
          <circle r={74} fill={T.caseStudies} opacity={caseStudiesSelected ? 0.11 : 0.04} />
          <circle r={48} fill={T.caseStudies} opacity={caseStudiesSelected ? 0.20 : 0.08} />
          <circle r={57} fill="none" stroke={T.caseStudies} strokeWidth={caseStudiesSelected ? 0.75 : 0.45} opacity={caseStudiesSelected ? 0.38 : 0.16} />
          <circle r={34} fill="none" stroke={T.caseStudies} strokeWidth={0.35} opacity={caseStudiesSelected ? 0.24 : 0.10} />
          <circle r={14} fill={T.caseStudies} opacity={caseStudiesSelected ? 1 : 0.58} />
        </g>
        <circle r={34} fill="transparent" pointerEvents="all" />
      </g>

      {CASE_STUDY_PROJECTS.map((project, index) => {
        const layout = CASE_STUDY_OVERVIEW_LAYOUT[index];
        const isSelected = selectedId === project.id;
        const isFocusedEntry = focusedEntryId === project.id;
        const isFocusedReturn = focusedReturnId === project.id;
        const siblingEntryOpacity = focusedEntryId
          ? isFocusedEntry
            ? 1
            : 1 - focusedEntryProgress
          : focusedReturnId
          ? isFocusedReturn
            ? 1
            : focusedReturnProgress
          : 1;
        const focusedScale = isFocusedEntry
          ? reducedMotion
            ? 1
            : 1 + 0.18 * focusedEntryProgress
          : isFocusedReturn
          ? reducedMotion
            ? 1
            : 1 + 0.18 * (1 - focusedReturnProgress)
          : 1;
        const focusedHaloOpacity = isFocusedEntry
          ? Math.min(1, 0.72 + focusedEntryProgress * 0.28)
          : 1;
        const focusedLabelOpacity = isFocusedEntry
          ? focusedEntryProgress < 0.68
            ? 1
            : Math.max(0, 1 - (focusedEntryProgress - 0.68) / 0.32)
          : 1;
        const returnLabelOpacity = focusedReturnId
          ? isFocusedReturn
            ? 1
            : Math.max(0, Math.min(1, (focusedReturnProgress - 0.52) / 0.48))
          : 1;
        const lines =
          project.label === "AGENTIC INSURANCE"
            ? ["AGENTIC", "INSURANCE"]
            : project.label === "SOVEREIGN ATLAS"
            ? ["SOVEREIGN", "ATLAS"]
            : [project.label];

        return (
          <g
            key={project.id}
            onClick={() => { if (!transitionPreview) onSelect(project.id); }}
            style={{
              cursor: focusedEntryId || focusedReturnId ? "default" : "pointer",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
              opacity: siblingEntryOpacity,
              transition: focusedEntryId || focusedReturnId ? "none" : FADE,
              pointerEvents: focusedEntryId || focusedReturnId ? "none" : "auto",
            }}
          >
            <g
              className={
                transitionPreview || isSelected
                  ? undefined
                  : caseStudiesSelected
                  ? "atlas-node-brightness-parent"
                  : "atlas-node-brightness-sibling"
              }
              style={{
                transform: `translate(${layout.x}px,${layout.y}px) scale(${focusedScale})`,
                transformOrigin: `${layout.x}px ${layout.y}px`,
                transition: focusedEntryId || focusedReturnId
                  ? "none"
                  : `transform 280ms ${CASE_STUDIES_PULL_EASE}`,
                animationDelay: transitionPreview
                  ? "0s"
                  : `${PROJECT_BREATH_DELAYS[index]}s`,
                animationPlayState: ambientPaused ? "paused" : "running",
              }}
            >
              <g
                className={
                  transitionPreview
                    ? undefined
                    : selectionPulseId === project.id
                    ? "atlas-selection-pulse"
                    : isSelected
                    ? "atlas-halo-selected"
                    : "atlas-halo-available"
                }
                style={{
                  animationDelay:
                    transitionPreview || selectionPulseId === project.id
                      ? "0s"
                      : `${PROJECT_BREATH_DELAYS[index]}s`,
                  animationPlayState:
                    ambientPaused && selectionPulseId !== project.id
                      ? "paused"
                      : "running",
                  opacity: focusedHaloOpacity,
                }}
              >
                <circle r={isSelected ? 30 : 24} fill={project.color} opacity={isSelected ? 0.13 : 0.07} />
                <circle r={isSelected ? 18 : 14} fill={project.color} opacity={isSelected ? 0.24 : 0.14} />
                <circle r={isSelected ? 21 : 17} fill="none" stroke={project.color} strokeWidth={isSelected ? 0.7 : 0.5} opacity={isSelected ? 0.44 : 0.24} />
              </g>

              <g
                className={
                  transitionPreview
                    ? undefined
                    : isSelected
                    ? "atlas-core-selected"
                    : "atlas-core-available"
                }
                style={{
                  animationDelay: transitionPreview
                    ? "0s"
                    : `${PROJECT_BREATH_DELAYS[index]}s`,
                  animationPlayState: ambientPaused ? "paused" : "running",
                }}
              >
                <circle r={isSelected ? 7.5 : 6.5} fill={project.color} opacity={isSelected ? 1 : 0.84} />
              </g>
              <circle r={24} fill="transparent" pointerEvents="all" />
            </g>

            <text
              x={layout.labelX}
              y={layout.labelY}
              textAnchor={layout.anchor}
              fontFamily={T.mono}
              fontSize={10.5}
              letterSpacing="0.08em"
              fill={project.color}
              opacity={
                transitionPreview || !labelsVisible
                  ? 0
                  : focusedEntryId
                  ? (isFocusedEntry ? focusedLabelOpacity : 0)
                  : focusedReturnId
                  ? (isFocusedReturn ? 1 : returnLabelOpacity)
                  : isSelected
                  ? 1
                  : caseStudiesSelected
                  ? 0.86
                  : 0.78
              }
              style={{
                transition: "opacity 240ms ease",
              }}
            >
              {lines.map((line, lineIndex) => (
                <tspan key={line} x={layout.labelX} dy={lineIndex === 0 ? 0 : 12}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </g>
  );
}
