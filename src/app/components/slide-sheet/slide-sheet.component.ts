import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-slide-sheet',
  templateUrl: './slide-sheet.component.html',
  styleUrls: ['./slide-sheet.component.scss'],
})
export class SlideSheetComponent {
  @Input() @HostBinding('class.open') open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  close() {
    console.log('close');
    this.open = false;
    this.openChange.emit(this.open);
  }
}
