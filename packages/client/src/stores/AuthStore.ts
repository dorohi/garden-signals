import { makeAutoObservable, runInAction } from 'mobx';
import { authApi, profileApi } from '../services/api';
import type { RootStore } from './RootStore';

export class AuthStore {
  user: any = null;
  token: string | null = null;
  isLoading = false;

  private rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
    this.loadFromStorage();
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  loadFromStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      this.token = token;
      this.loadProfile();
    }
  }

  async loadProfile() {
    try {
      const { data } = await profileApi.getProfile();
      runInAction(() => {
        this.user = data;
      });
    } catch {
      // Token might be invalid
      this.logout();
    }
  }

  async login(email: string, password: string) {
    this.isLoading = true;
    try {
      const { data } = await authApi.login(email, password);
      runInAction(() => {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', data.token);
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Ошибка входа';
      this.rootStore.snackbarStore.show(message, 'error');
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async register(email: string, password: string, name: string) {
    this.isLoading = true;
    try {
      const { data } = await authApi.register(email, password, name);
      runInAction(() => {
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', data.token);
      });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Ошибка регистрации';
      this.rootStore.snackbarStore.show(message, 'error');
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  logout() {
    this.token = null;
    this.user = null;
    localStorage.removeItem('token');
  }
}
