import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Target} from '../../models/target';
import {Router} from '@angular/router';
import {User} from '../../models/user';
import {TargetItemComponent} from "../target-item/target-item.component";
import {NgForOf, NgIf} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {LongPressDirective} from "../../directives/long-press.directive";
import {EmptyTextComponent} from "../empty-text/empty-text.component";

@Component({
  selector: 'app-list-targets',
  templateUrl: './list-targets.component.html',
  styleUrls: ['./list-targets.component.scss'],
  imports: [
    TargetItemComponent,
    NgIf,
    TranslateModule,
    LongPressDirective,
    NgForOf,
    EmptyTextComponent
  ],
  standalone: true
})
export class ListTargetsComponent {
  @Input() targets: Target[] = [];
  @Input() users: User[] = [];
  @Input() emptyText: string = 'TARGETS.NOTHING_SAVED';
  @Input() emptyIcon: string = 'jamGhost';
  private _timeoutLongPress: Date = new Date();

  private _selectedTargets: Target[] = [];
  @Output() selectedTargetsChange: EventEmitter<Target[]> = new EventEmitter<
    Target[]
  >();

  get selectedTargets(): Target[] {
    return this._selectedTargets;
  }

  @Input()
  set selectedTargets(value: Target[]) {
    this._selectedTargets = value;
    this.selectedTargetsChange.emit(value);
  }

  constructor(private _router: Router) {
  }

  isTargetSelected(target: Target): boolean {
    return this._selectedTargets.includes(target);
  }

  onLongPress(event: any, target: Target) {
    this._timeoutLongPress = new Date();
    if (this.isTargetSelected(target)) return;
    this._selectedTargets.push(target);
  }

  getUserById(userId: string) {
    return this.users.find((u) => u.id === userId);
  }

  targetClick(target: Target) {
    if (new Date().getTime() - this._timeoutLongPress.getTime() < 500) return;
    if (this._selectedTargets.length > 0) {
      if (this.isTargetSelected(target)) {
        this._selectedTargets = this._selectedTargets.filter(
          (u) => u !== target
        );
      } else {
        this._selectedTargets.push(target);
      }
    } else {
      // Ouvrir page target
      this._router.navigate(['/camera/result'], {
        state: {target},
      });
    }
  }
}
