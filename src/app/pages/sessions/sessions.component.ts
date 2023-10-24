import { Component } from '@angular/core';
import { FilesService } from '../../services/files.service';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { animate, style, transition, trigger } from '@angular/animations';
import { Action } from '../../models/action';
import { Session } from '../../models/session';
import { Router } from '@angular/router';
import { ToastService, ToastTypes } from '../../services/toast.service';
import { Target } from '../../models/target';

interface File {
  active: boolean;
  file: FileInfo;
}

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
  newSession: Session = {
    date: new Date(),
    description: '',
    title: '',
    users: [],
    teams: [],
  };

  get sortActions(): Action[] {
    return [
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
  }

  get sort(): 'name' | 'date' | 'size' | 'type' | undefined {
    return this._sort;
  }

  openCreateFolderPrompt: boolean = false;
  openCreateSession: boolean = false;

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

  private sortAction(
    sort: 'name' | 'date' | 'size' | 'type' | undefined,
    self: Action
  ) {
    this.sort = sort;
    this.removeIcons();
    self.icon = this.getSortIcon(sort);
    return false;
  }

  get actions(): Action[] {
    return [
      new Action('Créer un nouveau dossier', '', () => {
        this.openCreateFolderPrompt = true;
      }),
      new Action(
        'Supprimer',
        '',
        () => {
          const sessionsToDelete = this._sessions.filter(
            (session) => session.active
          );
          new Promise(async (resolve, reject) => {
            for (const session of sessionsToDelete) {
              try {
                await Filesystem.deleteFile({
                  path: this.path + '/' + session.file.name,
                  directory: Directory.ExternalStorage,
                });
              } catch (error) {
                reject(error);
              }
            }
            resolve(true);
          })
            .then(() => {
              this.openPath();
              this.initializeMenuActions();
              this.toastService.initiate({
                title: 'Contenu supprimé',
                content: 'Le contenu a été supprimé avec succès',
                type: ToastTypes.SUCCESS,
                show: true,
                duration: 2000,
              });
            })
            .catch(() => {
              this.toastService.initiate({
                title: 'Erreur',
                content: 'Une erreur est survenue',
                type: ToastTypes.ERROR,
                show: true,
                duration: 2000,
              });
            });
        },
        undefined,
        () => {
          return this.selecting;
        }
      ),
      new Action(
        'Créer une nouvelle session',
        '',
        () => {
          this.openCreateSession = true;
        },
        undefined,
        () => {
          return !this.selecting;
        }
      ),
      new Action('Trier par', '', () => {}, this.sortActions),
    ];
  }

  initializeMenuActions() {
    this.menuActions = this.actions;
  }

  get selecting(): boolean {
    return this._sessions.filter((session) => session.active).length > 0;
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

  protected target: Target | undefined;

  constructor(
    private filesService: FilesService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.openPath();
    this.initializeMenuActions();
    this.filesService.clearSession();
    this.target = this.filesService.target;
  }

  private _sort: 'name' | 'date' | 'size' | 'type' | undefined = 'name';

  sortDirection: 'asc' | 'desc' = 'asc';

  timeoutLongPress: Date = new Date();

  onLongPress(event: any, session: File) {
    session.active = true;
    this.timeoutLongPress = new Date();
    this.initializeMenuActions();
  }

  get sessions(): File[] {
    return this._sessions
      .filter(
        (session) =>
          session.file.name
            .toLowerCase()
            .includes(this.searchValue.toLowerCase())

        // ||
        // session.description
        //   .toLowerCase()
        //   .includes(this.searchValue.toLowerCase())
      )
      .sort((a, b) => {
        const fileA = a.file;
        const fileB = b.file;
        switch (this.sort) {
          case 'name':
            const nameA = fileA.name;
            const nameB = fileB.name;
            if (this.sortDirection === 'desc') {
              return nameB.localeCompare(nameA);
            }
            return nameA.localeCompare(nameB);
          case 'date':
            const mtimeB = fileB.mtime;
            const mtimeA = fileA.mtime;
            if (this.sortDirection === 'desc') {
              return mtimeB - mtimeA;
            }
            return mtimeA - mtimeB;
          case 'size':
            const sizeA = fileA.size;
            const sizeB = fileB.size;
            if (this.sortDirection === 'desc') {
              return sizeB - sizeA;
            }
            return sizeA - sizeB;
          case 'type':
            const typeB = fileB.type;
            const typeA = fileA.type;
            if (this.sortDirection === 'desc') {
              return typeB.localeCompare(typeA);
            }
            return typeA.localeCompare(typeB);
          default:
            return 0;
        }
      });
  }

  sessionClick(session: File) {
    if (new Date().getTime() - this.timeoutLongPress.getTime() < 500) return;
    if (this.sessions.filter((session) => session.active).length > 0) {
      session.active = !session.active;
    } else {
      this.open(session.file);
    }
  }

  open(file: FileInfo) {
    if (file.type === 'directory') {
      this._path.push(file.name);
      this.filesService
        .loadDirectory(this.path)
        .then((files) => {
          console.log(files);
          this._sessions = files.map((file) => {
            return {
              active: false,
              file: file,
            };
          });
        })
        .catch(() => {
          this._path.pop();
        });
    } else {
      if (this.target) {
        this.filesService.openFileByUrl(file.uri, true).then((result) => {
          this.filesService.loadSession(result);
          this.filesService.path = file.uri;
          this.router.navigate(['/sessions/users']).then((r) => console.log(r));
          return;
        });
      } else {
        this.filesService.openFileByUrl(file.uri, true).then((result) => {
          this.filesService.loadSession(result);
          this.filesService.path = file.uri;
          this.router.navigate(['/sessions/session'], {
            queryParams: {
              url: file.uri,
            },
          });
        });
      }
    }
  }

  openRoot() {
    this._path = [];
    this.openPath();
  }

  private openPath() {
    this.filesService.loadDirectory(this.path).then((files) => {
      this._sessions = files.map((file) => {
        return {
          active: false,
          file: file,
        };
      });
    });
  }

  openAtIndexPath(index: number) {
    this._path = this._path.slice(0, index + 1);
    this.openPath();
  }

  searchValue: string = '';
  _sessions: File[] = [];

  messageBoxCallback(event: any) {
    if (event.btn === 'ok') {
      Filesystem.mkdir({
        path: this.path + '/' + event.value,
        directory: Directory.ExternalStorage,
      })
        .then(() => {
          this.filesService.loadDirectory(this.path).then((files) => {
            this._sessions = files.map((file) => {
              return {
                active: false,
                file: file,
              };
            });
          });
          this.toastService.initiate({
            title: 'Dossier créé',
            content: 'Le dossier a été créé avec succès',
            type: ToastTypes.SUCCESS,
            show: true,
            duration: 2000,
          });
        })
        .catch(() => {
          this.toastService.initiate({
            title: 'Erreur',
            content: 'Une erreur est survenue',
            type: ToastTypes.ERROR,
            show: true,
            duration: 2000,
          });
        });
    }
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  async createSessionCallback(event: any) {
    if (event.btn === 'ok') {
      this.filesService
        .writeFile(
          this.path +
            '/' +
            this.newSession.title.replace(/[^a-zA-Z0-9]/g, '') +
            '.subapp',
          JSON.stringify(this.newSession)
        )
        .then(() => {
          this.toastService.initiate({
            title: 'Session créée',
            content: 'La session a été créée avec succès',
            type: ToastTypes.SUCCESS,
            show: true,
            duration: 2000,
          });
          this.openPath();
          this.openCreateSession = false;
          this.newSession = {
            date: new Date(),
            description: '',
            title: '',
            users: [],
            teams: [],
          };
        })
        .catch(() => {
          this.toastService.initiate({
            title: 'Erreur',
            content: 'Une erreur est survenue',
            type: ToastTypes.ERROR,
            show: true,
            duration: 2000,
          });
        });
    }
  }

  back() {
    this._path.pop();
    this.filesService.loadDirectory(this.path).then((files) => {
      this._sessions = files.map((file) => {
        return {
          active: false,
          file: file,
        };
      });
    });
  }

  protected readonly console = console;
}
