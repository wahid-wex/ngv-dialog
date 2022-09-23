import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgvDialogComponent } from './components/ngv-dialog/ngv-dialog.component';
import { BehaviorSubject, Subject } from 'rxjs';
import { NGV_DIALOG_CLOSE_TOKEN ,NGV_DIALOG_TEMPLATE_TOKEN ,NGV_DIALOG_ROUTES_BRIDGE_TOKEN } from './classes';
import { NgvRoutesConfig, TemplateCarrierType} from './models';

@NgModule({
  declarations: [
    NgvDialogComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    {
      provide: NGV_DIALOG_TEMPLATE_TOKEN, useFactory: (() => {
        return new BehaviorSubject<TemplateCarrierType>(null);
      })
    },
    {
      provide: NGV_DIALOG_CLOSE_TOKEN, useFactory: (() => {
        return new Subject<void>();
      })
    },
  ]
})
export class NgvDialogModule {
  static setRoutes(routes: NgvRoutesConfig): ModuleWithProviders<NgvDialogModule> {
    routes = routes ? routes :{list: []};
    return {
      ngModule: NgvDialogModule,
      providers: [
        {
          provide: NGV_DIALOG_ROUTES_BRIDGE_TOKEN,
          useValue: routes
        }
      ]
    };
  }
}
