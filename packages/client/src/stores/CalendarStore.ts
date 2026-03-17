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
        this.events = this.events.filter((e) => e.id !== scheduleId);
        this.todayTasks = this.todayTasks.filter((t) => t.id !== scheduleId);
      });
      this.rootStore.snackbarStore.show('Задача выполнена', 'success');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка выполнения задачи', 'error');
    }
  }

  async snoozeTask(scheduleId: string) {
    try {
      const { data } = await schedulesApi.snoozeSchedule(scheduleId);
      runInAction(() => {
        // Update the event with new nextDueDate
        this.events = this.events.map((e) =>
          e.id === scheduleId ? { ...e, nextDueDate: data.nextDueDate } : e,
        );
        this.todayTasks = this.todayTasks.filter((t) => t.id !== scheduleId);
      });
      this.rootStore.snackbarStore.show('Задача отложена на завтра', 'info');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка откладывания задачи', 'error');
    }
  }
}
