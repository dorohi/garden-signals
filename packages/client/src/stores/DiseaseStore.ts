import { makeAutoObservable, runInAction } from 'mobx';
import { diseasesApi } from '../services/api';
import type { RootStore } from './RootStore';

export class DiseaseStore {
  diseases: any[] = [];
  selectedDisease: any = null;
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

  async loadDiseases() {
    this.isLoading = true;
    try {
      const { data } = await diseasesApi.getDiseases();
      runInAction(() => {
        this.diseases = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки болезней', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async searchDiseases(query: string) {
    this.isLoading = true;
    this.searchQuery = query;
    try {
      const { data } = await diseasesApi.getDiseases({ search: query });
      runInAction(() => {
        this.diseases = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка поиска болезней', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadDiseaseById(id: string) {
    this.isLoading = true;
    try {
      const { data } = await diseasesApi.getDiseaseById(id);
      runInAction(() => {
        this.selectedDisease = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки болезни', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
