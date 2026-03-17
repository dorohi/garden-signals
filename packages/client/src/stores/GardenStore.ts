import { makeAutoObservable, runInAction } from 'mobx';
import { gardensApi, plantsApi } from '../services/api';
import type { RootStore } from './RootStore';

export class GardenStore {
  gardens: any[] = [];
  currentGarden: any = null;
  userPlants: any[] = [];
  isLoading = false;

  private rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadGardens() {
    this.isLoading = true;
    try {
      const { data } = await gardensApi.getGardens();
      runInAction(() => {
        this.gardens = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки садов', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async loadGarden(id: string) {
    this.isLoading = true;
    try {
      const { data } = await gardensApi.getGarden(id);
      runInAction(() => {
        this.currentGarden = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки сада', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async createGarden(name: string, description?: string) {
    this.isLoading = true;
    try {
      const { data } = await gardensApi.createGarden({ name, description });
      runInAction(() => {
        this.gardens.push(data);
      });
      this.rootStore.snackbarStore.show('Сад создан', 'success');
      return data;
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка создания сада', 'error');
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async deleteGarden(id: string) {
    try {
      await gardensApi.deleteGarden(id);
      runInAction(() => {
        this.gardens = this.gardens.filter((g) => g.id !== id);
      });
      this.rootStore.snackbarStore.show('Сад удалён', 'success');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка удаления сада', 'error');
    }
  }

  async addPlant(gardenId: string, data: Record<string, any>) {
    this.isLoading = true;
    try {
      const { data: plant } = await gardensApi.addPlant(gardenId, data);
      runInAction(() => {
        this.userPlants.push(plant);
      });
      this.rootStore.snackbarStore.show('Растение добавлено', 'success');
      return plant;
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка добавления растения', 'error');
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async removePlant(id: string) {
    try {
      await plantsApi.deletePlant(id);
      runInAction(() => {
        this.userPlants = this.userPlants.filter((p) => p.id !== id);
      });
      this.rootStore.snackbarStore.show('Растение удалено', 'success');
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка удаления растения', 'error');
    }
  }

  async loadPlants(gardenId: string) {
    this.isLoading = true;
    try {
      const { data } = await gardensApi.getPlants(gardenId);
      runInAction(() => {
        this.userPlants = data;
      });
    } catch (error: any) {
      this.rootStore.snackbarStore.show('Ошибка загрузки растений', 'error');
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}
