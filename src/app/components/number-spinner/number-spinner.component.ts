import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-number-spinner',
  templateUrl: './number-spinner.component.html',
  styleUrls: ['./number-spinner.component.scss'],
  standalone: true,
  imports: [NgIf, NgForOf],
})
export class NumberSpinnerComponent {
  @ViewChild('container') container: ElementRef | undefined;

  _min: number = 0;
  _max: number = 10;
  @Input() step: number = 1;
  values: number[] = [];
  _value: number = 0;
  @Output() valueChange = new EventEmitter<number>();
  @Input() title?: string = undefined;
  private dragging: boolean = false;
  startY: number = 0;
  endY: number = 0;
  currentValue: number = 0;
  positionY: number = 0;
  lastPositionY: number = 0;
  lastPositionYDate: Date = new Date();
  speed: number = 0;

  @Input()
  set value(value: number) {
    if (value < this._min) {
      value = this._min;
    }
    if (value > this._max) {
      value = this._max;
    }
    this._value = value;
    this.valueChange.emit(this._value);
  }

  get value(): number {
    return this._value;
  }

  @Input()
  set max(max: number) {
    this._max = max;
    this.values = Array.from(
      { length: (this._max - this._min + 1) / this.step },
      (v, k) => k * this.step
    );
  }

  @Input()
  set min(min: number) {
    this._min = min;
    this.values = Array.from(
      { length: (this._max - this._min + 1) / this.step },
      (v, k) => k * this.step
    );
  }

  constructor() {
    this.values = Array.from(
      { length: (this._max - this._min + 1) / this.step },
      (v, k) => k * this.step
    );
  }

  onMouseDown(event: any): void {
    if (event.type === 'touchstart') {
      event.clientY = event.touches[0].clientY;
    }
    this.currentValue = this._value;
    this.valueChange.emit(this._value);

    this.dragging = true;
    this.startY = event.clientY;
  }

  onMouseUp(event: any): void {
    if (event.type === 'touchend') {
      event.clientY = event.changedTouches[0].clientY;
    }
    this.dragging = false;
    this.endY = event.clientY;
    const time = new Date().setTime(new Date().getTime() + 1000);

    const scope = this;

    function momentum(speed: number) {
      return new Promise((resolve, reject) => {
        if (
          time < new Date().getTime() ||
          speed === 0 ||
          [scope._min, scope._max].includes(scope._value)
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
      event.clientY = event.touches[0].clientY;
    }
    if (this.dragging) {
      this.speed =
        (event.clientY - this.lastPositionY) /
        (new Date().getTime() - this.lastPositionYDate.getTime());
      this.lastPositionY = event.clientY;
      this.lastPositionYDate = new Date();
      if (!isFinite(this.speed)) {
        this.speed = 0;
      }
      const offsetHeight = this.container?.nativeElement.offsetHeight / 3;
      const indexAdd = (event.clientY - this.startY) / offsetHeight;
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
        navigator.vibrate(200);
      }
    }
  }
}
