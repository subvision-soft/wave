import {Component, EventEmitter, HostBinding, Input, Output,} from '@angular/core';
import {NgIcon} from '@ng-icons/core';
import {SlideSheetComponent} from '../slide-sheet/slide-sheet.component';
import {NumberSpinnerComponent} from '../number-spinner/number-spinner.component';
import {jamChronometer} from '@ng-icons/jam-icons';

@Component({
  selector: 'app-chrono-picker',
  templateUrl: './chrono-picker.component.html',
  styleUrls: ['./chrono-picker.component.scss'],
  standalone: true,
  imports: [NgIcon, SlideSheetComponent, NumberSpinnerComponent],
})
export class ChronoPickerComponent {
  _time: number = 0; // milliseconds
  @Input() @HostBinding('class.compact') compact: boolean = false;

  @Output() timeChange = new EventEmitter<number>();
  open: boolean = false;

  constructor() {
  }

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
    this.timeChange.emit(this._time);
  }

  set seconds(seconds: number) {
    this._time =
      this.minutes * 60 * 1000 + seconds * 1000 + this.centiseconds * 10;
    this.timeChange.emit(this._time);
  }

  set centiseconds(centiseconds: number) {
    this._time =
      this.minutes * 60 * 1000 + this.seconds * 1000 + centiseconds * 10;
    this.timeChange.emit(this._time);
  }

  @Input()
  set time(time: number) {
    this._time = time;
  }

  openChange(open: boolean) {
    this.open = open;
  }

  protected readonly jamChronometer = jamChronometer;
}
