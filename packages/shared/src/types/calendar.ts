import type { CareType, Priority } from "../constants";

// ---------------------------------------------------------------------------
// Calendar — derived views used by the client
// ---------------------------------------------------------------------------

/** A single upcoming task shown in the calendar / task list */
export interface CalendarTask {
  scheduleId: string;
  userPlantId: string;
  plantName: string;
  careType: CareType;
  title: string;
  dueDate: string;
  priority: Priority;
  isOverdue: boolean;
}

/** Tasks grouped by date for the daily/weekly view */
export interface CalendarDay {
  date: string;
  tasks: CalendarTask[];
}
