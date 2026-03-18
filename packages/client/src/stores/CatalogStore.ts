import { makeAutoObservable, runInAction } from 'mobx';
import { catalogApi } from '../services/api';
import type { RootStore } from './RootStore';

export class CatalogStore {
  categories: any[] = [];
  species: any[] = [];
  selectedSpecies: any = null;
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

  async loadCategories() {
    this.isLoading = true;
    try {
      const { data } = await catalogApi.getCategories();
      runInAction(() => {
        this.categories = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки категорий', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadSpeciesByCategory(categoryId: string) {
    this.isLoading = true;
    try {
      const { data } = await catalogApi.getSpecies({ categoryId });
      runInAction(() => {
        this.species = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки видов', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async searchPlants(query: string) {
    this.isLoading = true;
    this.searchQuery = query;
    try {
      const { data } = await catalogApi.getSpecies({ search: query });
      runInAction(() => {
        this.species = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка поиска', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadSpeciesById(id: string) {
    this.isLoading = true;
    try {
      const { data } = await catalogApi.getSpeciesById(id);
      runInAction(() => {
        this.selectedSpecies = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки вида', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createSpecies(data: Record<string, any>) {
    try {
      await catalogApi.createSpecies(data);
      this.rootStore.snackbarStore.show('Вид создан', 'success');
      await this.loadCategories();
      return true;
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка создания вида', 'error');
      return false;
    }
  }

  async updateSpecies(id: string, data: Record<string, any>) {
    try {
      const { data: updated } = await catalogApi.updateSpecies(id, data);
      runInAction(() => {
        this.selectedSpecies = updated;
      });
      this.rootStore.snackbarStore.show('Вид обновлён', 'success');
      return true;
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка обновления вида', 'error');
      return false;
    }
  }

  async deleteSpecies(id: string) {
    try {
      await catalogApi.deleteSpecies(id);
      this.rootStore.snackbarStore.show('Вид удалён', 'success');
      return true;
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка удаления вида', 'error');
      return false;
    }
  }
}
