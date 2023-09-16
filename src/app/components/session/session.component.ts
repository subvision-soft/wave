import { Component, HostBinding, Input } from '@angular/core';
import { FileInfo } from '@capacitor/filesystem';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent {
  get selected(): boolean {
    return this._selected;
  }

  @Input()
  set selected(value: boolean) {
    console.log('selected', value);
    this._selected = value;
  }

  @Input() file: FileInfo | undefined;
  @Input() goBack: boolean = false;
  @HostBinding('class') class = 'ripple';

  @HostBinding('class.selected') private _selected: boolean = false;
  protected readonly console = console;
}
