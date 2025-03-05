import {ComponentRef} from '@angular/core';
import {ModalComponent} from '../modal.component';

export type Modal = {
  reference: ComponentRef<ModalComponent>;
  response: Promise<boolean>;
}
