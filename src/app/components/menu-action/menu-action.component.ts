import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { Action } from '../../models/action';

@Component({
  selector: 'app-menu-action',
  templateUrl: './menu-action.component.html',
  styleUrls: ['./menu-action.component.scss'],
})
export class MenuActionComponent {
  @Input() action: Action = new Action();
  @Input() @HostBinding('class.border') border: boolean = true;
  @Output() click: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @HostBinding('class.ripple') ripple: boolean = true;
}
