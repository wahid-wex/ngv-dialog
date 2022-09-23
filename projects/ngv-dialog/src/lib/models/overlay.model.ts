import { Observable } from 'rxjs';
import { NgvDialogOptionModel } from './';

export interface OverlayModel {
  open(component: any, options?: NgvDialogOptionModel): void;

  getData(): any;

  afterClose(): Observable<any>;

  close(e?): void;

  init(name: string): void | string;

  openAutomationByRoutes(): void;
}
