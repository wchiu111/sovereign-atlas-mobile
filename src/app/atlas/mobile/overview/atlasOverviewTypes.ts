import type { ReactNode } from "react";

export type AtlasOverviewSystemId =
  | "case-studies"
  | "frameworks"
  | "experiments";

export type AtlasOverviewDrawerPhase =
  | "open"
  | "closing"
  | "opening";

export interface AtlasOverviewParentContent {
  headline: string;
  body: string;
  invitation?: string;
}

/**
 * Shared system metadata only.
 *
 * Constellation geometry, node rendering, relationship paths, reading content,
 * and evidence behavior intentionally stay outside this contract.
 */
export interface AtlasOverviewSystemDefinition<
  TSystemId extends string = AtlasOverviewSystemId,
> {
  id: TSystemId;
  title: string;
  countLabel: string;
  color: string;
  parentContent: AtlasOverviewParentContent;
}

export interface AtlasOverviewFrameSlots {
  chrome?: ReactNode;
  narrative?: ReactNode;
}

export interface AtlasOverviewPresentationState<
  TSelectionId extends string = string,
> {
  selectedId: TSelectionId;
  drawerPhase: AtlasOverviewDrawerPhase;
  drawerVisible: boolean;
  chromeVisible: boolean;
  reducedMotion: boolean;
}

/**
 * Minimum adapter shape a future overview implementation can expose to the
 * shared frame without surrendering its system-specific spatial behavior.
 */
export interface AtlasOverviewAdapter<
  TSelectionId extends string = string,
> extends AtlasOverviewPresentationState<TSelectionId> {
  onSelect: (id: TSelectionId) => void;
  onBack: () => void;
  onExplore?: () => void;
}
