import { Component, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  OpencvImshowData,
  OpencvImshowService,
} from '../../services/opencv-imshow.service';
import { NgxOpenCVService } from '../../../lib/ngx-open-cv.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-opencv-imshow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opencv-imshow.component.html',
  styleUrl: './opencv-imshow.component.scss',
})
export class OpencvImshowComponent implements OnDestroy {
  ids: Set<string> = new Set();
  @ViewChild('container') container: any;

  subscriptions: Subscription[] = [];

  cv: any;

  constructor(
    private OpenCVImshowService: OpencvImshowService,
    private ngxOpenCVService: NgxOpenCVService
  ) {
    this.subscriptions.push(
      this.ngxOpenCVService.cvState.subscribe((state) => {
        if (state.ready) {
          // @ts-ignore
          this.cv = window['cv'];
          this.subscriptions.push(
            this.OpenCVImshowService.imageToShow.subscribe((data) => {
              if (data) {
                this.addCanvas(data);
              }
            })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  addCanvas(data: OpencvImshowData) {
    const image = data.image;
    if (this.ids.has(data.id)) {
      console.log('already exists');
      this.cv.imshow(data.id, image);
      return;
    }
    this.ids.add(data.id);
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 300;
    canvas.id = data.id;
    const div = document.createElement('div');
    const label = document.createElement('label');
    label.innerHTML = data.title;
    div.appendChild(label);
    div.appendChild(canvas);
    div.classList.add('opencv-imshow');
    this.container.nativeElement.appendChild(div);
    const clone = image.clone();

    this.cv.resize(clone, clone, new this.cv.Size(300, 300));
    this.cv.imshow(canvas.id, clone);
    clone.delete();
  }
}
