import {TemplateRef} from '@angular/core';

export type OpenModalsParams = {
  title?: string;
  closeable?: boolean | OpenModalsCloseParams;
  content: string | TemplateRef<any> | string[];
  cancelLabel?: string;
  confirmLabel?: string;
  type?: 'yesno' | 'ok' | 'custom';
}

export type OpenModalsCloseParams = {
  closeButton?: boolean;
  maskClose?: boolean;
}
