// ---------------------------------------------------------------------------
// Garden & UserPlant
// ---------------------------------------------------------------------------

export interface Garden {
  id: string;
  /** Display name, e.g. "Моя дача" */
  name: string;
  userId: string;
  description: string | null;
}

export interface UserPlant {
  id: string;
  gardenId: string;
  varietyId: string;
  /** Optional friendly name given by the user */
  nickname: string | null;
  plantedDate: string;
  quantity: number;
  notes: string | null;
}
