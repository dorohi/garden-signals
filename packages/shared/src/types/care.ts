import type { CareType, Priority } from "../constants";

// ---------------------------------------------------------------------------
// Care system
// ---------------------------------------------------------------------------

export interface CareTemplate {
  speciesId: string;
  careType: CareType;
  title: string;
  /** iCal RRULE string */
  rrule: string;
  /** First applicable month (1-12) */
  monthStart: number;
  /** Last applicable month (1-12) */
  monthEnd: number;
  fertilizerId: string | null;
  treatmentId: string | null;
  priority: Priority;
}

export interface CareSchedule {
  id: string;
  userPlantId: string;
  careType: CareType;
  title: string;
  /** iCal RRULE string */
  rrule: string;
  nextDueDate: string;
  fertilizerId: string | null;
  treatmentId: string | null;
  isActive: boolean;
}

export interface CareLog {
  id: string;
  userPlantId: string;
  scheduleId: string | null;
  userId: string;
  careType: CareType;
  title: string;
  notes: string | null;
  photoUrl: string | null;
  completedAt: string;
}
