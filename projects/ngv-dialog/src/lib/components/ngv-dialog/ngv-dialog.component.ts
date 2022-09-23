import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Subject, Subscription } from 'rxjs';
import { NGV_DIALOG_TEMPLATE_TOKEN ,NGV_DIALOG_CLOSE_TOKEN } from '../../classes';
import { TemplateCarrierType , NgvDialogOptionModel } from '../../models';

@Component({
  selector: 'ngv-dialog',
  templateUrl: './ngv-dialog.component.html',
  styleUrls: ['./ngv-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgvDialogComponent {
  subscription: Subscription;
  changeDetectorRef = inject(ChangeDetectorRef);
  templateBridge$: BehaviorSubject<TemplateCarrierType> = inject(NGV_DIALOG_TEMPLATE_TOKEN);
  closeBridge$: Subject<void> = inject(NGV_DIALOG_CLOSE_TOKEN);
  @ViewChild('container', {static: true, read: ViewContainerRef}) container: ViewContainerRef;

  options: NgvDialogOptionModel = {
    backDropStyle: 'blur',
    backDropClose: true,
    space: 16
  };

  constructor() {
    this.subscription = this.templateBridge$.subscribe((res) => {
      if (res) {
        this.options = {...this.options, ...res.options};
        this.createComponent(res.component);
      }
    });
  }

  backDropClick(): void {
    if (this.options.backDropClose) {
      this.closeBridge$.next();
    }
  }

  createComponent(component: any): void {
    this.container.createComponent(component);
    this.changeDetectorRef.detectChanges();
    this.subscription.unsubscribe();
  }
}
