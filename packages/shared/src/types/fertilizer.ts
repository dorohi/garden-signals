import type { FertilizerType, TreatmentType } from "../constants";

// ---------------------------------------------------------------------------
// Fertilizer & Treatment reference tables
// ---------------------------------------------------------------------------

export interface Fertilizer {
  id: string;
  name: string;
  type: FertilizerType;
  /** Nitrogen content (%) */
  nitrogenN: number | null;
  /** Phosphorus content (%) */
  phosphorusP: number | null;
  /** Potassium content (%) */
  potassiumK: number | null;
  /** Human-readable application rate description */
  applicationRate: string | null;
}

export interface Treatment {
  id: string;
  name: string;
  type: TreatmentType;
  activeIngredient: string | null;
  targetPests: string | null;
  targetDiseases: string | null;
  dosage: string | null;
  /** Days after application before harvest is safe */
  safetyPeriodDays: number | null;
}
