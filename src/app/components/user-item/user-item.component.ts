import { Component, HostBinding, Input } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.scss'],
})
export class UserItemComponent {
  @Input() user: User | undefined;

  @HostBinding('class') class = 'ripple';

  @HostBinding('class.selected') private _selected: boolean = false;
  get selected(): boolean {
    return this._selected;
  }

  @Input()
  set selected(value: boolean) {
    console.log('selected', value);
    this._selected = value;
  }
}
