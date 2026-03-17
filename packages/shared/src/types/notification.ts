// ---------------------------------------------------------------------------
// Push notification support
// ---------------------------------------------------------------------------

export interface PushSubscription {
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
}
