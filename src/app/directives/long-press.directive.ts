import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({ selector: '[long-press]' })
export class LongPressDirective {
  @Input() duration: number = 300;

  @Output() onLongPress: EventEmitter<any> = new EventEmitter();
  @Output() onLongPressing: EventEmitter<any> = new EventEmitter();
  @Output() onLongPressEnd: EventEmitter<any> = new EventEmitter();

  private pressing: boolean = false;
  private longPressing: boolean = false;
  private timeout: any;
  private mouseX: number = 0;
  private mouseY: number = 0;

  @HostBinding('class.press')
  get press() {
    return this.pressing;
  }

  @HostBinding('class.longpress')
  get longPress() {
    return this.longPressing;
  }

  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart')
  onMouseDown(event: any) {
    // don't do right/middle clicks
    if (event && event?.which !== 1) return;
    console.log('mousedown', event);
    this.mouseX = event?.clientX;
    this.mouseY = event?.clientY;

    this.pressing = true;
    this.longPressing = false;

    this.timeout = setTimeout(() => {
      this.longPressing = true;
      this.onLongPress.emit(event);
      this.loop(event);
    }, this.duration);

    this.loop(event);
  }

  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onMouseMove(event: any) {
    console.log('mousemove', event);
    if (this.pressing && !this.longPressing) {
      const xThres = event.clientX - this.mouseX > 10;
      const yThres = event.clientY - this.mouseY > 10;
      if (xThres || yThres) {
        this.endPress();
      }
    }
  }

  loop(event: any) {
    if (this.longPressing) {
      this.timeout = setTimeout(() => {
        this.onLongPressing.emit(event);
        this.loop(event);
      }, 50);
    }
  }

  endPress() {
    clearTimeout(this.timeout);
    this.longPressing = false;
    this.pressing = false;
    this.onLongPressEnd.emit(true);
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  @HostListener('touchend')
  @HostListener('touchcancel')
  onMouseUp() {
    console.log('mouseup');
    this.endPress();
  }
}
