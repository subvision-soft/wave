import {Component} from '@angular/core';
import {FilesService} from '../../services/files.service';
import {Directory, FileInfo, Filesystem} from '@capacitor/filesystem';
import {animate, style, transition, trigger} from '@angular/animations';
import {Action} from '../../models/action';
import {Session} from '../../models/session';
import {Router} from '@angular/router';
import {ToastService, ToastTypes} from '../../services/toast.service';
import {Target} from '../../models/target';
import {TranslateModule, TranslateService} from '@ngx-translate/core';
import {HeaderComponent} from '../../components/header/header.component';
import {SearchComponent} from '../../components/search/search.component';
import {AddButtonComponent} from '../../components/add-button/add-button.component';
import {TagComponent} from '../../components/tag/tag.component';
import {SessionItemComponent} from '../../components/session-item/session-item.component';
import {EmptyTextComponent} from '../../components/empty-text/empty-text.component';
import {LongPressDirective} from '../../directives/long-press.directive';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {RippleDirective} from '../../directives/ripple.directive';
import {MessageBoxComponent} from '../../components/message-box/message-box.component';
import {InputComponent} from '../../components/input/input.component';
import {SessionService} from '../../services/session.service';
import {File} from '../../models/file';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms', style({opacity: 1})),
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('300ms', style({opacity: 0})),
      ]),
    ]),
  ],
  standalone: true,
  imports: [
    HeaderComponent,
    SearchComponent,
    AddButtonComponent,
    TagComponent,
    SessionItemComponent,
    EmptyTextComponent,
    LongPressDirective,
    NgForOf,
    TranslateModule,
    NgIf,
    RippleDirective,
    MessageBoxComponent,
    InputComponent,
    DatePipe,
  ],
})
export class SessionsComponent {
  newSession: Session = {
    date: new Date(),
    description: '',
    title: '',
    users: [],
    teams: [],
    targets: [],
    path: '',
    size: 0
  };

  get sortActions(): Action[] {
    return [
      new Action(
        'SESSIONS.MENU.ORDER_BY.NAME',
        this.getSortIcon('name'),
        (self) => {
          const sort = 'name';
          return this.sortAction(sort, self);
        }
      ),
      new Action(
        'SESSIONS.MENU.ORDER_BY.TYPE',
        this.getSortIcon('type'),
        (self) => {
          const sort = 'type';
          return this.sortAction(sort, self);
        }
      ),
      new Action(
        'SESSIONS.MENU.ORDER_BY.SIZE',
        this.getSortIcon('size'),
        (self) => {
          const sort = 'size';
          return this.sortAction(sort, self);
        }
      ),
      new Action(
        'SESSIONS.MENU.ORDER_BY.MODIFICATION_DATE',
        this.getSortIcon('date'),
        (self) => {
          const sort = 'date';
          return this.sortAction(sort, self);
        }
      ),
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
      new Action('SESSIONS.MENU.NEW_FOLDER', '', () => {
        this.openCreateFolderPrompt = true;
      }),
      new Action(
        'SESSIONS.MENU.DELETE.TITLE',
        '',
        () => {
          if (!confirm('Etes vous sur de vouloir supprimer la selection ?')) {
            return;
          }
          const sessionsToDelete = this._sessions.filter(
            (session) => session.active
          );
          this.sessionService.remove(sessionsToDelete).then(() => {
            this.openPath();
            this.initializeMenuActions();
          })
        },
        undefined,
        () => {
          return this.selecting;
        }
      ),
      new Action(
        'SESSIONS.MENU.NEW_SESSION',
        '',
        () => {
          this.openCreateSession = true;
        },
        undefined,
        () => {
          return !this.selecting;
        }
      ),
      new Action(
        'SESSIONS.MENU.ORDER_BY.TITLE',
        '',
        () => {
        },
        this.sortActions
      ),
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
      name: this.translate.instant('SESSIONS.PREVIOUS_FOLDER'),
    };
  }

  protected target: Target | undefined;

  constructor(
    private filesService: FilesService,
    private router: Router,
    private toastService: ToastService,
    private translate: TranslateService,
    private readonly sessionService: SessionService,
  ) {
    this.openPath();
    this.initializeMenuActions();
    this.filesService.clearSession();
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
          this.router.navigate(['/sessions/users']).then((r) => console.log(r));
          return;
        });
      } else {
        this.filesService.openFileByUrl(file.uri, true).then((result) => {
          this.filesService.loadSession(result);
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
        directory: Directory.Data,
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
            title: 'SESSIONS.MESSAGES_BOX.NEW_FOLDER.TOAST.SUCCESS.TITLE',
            content: 'SESSIONS.MESSAGES_BOX.NEW_FOLDER.TOAST.SUCCESS.MESSAGE',
            type: ToastTypes.SUCCESS,
            show: true,
            duration: 2000,
          });
        })
        .catch((e) => {
          console.error(e)
          this.toastService.initiate({
            title: 'SESSIONS.MESSAGES_BOX.NEW_FOLDER.TOAST.ERROR.TITLE',
            content: 'SESSIONS.MESSAGES_BOX.NEW_FOLDER.TOAST.ERROR.MESSAGE',
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
    if (event.btn === 'ok' && this.isRequired(this.newSession.title) && this.isValidDate(this.newSession.date)) {
      let path = this.path + '/' + this.newSession.title.replace(/[^a-zA-Z0-9]/g, '') + '.subapp';

      if (await this.filesService.fileExists(path)) {
        path = path.replace('.subapp', Math.random().toString(16).slice(2) + '.subapp')
      }

      this.newSession.path = path;
      this.filesService
        .writeFile(
          path,
          JSON.stringify(this.newSession)
        )
        .then(() => {
          this.toastService.initiate({
            title:
              'SESSIONS.MESSAGES_BOX.NEW_SESSION.INPUTS.TOAST.SUCCESS.TITLE',
            content:
              'SESSIONS.MESSAGES_BOX.NEW_SESSION.INPUTS.TOAST.SUCCESS.MESSAGE',
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
            targets: [],
            path: '',
            size: 0
          };
        })
        .catch(() => {
          this.toastService.initiate({
            title: 'SESSIONS.MESSAGES_BOX.NEW_SESSION.INPUTS.TOAST.ERROR.TITLE',
            content:
              'SESSIONS.MESSAGES_BOX.NEW_SESSION.INPUTS.TOAST.ERROR.MESSAGE',
            type: ToastTypes.ERROR,
            show: true,
            duration: 2000,
          });
        });
      this.openCreateSession = false;
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

  isRequired(field: any): boolean {
    return field !== undefined && field !== null && field !== '';
  }

  isValidDate(inputDate: Date) {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return inputDate > date;
  }

  protected readonly console = console;
}
