import { Component, HostBinding, Input } from '@angular/core';
import { Session } from '../../models/session';
import { Target } from '../../models/target';
import { User } from '../../models/user';
import { RippleDirective } from '../../directives/ripple.directive';
import { TagComponent } from '../tag/tag.component';
import { NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-target-item',
  templateUrl: './target-item.component.html',
  styleUrls: ['./target-item.component.scss'],
  hostDirectives: [RippleDirective],
  standalone: true,
  imports: [TagComponent, NgIf, NgIcon],
})
export class TargetItemComponent {
  @Input() target: Target | undefined;

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
