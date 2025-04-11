import {
  Component,
  EventEmitter,
  HostBinding,
  inject,
  Input,
  Output,
  signal,
  Signal,
  TemplateRef,
  viewChild,
  WritableSignal,
} from '@angular/core';
import {NgIcon} from '@ng-icons/core';
import {SlideSheetComponent} from '../slide-sheet/slide-sheet.component';
import {NumberSpinnerComponent} from '../number-spinner/number-spinner.component';
import {jamChronometer} from '@ng-icons/jam-icons';
import {Modal} from '../modal/type/Modal';
import {ModalService} from '../modal/service/modal.service';

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

  private modalContent: Signal<TemplateRef<any>> = viewChild<TemplateRef<any>>('modalContent');
  private modal: WritableSignal<Modal> = signal<Modal>(null);
  private modalService: ModalService = inject(ModalService)

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
    if (!open && this.modal()) {
      this.modalService.close(this.modal())
    } else if (open) {
      this.modal.set(this.modalService.open({
        content: this.modalContent(),
        closeable: {
          maskClose: true,
        },
        type: 'custom',
      }));
    }
  }

  protected readonly jamChronometer = jamChronometer;
}
