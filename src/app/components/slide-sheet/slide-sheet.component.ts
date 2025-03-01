import {Component, EventEmitter, HostBinding, Input, Output,} from '@angular/core';
import {ContainerComponent} from '../container/container.component';

@Component({
  selector: 'app-slide-sheet',
  templateUrl: './slide-sheet.component.html',
  styleUrls: ['./slide-sheet.component.scss'],
  standalone: true,
  imports: [
    ContainerComponent
  ]
})
export class SlideSheetComponent {
  @Input() @HostBinding('class.open') open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
  }

  close() {
    this.open = false;
    this.openChange.emit(this.open);
  }
}
