import type { Severity } from "../constants";

// ---------------------------------------------------------------------------
// Pest encyclopedia
// ---------------------------------------------------------------------------

export interface Pest {
  id: string;
  name: string;
  signs: string;
  damage: string | null;
  treatmentChemical: string | null;
  treatmentBio: string | null;
  treatmentFolk: string | null;
  preventionMethods: string | null;
  imageUrl: string | null;
}

/** Many-to-many link between PlantSpecies and Pest */
export interface PlantPest {
  speciesId: string;
  pestId: string;
  severity: Severity;
  /** First applicable month (1-12) */
  seasonStart: number;
  /** Last applicable month (1-12) */
  seasonEnd: number;
}
