import { makeAutoObservable, runInAction } from 'mobx';
import { notificationsApi } from '../services/api';
import type { RootStore } from './RootStore';

export class NotificationStore {
  isSubscribed = false;
  preferences: Record<string, any> = {};
  isLoading = false;

  telegramLinked = false;
  notifyByTelegram = false;
  telegramDeepLink: string | null = null;

  private rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async subscribe() {
    this.isLoading = true;
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        this.rootStore.snackbarStore.show('Push-уведомления не поддерживаются', 'warning');
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY as string,
      });

      await notificationsApi.subscribe(subscription.toJSON());
      runInAction(() => {
        this.isSubscribed = true;
      });
      this.rootStore.snackbarStore.show('Уведомления включены', 'success');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка подписки на уведомления', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async unsubscribe() {
    this.isLoading = true;
    try {
      await notificationsApi.unsubscribe();
      runInAction(() => {
        this.isSubscribed = false;
      });
      this.rootStore.snackbarStore.show('Уведомления отключены', 'info');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка отписки от уведомлений', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async updatePreferences() {
    this.isLoading = true;
    try {
      await notificationsApi.updatePreferences(this.preferences);
      this.rootStore.snackbarStore.show('Настройки сохранены', 'success');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка сохранения настроек', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadTelegramStatus() {
    try {
      const { data } = await notificationsApi.getTelegramStatus();
      runInAction(() => {
        this.telegramLinked = data.linked;
        this.notifyByTelegram = data.notifyByTelegram;
      });
    } catch {
      // ignore
    }
  }

  async linkTelegram() {
    this.isLoading = true;
    try {
      const { data } = await notificationsApi.linkTelegram();
      runInAction(() => {
        this.telegramDeepLink = data.deepLink;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка привязки Telegram', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async unlinkTelegram() {
    this.isLoading = true;
    try {
      await notificationsApi.unlinkTelegram();
      runInAction(() => {
        this.telegramLinked = false;
        this.notifyByTelegram = false;
        this.telegramDeepLink = null;
      });
      this.rootStore.snackbarStore.show('Telegram отвязан', 'info');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка отвязки Telegram', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async toggleTelegramNotify() {
    const newValue = !this.notifyByTelegram;
    try {
      await notificationsApi.updatePreferences({ notifyByTelegram: newValue });
      runInAction(() => {
        this.notifyByTelegram = newValue;
      });
    } catch {
      this.rootStore.snackbarStore.show('Ошибка обновления настроек', 'error');
    }
  }
}
