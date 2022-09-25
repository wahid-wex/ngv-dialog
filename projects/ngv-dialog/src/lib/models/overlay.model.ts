import { NgvDialogOptionModel } from './';

export interface OverlayModel {
  open(component: any, options?: NgvDialogOptionModel): void;

  getData(): any;

  afterClose(): Promise<any>;

  close(e?): void;
}
