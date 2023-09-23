import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum ToastTypes {
  ERROR,
  SUCCESS,
  INFO,
  WARNING,
}

export interface ToastData {
  title: string;
  content: string;
  show?: boolean;
  type?: ToastTypes;
  duration: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  data: ToastData = {
    title: '',
    content: '',
    show: false,
    type: ToastTypes.SUCCESS,
    duration: 1500,
  };
  public open = new Subject<ToastData>();

  initiate(data: ToastData) {
    this.data = { ...this.data, ...data };
    this.open.next(this.data);
  }

  hide() {
    this.data = { ...this.data, show: false };
    this.open.next(this.data);
  }
}
