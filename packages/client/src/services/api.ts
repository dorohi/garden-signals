import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// --- Auth API ---

export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>('/auth/login', { email, password }),

  register: (email: string, password: string, name: string) =>
    api.post<{ token: string; user: any }>('/auth/register', { email, password, name }),
};

// --- Profile API ---

export const profileApi = {
  getProfile: () => api.get<any>('/profile'),

  updateProfile: (data: Record<string, any>) =>
    api.put<any>('/profile', data),
};

// --- Gardens API ---

export const gardensApi = {
  getGardens: () => api.get<any[]>('/gardens'),

  createGarden: (data: { name: string; description?: string }) =>
    api.post<any>('/gardens', data),

  getGarden: (id: string) => api.get<any>(`/gardens/${id}`),

  updateGarden: (id: string, data: Record<string, any>) =>
    api.put<any>(`/gardens/${id}`, data),

  deleteGarden: (id: string) => api.delete(`/gardens/${id}`),

  addPlant: (gardenId: string, data: Record<string, any>) =>
    api.post<any>(`/gardens/${gardenId}/plants`, data),

  getPlants: (gardenId: string) =>
    api.get<any[]>(`/gardens/${gardenId}/plants`),
};

// --- Plants API ---

export const plantsApi = {
  getPlant: (id: string) => api.get<any>(`/plants/${id}`),

  updatePlant: (id: string, data: Record<string, any>) =>
    api.put<any>(`/plants/${id}`, data),

  deletePlant: (id: string) => api.delete(`/plants/${id}`),

  getSchedules: (plantId: string) =>
    api.get<any[]>(`/plants/${plantId}/schedules`),

  getLogs: (plantId: string) =>
    api.get<any[]>(`/plants/${plantId}/logs`),
};

// --- Schedules API ---

export const schedulesApi = {
  updateSchedule: (id: string, data: Record<string, any>) =>
    api.put<any>(`/schedules/${id}`, data),

  completeSchedule: (id: string, data?: { notes?: string }) =>
    api.post<any>(`/schedules/${id}/complete`, data ?? {}),

  snoozeSchedule: (id: string) =>
    api.post<any>(`/schedules/${id}/snooze`),
};

// --- Calendar API ---

export const calendarApi = {
  getEvents: (from: string, to: string) =>
    api.get<any[]>('/calendar', { params: { from, to } }),

  getTodayTasks: () => api.get<any[]>('/calendar/today'),
};

// --- Catalog API ---

export const catalogApi = {
  getCategories: () => api.get<any[]>('/catalog/categories'),

  getSpecies: (params?: { categoryId?: string; search?: string }) =>
    api.get<any[]>('/catalog/species', { params }),

  getSpeciesById: (id: string) => api.get<any>(`/catalog/species/${id}`),
};

// --- Diseases API ---

export const diseasesApi = {
  getDiseases: (params?: { search?: string }) =>
    api.get<any[]>('/diseases', { params }),

  getDiseaseById: (id: string) => api.get<any>(`/diseases/${id}`),
};

// --- Pests API ---

export const pestsApi = {
  getPests: (params?: { search?: string }) =>
    api.get<any[]>('/pests', { params }),

  getPestById: (id: string) => api.get<any>(`/pests/${id}`),
};

// --- Fertilizers API ---

export const fertilizersApi = {
  getFertilizers: () => api.get<any[]>('/fertilizers'),
};

// --- Treatments API ---

export const treatmentsApi = {
  getTreatments: () => api.get<any[]>('/treatments'),
};

// --- Regions API ---

export const regionsApi = {
  getRegions: () => api.get<any[]>('/regions'),
};

// --- Notifications API ---

export const notificationsApi = {
  subscribe: (subscription: any) =>
    api.post('/notifications/subscribe', subscription),

  unsubscribe: () => api.post('/notifications/unsubscribe'),

  updatePreferences: (prefs: Record<string, any>) =>
    api.put('/notifications/preferences', prefs),

  getTelegramStatus: () =>
    api.get<{ linked: boolean; notifyByTelegram: boolean }>('/notifications/telegram/status'),

  linkTelegram: () =>
    api.post<{ code: string; deepLink: string }>('/notifications/telegram/link'),

  unlinkTelegram: () =>
    api.post('/notifications/telegram/unlink'),
};

export default api;
