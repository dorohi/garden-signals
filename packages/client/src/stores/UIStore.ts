import { makeAutoObservable } from 'mobx';

export class UIStore {
  sidebarOpen = false;
  sidebarCollapsed = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    const saved = localStorage.getItem('sidebarCollapsed');
    if (saved === 'true') this.sidebarCollapsed = true;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setSidebarOpen(open: boolean) {
    this.sidebarOpen = open;
  }

  toggleSidebarCollapsed() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    localStorage.setItem('sidebarCollapsed', String(this.sidebarCollapsed));
  }
}
