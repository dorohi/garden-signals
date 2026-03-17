import { AuthStore } from './AuthStore';
import { GardenStore } from './GardenStore';
import { CalendarStore } from './CalendarStore';
import { CatalogStore } from './CatalogStore';
import { DiseaseStore } from './DiseaseStore';
import { PestStore } from './PestStore';
import { NotificationStore } from './NotificationStore';
import { ThemeStore } from './ThemeStore';
import { UIStore } from './UIStore';
import { SnackbarStore } from './SnackbarStore';

export class RootStore {
  authStore: AuthStore;
  gardenStore: GardenStore;
  calendarStore: CalendarStore;
  catalogStore: CatalogStore;
  diseaseStore: DiseaseStore;
  pestStore: PestStore;
  notificationStore: NotificationStore;
  themeStore: ThemeStore;
  uiStore: UIStore;
  snackbarStore: SnackbarStore;

  constructor() {
    this.authStore = new AuthStore(this);
    this.gardenStore = new GardenStore(this);
    this.calendarStore = new CalendarStore(this);
    this.catalogStore = new CatalogStore(this);
    this.diseaseStore = new DiseaseStore(this);
    this.pestStore = new PestStore(this);
    this.notificationStore = new NotificationStore(this);
    this.themeStore = new ThemeStore();
    this.uiStore = new UIStore();
    this.snackbarStore = new SnackbarStore();
  }
}

const rootStore = new RootStore();
export default rootStore;
