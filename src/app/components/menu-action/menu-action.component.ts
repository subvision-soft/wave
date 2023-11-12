import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { Action } from '../../models/action';
import { RippleDirective } from '../../directives/ripple.directive';

@Component({
  selector: 'app-menu-action',
  templateUrl: './menu-action.component.html',
  styleUrls: ['./menu-action.component.scss'],
  hostDirectives: [RippleDirective],
})
export class MenuActionComponent {
  @Input() action: Action = new Action();
  @Input() @HostBinding('class.border') border: boolean = true;
  @Output() click: EventEmitter<boolean> = new EventEmitter<boolean>();
}
