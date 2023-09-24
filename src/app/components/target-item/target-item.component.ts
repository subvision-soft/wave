import { Component, HostBinding, Input } from '@angular/core';
import { Session } from '../../models/session';
import { Target } from '../../models/target';
import { User } from '../../models/user';

@Component({
  selector: 'app-target-item',
  templateUrl: './target-item.component.html',
  styleUrls: ['./target-item.component.scss'],
})
export class TargetItemComponent {
  @Input() target: Target | undefined;

  @Input() user: User | undefined;

  @Input() session: Session | undefined;

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
