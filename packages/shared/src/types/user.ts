// ---------------------------------------------------------------------------
// User — full DB-level DTO (server-side only, but typed here for sharing)
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  regionId: string | null;
  telegramChatId: string | null;
  notifyByPush: boolean;
  notifyByTelegram: boolean;
  /** Default digest delivery time in HH:mm format, e.g. "08:00" */
  digestTime: string;
}
