import type { Severity } from "../constants";

// ---------------------------------------------------------------------------
// Disease encyclopedia
// ---------------------------------------------------------------------------

export interface Disease {
  id: string;
  name: string;
  symptoms: string;
  cause: string | null;
  prevention: string | null;
  treatmentChemical: string | null;
  treatmentBio: string | null;
  treatmentFolk: string | null;
  imageUrl: string | null;
}

/** Many-to-many link between PlantSpecies and Disease */
export interface PlantDisease {
  speciesId: string;
  diseaseId: string;
  severity: Severity;
  /** First applicable month (1-12) */
  seasonStart: number;
  /** Last applicable month (1-12) */
  seasonEnd: number;
}
