import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface OpencvImshowData {
  image: any;
  title: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class OpencvImshowService {
  imageToShow: BehaviorSubject<OpencvImshowData | null> =
    new BehaviorSubject<OpencvImshowData | null>(null);

  constructor() {}

  showImage(image: any, title: string, id: string) {
    this.imageToShow.next({ image, title, id });
  }
}
