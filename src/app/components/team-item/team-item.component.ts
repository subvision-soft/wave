import { Component, HostBinding, Input } from '@angular/core';
import { Team } from '../../models/team';
import { Session } from '../../models/session';
import { User } from '../../models/user';
import { RippleDirective } from '../../directives/ripple.directive';
import { NgForOf, NgIf } from '@angular/common';
import { TagComponent } from '../tag/tag.component';
import { NgIcon } from '@ng-icons/core';
import { UserLastnameFirstCharPipe } from '../../pipes/UserLastnameFirstCharPipe';

@Component({
  selector: 'app-team-item',
  templateUrl: './team-item.component.html',
  styleUrls: ['./team-item.component.scss'],
  hostDirectives: [RippleDirective],
  standalone: true,
  imports: [NgIf, TagComponent, NgIcon, UserLastnameFirstCharPipe, NgForOf],
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
      this.session?.users.filter((user: User) =>
        this.team?.users.includes(user.id)
      ) || []
    );
  }
}
