import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { Action } from '../models/action';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  get originalActions(): Action[] {
    return this._originalActions;
  }

  set originalActions(value: Action[]) {
    console.log('set originalActions', value);
    this._originalActions = value;
  }

  get actions(): Action[] {
    return this._actions;
  }

  @Input()
  set actions(value: Action[]) {
    console.log('set actions', value);
    this._actions = value;
    this.originalActions = value;
    // this.currentActions = value;
  }

  get open(): boolean {
    return this._open;
  }

  @Input()
  set open(value: boolean) {
    console.log('set open', value);
    this._open = value;
    this.currentActions = value ? this._originalActions : this.currentActions;
  }

  @HostBinding('class.open') private _open: boolean = false;
  @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  private _actions: Action[] = [];

  currentActions: Action[] = [];

  private _originalActions: Action[] = [];

  constructor() {}

  close() {
    this.open = false;
    this.openChange.emit(this._open);
  }

  actionClick(action: Action) {
    if (action.actions) {
      this.currentActions = action.actions;
      return;
    }
    if (action.execute() === false) {
      return;
    }
    this.close();
  }
}
