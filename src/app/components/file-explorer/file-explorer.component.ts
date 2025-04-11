import { Component, EventEmitter, Output } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { FileInfo } from '@capacitor/filesystem';
import { Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { EmptyTextComponent } from '../empty-text/empty-text.component';
import { SessionItemComponent } from '../session-item/session-item.component';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss'],

  standalone: true,
  imports: [EmptyTextComponent, SessionItemComponent, NgForOf, NgIf],
})
export class FileExplorerComponent {
  constructor(private filesService: FilesService, private router: Router) {
    this.openPath();
    this.filesService.clearSession();
  }

  @Output() pathChange = new EventEmitter<string[]>();

  get path(): string[] {
    return this._path;
  }

  set path(value: string[]) {
    this._path = value;
    this.pathChange.emit(value);
  }

  private _path: string[] = [];

  get pathString(): string {
    return this._path.join('/');
  }

  sessions: FileInfo[] = [];

  openRoot() {
    this._path = [];
    this.openPath();
  }

  openAtIndexPath(index: number) {
    this._path = this._path.slice(0, index + 1);
    this.openPath();
  }

  get returnFile(): FileInfo {
    return {
      mtime: 0,
      size: 0,
      type: 'directory',
      uri: '',
      name: 'Dossier précédent',
    };
  }

  open(file: FileInfo) {
    if (file.type === 'directory') {
      this._path.push(file.name);
      this.filesService
        .loadDirectory(this.pathString)
        .then((files) => {
          console.log(files);
          this.sessions = files;
        })
        .catch(() => {
          this._path.pop();
        });
    }
  }

  back() {
    this._path.pop();
    this.filesService.loadDirectory(this.pathString).then((files) => {
      this.sessions = files;
    });
  }

  private openPath() {
    this.filesService.loadDirectory(this.pathString).then((files) => {
      this.sessions = files;
    });
  }
}
