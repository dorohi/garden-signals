import { makeAutoObservable, runInAction } from 'mobx';
import { pestsApi } from '../services/api';
import type { RootStore } from './RootStore';

export class PestStore {
  pests: any[] = [];
  selectedPest: any = null;
  searchQuery = '';
  isLoading = false;

  private rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  async loadPests() {
    this.isLoading = true;
    try {
      const { data } = await pestsApi.getPests();
      runInAction(() => {
        this.pests = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки вредителей', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async searchPests(query: string) {
    this.isLoading = true;
    this.searchQuery = query;
    try {
      const { data } = await pestsApi.getPests({ search: query });
      runInAction(() => {
        this.pests = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка поиска вредителей', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadPestById(id: string) {
    this.isLoading = true;
    try {
      const { data } = await pestsApi.getPestById(id);
      runInAction(() => {
        this.selectedPest = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки вредителя', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
