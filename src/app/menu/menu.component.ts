import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { Action } from '../models/action';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() @HostBinding('class.open') open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() actions: Action[] = [];

  constructor() {}

  close() {
    this.open = false;
    this.openChange.emit(this.open);
  }
}
