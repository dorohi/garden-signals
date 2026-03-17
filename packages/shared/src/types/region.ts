// ---------------------------------------------------------------------------
// Climate regions
// ---------------------------------------------------------------------------

export interface ClimateRegion {
  id: string;
  name: string;
  code: string;
  /** Frost-free period start in MM-DD format */
  frostFreeStart: string;
  /** Frost-free period end in MM-DD format */
  frostFreeEnd: string;
  /** Number of days to shift the default care calendar */
  calendarOffsetDays: number;
}
