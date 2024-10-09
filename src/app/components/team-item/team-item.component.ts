import {Component, HostBinding, Input} from '@angular/core';
import {Team} from '../../models/team';
import {Session} from '../../models/session';
import {User} from '../../models/user';
import {RippleDirective} from '../../directives/ripple.directive';
import {UserLastnameFirstCharPipe} from "../../pipes/UserLastnameFirstCharPipe";
import {TagComponent} from "../tag/tag.component";
import {NgForOf, NgIf} from "@angular/common";
import {NgIcon} from "@ng-icons/core";

@Component({
  selector: 'app-team-item',
  templateUrl: './team-item.component.html',
  styleUrls: ['./team-item.component.scss'],
  hostDirectives: [RippleDirective],
  imports: [
    UserLastnameFirstCharPipe,
    TagComponent,
    NgIf,
    NgIcon,
    NgForOf
  ],
  standalone: true
})
export class TeamItemComponent {
  @Input() team: Team | undefined;

  @Input() session: Session | undefined;

  @HostBinding('class.selected') private _selected: boolean = false;
  get selected(): boolean {
    return this._selected;
  }

  @Input()
  set selected(value: boolean) {
    this._selected = value;
  }

  get users(): User[] {
    return (
      this.session?.users.filter((user) =>
        this.team?.users.includes(user.id)
      ) || []
    );
  }
}
