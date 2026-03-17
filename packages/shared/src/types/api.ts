// ---------------------------------------------------------------------------
// Generic API envelope
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Auth DTOs
// ---------------------------------------------------------------------------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// ---------------------------------------------------------------------------
// UserProfile — the public subset returned by the API (no passwordHash)
// ---------------------------------------------------------------------------

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  regionId: string | null;
  telegramChatId: string | null;
  notifyByPush: boolean;
  notifyByTelegram: boolean;
  digestTime: string;
}
