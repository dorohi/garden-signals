import type { FrostResistance, SoilType, SunRequirement } from "../constants";

// ---------------------------------------------------------------------------
// Plant catalog
// ---------------------------------------------------------------------------

export interface PlantCategory {
  id: string;
  /** Localized name, e.g. "Деревья" */
  name: string;
  /** English key, e.g. "trees" */
  nameEn: string;
  icon: string | null;
  order: number;
}

export interface PlantSpecies {
  id: string;
  /** Localized common name, e.g. "Яблоня" */
  name: string;
  nameScientific: string | null;
  categoryId: string;
  imageUrl: string | null;
  /** Days between watering */
  wateringIntervalDays: number | null;
  /** Liters per single watering */
  wateringNormLiters: number | null;
  sunRequirement: SunRequirement;
  soilType: SoilType;
}

export interface PlantVariety {
  id: string;
  /** Variety name, e.g. "Антоновка" */
  name: string;
  speciesId: string;
  /** Days from planting to harvest maturity */
  maturityDays: number | null;
  frostResistance: FrostResistance;
  yieldDescription: string | null;
}
