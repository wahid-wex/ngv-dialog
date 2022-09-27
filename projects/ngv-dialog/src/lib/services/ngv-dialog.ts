import { ComponentFactory, ComponentFactoryResolver, inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgvDialogComponent } from '../components/ngv-dialog/ngv-dialog.component';
import { NGV_DIALOG_CLOSE_TOKEN, NGV_DIALOG_ROUTES_BRIDGE_TOKEN, NGV_DIALOG_TEMPLATE_TOKEN } from '../classes';
import { NgvDialogOptionModel, NgvRoutesConfig, OpenedDialogModel, OverlayModel, TemplateCarrierType } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NgvDialog implements OverlayModel {
  /**
   * ---------------------------------------------------------------------------------------------------------------------------------------
   * @property injector factory componentFactoryResolver
   * these three properties help us to inject NgvDialogComponent into the root
   * @class NgvDialogComponent
   */
  private componentFactoryResolver = inject(ComponentFactoryResolver);
  private injector = inject(Injector);
  private factory: ComponentFactory<NgvDialogComponent>;
  /*--------------------------------------------------------------------------------------------------------------------------------------*/

  // after close observer
  private afterClose$: Subject<any> = new Subject();

  // list of custom elements that is open
  private componentsOpenedNameList: OpenedDialogModel[] = [];

  /**
   * ---------------------------------------------------------------------------------------------------------------------------------------
   * these two bridges help us to connect NgvDialogComponent
   * @property templateBridge$ closeBridge$
   * @class NgvDialogComponent
   */
  private templateBridge$: BehaviorSubject<TemplateCarrierType> = inject(NGV_DIALOG_TEMPLATE_TOKEN);
  private closeBridge$: Subject<void> = inject(NGV_DIALOG_CLOSE_TOKEN);
  /*--------------------------------------------------------------------------------------------------------------------------------------*/

  /**
   * ---------------------------------------------------------------------------------------------------------------------------------------
   * there is some stuffs that help us to open components automatically
   * @property routesConfig
   * contains routes config that have a list of routes and options that how to open that routes
   * @property transformedFragments
   * contains list of routes that we got it from routesConfig, we fill transformedFragments but in form of an object
   * so that we don't have to make redundant iteration
   */
  private routesConfig: NgvRoutesConfig = inject(NGV_DIALOG_ROUTES_BRIDGE_TOKEN);
  private route = inject(ActivatedRoute);
  private transformedFragments = {};

  /*--------------------------------------------------------------------------------------------------------------------------------------*/

  constructor() {
    /**
     * in NgvDialogComponent sometimes we need to close the sheet when backdrop clicked
     * we injected token to prevent circular injection
     */
    this.closeBridge$.subscribe(() => {
      this.close();
    });
    /*listening to routes if routes exists*/
    this.openAutomationByRoutes();
  }

  open(component: any, options: NgvDialogOptionModel = {backDropClose: true, backDropStyle: 'blur'}, byFragment = false): this {
    // make it empty , use case: when we have two dialog open and last dialog carrying last data options and components
    this.templateBridge$.next(null);
    // create basic of load dialog
    this.init(byFragment);
    // tell bridge what component u should load inside of dialog by what options
    this.templateBridge$.next({component, options});
    return this;
  }

  getData(): any {
    return this.templateBridge$.getValue().options.data;
  }

  afterClose(): Promise<any> {
    // because of that subject and observables able to send multiple values
    // we must use promise limit
    // so , don't use subject.asObservable
    return new Promise((resolve) => {
      this.afterClose$.subscribe(res => {
        resolve(res);
      });
    });
  }

  close(e?): void {
    const lastComponent = this.componentsOpenedNameList.pop();
    // tell user what's ur data after close
    this.afterClose$.next(e);
    // clear bridge
    this.templateBridge$.next(null);
    const el = document.getElementsByTagName(lastComponent.name)[0];
    // remove factory holder and dummy element
    el?.remove();
    this.factory = null;
    // here we check if dialog opened by fragment we will remove fragment
    if (lastComponent.byFragment) {
      this.removeFragment();
    }
  }

  private init(byFragment): void {
    const name = 'ngv-dialog-container-' + Math.floor(Math.random() * 100000);
    this.componentsOpenedNameList.push({name, byFragment});
    // make a dummy element.
    const el = document.createElement(name);
    // push dummy to body.
    document.body.appendChild(el);
    // create component that we want to inject it into the dummy then inject.
    this.factory = this.componentFactoryResolver.resolveComponentFactory(NgvDialogComponent);
    this.factory.create(this.injector, [], el);
  }

  private openAutomationByRoutes(): void {
    if (!this.routesConfig?.list.length) {
      return;
    }
    this.transformFragments();
    this.openSheetWhenFragmentMatches();
  }

  private transformFragments(): void {
    const defaultOption = {backDropClose: true, backDropStyle: 'blur', space: 16};
    const userConfig = this.routesConfig.options;
    this.routesConfig.list.map(route => {
      this.transformedFragments[route.fragment] = {
        component: route.component,
        option: {...defaultOption, ...userConfig}
      };
    });
  }

  private openSheetWhenFragmentMatches(): void {
    this.route.fragment.subscribe(fragment => {
      if (this.transformedFragments.hasOwnProperty(fragment)) {
        this.open(this.transformedFragments[fragment].component, this.transformedFragments[fragment].option, true);
      }
    });
  }

  removeFragment(): void {
    window.location.hash = '';
  }
}
