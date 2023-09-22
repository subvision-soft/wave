import { Component, HostBinding, Input } from '@angular/core';
import { FileInfo } from '@capacitor/filesystem';
import { FilesService } from '../../services/files.service';
import { Session } from '../../models/session';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
})
export class SessionComponent {
  get file(): FileInfo | undefined {
    return this._file;
  }

  session: Session | undefined;

  @Input()
  set file(value: FileInfo | undefined) {
    if (value?.type === 'file') {
      this.filesService.openFile(value).then((result) => {
        this.session = result;
      });
    }
    this._file = value;
  }

  constructor(private filesService: FilesService) {}

  get selected(): boolean {
    return this._selected;
  }

  @Input()
  set selected(value: boolean) {
    console.log('selected', value);
    this._selected = value;
  }

  private _file: FileInfo | undefined;
  @Input() goBack: boolean = false;
  @HostBinding('class') class = 'ripple';

  @HostBinding('class.selected') private _selected: boolean = false;
  protected readonly console = console;
}
