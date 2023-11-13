import { Component, HostBinding, Input } from '@angular/core';
import { User } from '../../models/user';
import { Session } from '../../models/session';
import { RippleDirective } from '../../directives/ripple.directive';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
  hostDirectives: [RippleDirective],
})
export class UserItemComponent {
  @Input() user: User | undefined;

  @Input() session: Session | undefined;

  @HostBinding('class.selected') private _selected: boolean = false;
  get selected(): boolean {
    return this._selected;
  }

  @Input()
  set selected(value: boolean) {
    this._selected = value;
  }
}
