import {ApplicationRef, ComponentRef, createComponent, inject, Injectable} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {Modal} from '../type/Modal';
import {OpenModalsParams} from '../type/OpenModalsParams';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private applicationRef: ApplicationRef = inject(ApplicationRef);

  closeByRef(ref: ComponentRef<ModalComponent>) {
    ref.instance.open.set(false);
    console.log('closeByRef', ref.instance.open());
    setTimeout(() => {
      this.applicationRef.detachView(ref.hostView);
      ref.destroy();
    }, ref.instance.animationDuration - 50);
  }

  close(modal: Modal) {
    this.closeByRef(modal.reference);
  }

  open(params: OpenModalsParams): Modal {
    const modalHost = document.createElement('div');
    document.body.append(modalHost);
    const modalRef = createComponent(ModalComponent, {
      hostElement: modalHost,
      environmentInjector: this.applicationRef.injector,
    });
    const instance = modalRef.instance;
    instance.params.set(params);
    this.applicationRef.attachView(modalRef.hostView);
    return {
      reference: modalRef,
      response: new Promise((resolve, reject) => {
        instance.onClose.subscribe((value) => {
          this.closeByRef(modalRef);
          resolve(value);
        });
        instance.onDismiss.subscribe(() => {
          this.closeByRef(modalRef);
          reject(new Error('dismissed'));
        });
      })
    };
  }
}
