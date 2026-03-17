import { makeAutoObservable } from 'mobx';

export type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

export class SnackbarStore {
  message = '';
  severity: SnackbarSeverity = 'info';
  open = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  show(message: string, severity: SnackbarSeverity = 'info') {
    this.message = message;
    this.severity = severity;
    this.open = true;
  }

  hide() {
    this.open = false;
  }
}
