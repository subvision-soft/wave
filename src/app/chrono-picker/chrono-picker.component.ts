import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chrono-picker',
  templateUrl: './chrono-picker.component.html',
  styleUrls: ['./chrono-picker.component.scss'],
})
export class ChronoPickerComponent {
  _time: number = 0; // milliseconds

  open: boolean = false;

  constructor() {}

  get minutes(): number {
    return Math.floor(this._time / (60 * 1000)) % 60;
  }

  get seconds(): number {
    return Math.floor(this._time / 1000) % 60;
  }

  get centiseconds(): number {
    return Math.floor(this._time / 10) % 100;
  }

  set minutes(minutes: number) {
    this._time =
      minutes * 60 * 1000 + this.seconds * 1000 + this.centiseconds * 10;
  }

  set seconds(seconds: number) {
    this._time =
      this.minutes * 60 * 1000 + seconds * 1000 + this.centiseconds * 10;
  }

  set centiseconds(centiseconds: number) {
    this._time =
      this.minutes * 60 * 1000 + this.seconds * 1000 + centiseconds * 10;
  }

  @Input()
  set time(time: number) {
    this._time = time;
  }

  openChange(open: boolean) {
    this.open = open;
  }
}
