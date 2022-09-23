import { NgvDialogOptionModel } from './';

export interface NgvRoutes {
  fragment: string;
  component: {};
}

export interface NgvRoutesConfig {
  list: NgvRoutes[];
  options?: NgvDialogOptionModel;
}
