import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import type { GestureDetail } from '@ionic/angular';
import { GestureController } from '@ionic/angular';

@Component({
  selector: 'app-swiper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swiper.component.html',
  styleUrl: './swiper.component.scss',
})
export class SwiperComponent {
  set childNumber(value: number) {
    this._childNumber = value;
  }

  private _childNumber: number = 0;

  protected tempIndex = 0;

  get index(): number {
    return this._index;
  }

  set index(value: number) {
    this._index = value;
  }

  private _index = 0;
  x = 0;
  currentX = 0;
  private _container: ElementRef | undefined;

  @ViewChild('container', { read: ElementRef, static: true }) set container(
    value: ElementRef | undefined
  ) {
    this._container = value;
    this.childNumber = this._container?.nativeElement.children.length;
  }

  get container() {
    return this._container;
  }

  get containerWidth() {
    return this.container?.nativeElement.clientWidth;
  }

  get childNumber() {
    return this._childNumber;
  }

  constructor(
    private el: ElementRef,
    private gestureCtrl: GestureController,
    private cdRef: ChangeDetectorRef
  ) {}

  get indexArray() {
    return new Array(this.childNumber).fill(0).map((_, i) => i);
  }

  ngAfterViewInit() {
    const gesture = this.gestureCtrl.create({
      el: this.el.nativeElement,
      onStart: () => this.onStart(),
      onMove: (detail: GestureDetail) => this.onMove(detail),
      onEnd: () => this.onEnd(),
      gestureName: 'example',
    });

    gesture.enable();
  }

  private onStart() {
    this.cdRef.detectChanges();
  }

  nextMove: number = 0;

  private onMove(detail: GestureDetail) {
    const { deltaX, velocityX } = detail;
    this.nextMove = 0;

    const velocityLimit = 1.5;
    const lengthLimit = this.containerWidth / 4;
    if (deltaX > 0 && this._index !== 0) {
      this.nextMove =
        deltaX > lengthLimit || velocityX > velocityLimit ? -1 : 0;
    } else if (deltaX < 0 && this._index !== this.childNumber - 1) {
      this.nextMove =
        -deltaX > lengthLimit || velocityX < -velocityLimit ? 1 : 0;
    }

    this.tempIndex = this._index + this.nextMove;
    this.currentX = deltaX;

    if (this.container && this.nextMove !== 0) {
      this.container.nativeElement.style.transform = `translateX(${
        this.x + deltaX
      }px)`;
    }
  }

  private onEnd() {
    this.cdRef.detectChanges();
    this.index += this.nextMove;
    this.tempIndex = this.index;

    this.nextMove = 0;
    this.x = this._index * -this.containerWidth;
    if (this.container) {
      this.container.nativeElement.style.transform = `translateX(${this.x}px)`;
    }
  }

  onClicked(index: number) {
    this.index = index;
    this.tempIndex = index;
    this.x = this._index * -this.containerWidth;
    if (this.container) {
      this.container.nativeElement.style.transform = `translateX(${this.x}px)`;
    }
  }

  isActive(index: number) {
    return index === this.tempIndex;
  }
}
