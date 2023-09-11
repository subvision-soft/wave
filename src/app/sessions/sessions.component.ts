import { Component } from '@angular/core';
import { FilesService } from '../services/files.service';
import { FileInfo } from '@capacitor/filesystem';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('300ms', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SessionsComponent {
  _path: string[] = [];

  get path(): string {
    return this._path.join('/');
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

  constructor(private filesService: FilesService) {
    this.filesService.loadDirectory(this.path).then((files) => {
      console.log(files);
      this._sessions = files;
    });
  }

  get sessions(): any[] {
    return this._sessions.filter(
      (session) =>
        session.name.toLowerCase().includes(this.searchValue.toLowerCase())
      // ||
      // session.description
      //   .toLowerCase()
      //   .includes(this.searchValue.toLowerCase())
    );
  }

  open(file: FileInfo) {
    if (file.type === 'directory') {
      this._path.push(file.name);
      this.filesService
        .loadDirectory(this.path)
        .then((files) => {
          console.log(files);
          this._sessions = files;
        })
        .catch((error) => {
          this._path.pop();
        });
    }
  }

  searchValue: string = '';
  _sessions: FileInfo[] = [];

  back() {
    this._path.pop();
    this.filesService.loadDirectory(this.path).then((files) => {
      console.log(files);
      this._sessions = files;
    });
  }
}
