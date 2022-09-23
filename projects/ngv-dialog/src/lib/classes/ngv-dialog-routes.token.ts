import { InjectionToken } from '@angular/core';
import { NgvRoutesConfig } from '../models';

export const NGV_DIALOG_ROUTES_BRIDGE_TOKEN = new InjectionToken<NgvRoutesConfig>('', {
  factory: () => {
    return {
      list: []
    };
  }
});
