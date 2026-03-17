import { makeAutoObservable, runInAction } from 'mobx';
import { calendarApi, schedulesApi } from '../services/api';
import type { RootStore } from './RootStore';

export type ViewMode = 'day' | 'week' | 'month';

export class CalendarStore {
  currentDate: Date = new Date();
  viewMode: ViewMode = 'month';
  events: any[] = [];
  todayTasks: any[] = [];
  isLoading = false;

  private rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setCurrentDate(date: Date) {
    this.currentDate = date;
  }

  setViewMode(mode: ViewMode) {
    this.viewMode = mode;
  }

  async loadEvents(from: string, to: string) {
    this.isLoading = true;
    try {
      const { data } = await calendarApi.getEvents(from, to);
      runInAction(() => {
        this.events = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки событий', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadTodayTasks() {
    this.isLoading = true;
    try {
      const { data } = await calendarApi.getTodayTasks();
      runInAction(() => {
        this.todayTasks = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки задач', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async completeTask(scheduleId: string, notes?: string) {
    try {
      await schedulesApi.completeSchedule(scheduleId, notes ? { notes } : undefined);
      runInAction(() => {
        this.todayTasks = this.todayTasks.filter((t) => t.scheduleId !== scheduleId);
      });
      this.rootStore.snackbarStore.show('Задача выполнена', 'success');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка выполнения задачи', 'error');
    }
  }

  async snoozeTask(scheduleId: string) {
    try {
      await schedulesApi.snoozeSchedule(scheduleId);
      runInAction(() => {
        this.todayTasks = this.todayTasks.filter((t) => t.scheduleId !== scheduleId);
      });
      this.rootStore.snackbarStore.show('Задача отложена', 'info');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка откладывания задачи', 'error');
    }
  }
}
