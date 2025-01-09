import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  standalone: true,
  imports: [NgIf, NgForOf],
})
export class SpinnerComponent {
  @ViewChild('container') container: ElementRef | undefined;
  @Input() step: number = 1;
  @Input() values: number[] = [];
  _value: number = -1;
  @Output() valueChange = new EventEmitter<number>();
  @Input() title?: string = undefined;
  private dragging: boolean = false;
  startX: number = 0;
  endX: number = 0;
  currentValue: number = -1;
  positionX: number = 0;
  lastPositionX: number = 0;
  lastPositionXDate: Date = new Date();
  speed: number = 0;

  @Input()
  set value(value: number) {
    this._value = value;
    this.valueChange.emit(this._value);
  }

  get value(): number {
    return this._value;
  }

  constructor() {
  }

  onMouseDown(event: any): void {
    if (event.type === 'touchstart') {
      event.clientX = event.touches[0].clientX;
    }
    this.currentValue = this._value;
    this.valueChange.emit(this._value);

    this.dragging = true;
    this.startX = event.clientX;
  }

  onMouseUp(event: any): void {
    if (event.type === 'touchend') {
      event.clientX = event.changedTouches[0].clientX;
    }
    this.dragging = false;
    this.endX = event.clientX;
    const time = new Date().setTime(new Date().getTime() + 1000);

    const scope = this;

    function momentum(speed: number) {
      return new Promise((resolve) => {
        if (
          time < new Date().getTime() ||
          speed === 0 ||
          [0, scope.values.length - 1].includes(scope._value)
        ) {
          resolve(true);
        } else {
          if (speed > 0) {
            scope._value = scope._value - 1;

            speed = speed - 1;
          } else {
            scope._value = scope._value + 1;
            speed = speed + 1;
          }
          scope.valueChange.emit(scope._value);

          setTimeout(async () => {
            await momentum(speed);
            resolve(true);
          }, 200 / Math.abs(speed));
        }
      });
    }

    momentum(Math.round(this.speed) * 2).then(() => {
      this.speed = 0;
    });
  }

  onMouseMove(event: any): void {
    if (event.type === 'touchmove') {
      event.clientX = event.touches[0].clientX;
    }

    if (!this.dragging) {
      return;
    }

    this.speed =
      (event.clientX - this.lastPositionX) /
      (new Date().getTime() - this.lastPositionXDate.getTime());
    this.lastPositionX = event.clientX;
    this.lastPositionXDate = new Date();
    if (!isFinite(this.speed)) {
      this.speed = 0;
    }
    const offsetWidth = this.container?.nativeElement.offsetWidth / 3;
    const indexAdd = (event.clientX - this.startX) / offsetWidth;
    let index = indexAdd + this.currentValue * -1;
    if (index * -1 < 0) {
      index = 0;
    }
    if (index * -1 > this.values.length - 1) {
      index = (this.values.length - 1) * -1;
    }
    index = Math.round(index);

    if (this._value !== index * -1) {
      this._value = index * -1;
      this.valueChange.emit(this._value);
      // navigator.vibrate(200);
    }
  }
}
