import { makeAutoObservable } from 'mobx';

export class ThemeStore {
  mode: 'light' | 'dark' = 'light';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    const saved = localStorage.getItem('themeMode');
    if (saved === 'dark' || saved === 'light') {
      this.mode = saved;
    }
  }

  toggle() {
    this.mode = this.mode === 'light' ? 'dark' : 'light';
    localStorage.setItem('themeMode', this.mode);
  }
}
