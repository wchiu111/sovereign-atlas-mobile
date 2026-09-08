import { SOVEREIGN_ATLAS_READING } from "./sovereignAtlasReadingScaffold";
import { SOVEREIGN_ATLAS_EVIDENCE } from "./sovereignAtlasEvidence";
import { AGENTIC_INSURANCE_READING } from "./agenticInsuranceReadingScaffold";
import { AGENTIC_INSURANCE_EVIDENCE } from "./agenticInsuranceEvidence";
import type {
  MobileCaseStudyProjectId,
  MobileCaseStudyReadingDocument,
} from "./mobileReadingTypes";

const SOVEREIGN_ATLAS_DOCUMENT: MobileCaseStudyReadingDocument = {
  id: "sovereign-atlas",
  title: SOVEREIGN_ATLAS_READING.title,
  ariaLabel: "Sovereign Atlas case study",
  sections: SOVEREIGN_ATLAS_READING.sections,
  evidence: SOVEREIGN_ATLAS_EVIDENCE,
};

const AGENTIC_INSURANCE_DOCUMENT: MobileCaseStudyReadingDocument = {
  id: "agentic-insurance",
  title: AGENTIC_INSURANCE_READING.title,
  ariaLabel: "Agentic Insurance case study",
  sections: AGENTIC_INSURANCE_READING.sections,
  evidence: AGENTIC_INSURANCE_EVIDENCE,
};

export function mobileCaseStudyDocumentFor(
  projectId: MobileCaseStudyProjectId | null,
): MobileCaseStudyReadingDocument {
  if (projectId === "agentic-insurance") return AGENTIC_INSURANCE_DOCUMENT;

  // Globality and Oracle remain on the existing fallback until their
  // authored mobile content is migrated in later passes.
  return SOVEREIGN_ATLAS_DOCUMENT;
}
