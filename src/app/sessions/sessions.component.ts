import { Component } from '@angular/core';
import { FilesService } from '../services/files.service';
import { FileInfo } from '@capacitor/filesystem';
import { animate, style, transition, trigger } from '@angular/animations';
import { Action } from '../models/action';

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
  get sort(): 'name' | 'date' | 'size' | 'type' | undefined {
    return this._sort;
  }

  openCreateFolderPrompt: boolean = false;

  set sort(value: 'name' | 'date' | 'size' | 'type' | undefined) {
    if (this._sort === value) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this._sort = value;
      this.sortDirection = 'asc';
    }
  }

  _path: string[] = [];

  removeIcons() {
    this.sortActions.forEach((action) => {
      action.icon = '';
    });
  }

  menuActions: Action[] = [];
  sortActions = [
    new Action('Nom', this.getSortIcon('name'), (self) => {
      const sort = 'name';
      return this.sortAction(sort, self);
    }),
    new Action('Type', this.getSortIcon('type'), (self) => {
      const sort = 'type';
      return this.sortAction(sort, self);
    }),
    new Action('Taille', this.getSortIcon('size'), (self) => {
      const sort = 'size';
      return this.sortAction(sort, self);
    }),
    new Action('Date de modification', this.getSortIcon('date'), (self) => {
      const sort = 'date';
      return this.sortAction(sort, self);
    }),
  ];

  private sortAction(
    sort: 'name' | 'date' | 'size' | 'type' | undefined,
    self: Action
  ) {
    this.sort = sort;
    this.removeIcons();
    self.icon = this.getSortIcon(sort);
    return false;
  }

  initializeMenuActions() {
    this.menuActions = [
      new Action('Créer un nouveau dossier', '', () => {
        this.openCreateFolderPrompt = true;
      }),
      new Action('Trier par', '', () => {}, this.sortActions),
    ];
  }

  getSortIcon(sort: 'name' | 'date' | 'size' | 'type' | undefined): string {
    if (this._sort === sort) {
      return this.sortDirection === 'asc' ? 'jamArrowUp' : 'jamArrowDown';
    }
    return '';
  }

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
    this.initializeMenuActions();
  }

  private _sort: 'name' | 'date' | 'size' | 'type' | undefined = 'name';

  sortDirection: 'asc' | 'desc' = 'asc';

  get sessions(): any[] {
    return this._sessions
      .filter(
        (session) =>
          session.name.toLowerCase().includes(this.searchValue.toLowerCase())

        // ||
        // session.description
        //   .toLowerCase()
        //   .includes(this.searchValue.toLowerCase())
      )
      .sort((a, b) => {
        switch (this.sort) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'date':
            return a.mtime - b.mtime;
          case 'size':
            return a.size - b.size;
          case 'type':
            return a.type.localeCompare(b.type);
          default:
            return 0;
        }
      });
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
