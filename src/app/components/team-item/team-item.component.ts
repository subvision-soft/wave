import {Component, HostBinding, Input} from '@angular/core';
import {Team} from "../../models/team";
import {Session} from "../../models/session";

@Component({
  selector: 'app-team-item',
  templateUrl: './team-item.component.html',
  styleUrls: ['./team-item.component.scss']
})
export class TeamItemComponent {

  @Input() team: Team | undefined;

  @Input() session: Session | undefined;

  @HostBinding('class') class = 'ripple';

  @HostBinding('class.selected') private _selected: boolean = false;
  get selected(): boolean {
    return this._selected;
  }

  @Input()
  set selected(value: boolean) {
    this._selected = value;
  }
}
