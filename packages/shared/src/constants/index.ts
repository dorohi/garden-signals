// ---------------------------------------------------------------------------
// Enums — used both as types and runtime values
// ---------------------------------------------------------------------------

export enum PlantCategoryKey {
  TREES = "TREES",
  GRAPES = "GRAPES",
  VEGETABLES = "VEGETABLES",
  BERRIES = "BERRIES",
  SHRUBS = "SHRUBS",
  HERBS = "HERBS",
}

export enum CareType {
  WATER = "WATER",
  FERTILIZE = "FERTILIZE",
  PRUNE = "PRUNE",
  SPRAY = "SPRAY",
  HARVEST = "HARVEST",
  PLANT = "PLANT",
}

export enum SunRequirement {
  FULL_SUN = "FULL_SUN",
  PARTIAL_SHADE = "PARTIAL_SHADE",
  FULL_SHADE = "FULL_SHADE",
}

export enum SoilType {
  SANDY = "SANDY",
  LOAMY = "LOAMY",
  CLAY = "CLAY",
  PEATY = "PEATY",
  CHALKY = "CHALKY",
  SILTY = "SILTY",
}

export enum FrostResistance {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}

export enum Severity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum FertilizerType {
  MINERAL = "MINERAL",
  ORGANIC = "ORGANIC",
  COMPLEX = "COMPLEX",
}

export enum TreatmentType {
  CHEMICAL = "CHEMICAL",
  BIOLOGICAL = "BIOLOGICAL",
  FOLK = "FOLK",
}
