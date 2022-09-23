import { ComponentFactory, ComponentFactoryResolver, inject, Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgvDialogComponent } from '../components/ngv-dialog/ngv-dialog.component';
import { NGV_DIALOG_CLOSE_TOKEN, NGV_DIALOG_ROUTES_BRIDGE_TOKEN, NGV_DIALOG_TEMPLATE_TOKEN } from '../classes';
import { NgvDialogOptionModel, NgvRoutesConfig, OverlayModel, TemplateCarrierType } from '../models';

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
  componentFactoryResolver = inject(ComponentFactoryResolver);
  injector = inject(Injector);
  factory: ComponentFactory<NgvDialogComponent>;
  /*--------------------------------------------------------------------------------------------------------------------------------------*/

  // after close observer
  afterClose$: Subject<any> = new Subject();

  // list of custom elements that is open
  componentsOpenedNameList: string[] = [];

  /**
   * ---------------------------------------------------------------------------------------------------------------------------------------
   * these two bridges help us to connect NgvDialogComponent
   * @property templateBridge$ closeBridge$
   * @class NgvDialogComponent
   */
  templateBridge$: BehaviorSubject<TemplateCarrierType> = inject(NGV_DIALOG_TEMPLATE_TOKEN);
  closeBridge$: Subject<void> = inject(NGV_DIALOG_CLOSE_TOKEN);
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
  routesConfig: NgvRoutesConfig = inject(NGV_DIALOG_ROUTES_BRIDGE_TOKEN);
  router = inject(ActivatedRoute);
  transformedFragments = {};

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

  open(component: any, options: NgvDialogOptionModel = {backDropClose: true, backDropStyle: 'blur'}): this {
    // make it empty , use case: when we have two dialog open and last dialog carrying last data options and components
    this.templateBridge$.next(null);
    // create basic of load dialog
    this.init();
    // tell bridge what component u should load inside of dialog by what options
    this.templateBridge$.next({component, options});
    return this;
  }

  getData(): any {
    return this.templateBridge$.getValue().options.data;
  }

  afterClose(): Observable<any> {
    return this.afterClose$.asObservable();
  }

  close(e?): void {
    // tell user what's ur data after close
    this.afterClose$.next(e);
    // clear bridge
    this.templateBridge$.next(null);
    const el = document.getElementsByTagName(this.componentsOpenedNameList.pop())[0];
    // remove factory holder and dummy element
    el?.remove();
    this.factory = null;
  }

  init(): void {
    const name = 'ngv-dialog-container-' + Math.floor(Math.random() * 100000);
    this.componentsOpenedNameList.push(name);
    // make a dummy element.
    const el = document.createElement(name);
    // push dummy to body.
    document.body.appendChild(el);
    // create component that we want to inject it into the dummy then inject.
    this.factory = this.componentFactoryResolver.resolveComponentFactory(NgvDialogComponent);
    this.factory.create(this.injector, [], el);
  }

  openAutomationByRoutes(): void {
    if (!this.routesConfig?.list.length) {
      return;
    }
    this.transformFragments();
    this.openSheetWhenFragmentMatches();
  }

  transformFragments(): void {
    this.routesConfig.list.map(route => {
      this.transformedFragments[route.fragment] = route.component;
    });
  }

  openSheetWhenFragmentMatches(): void {
    this.router.fragment.subscribe(fragment => {
      if (this.transformedFragments.hasOwnProperty(fragment)) {
        this.open(this.transformedFragments[fragment]);
      }
    });
  }
}
