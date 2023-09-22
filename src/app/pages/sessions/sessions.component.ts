import {Component} from '@angular/core';
import {FilesService} from '../../services/files.service';
import {Directory, FileInfo, Filesystem} from '@capacitor/filesystem';
import {animate, style, transition, trigger} from '@angular/animations';
import {Action} from '../../models/action';

interface Session {
    active: boolean;
    file: FileInfo;
}

@Component({
    selector: 'app-sessions', templateUrl: './sessions.component.html', styleUrls: ['./sessions.component.scss'], animations: [trigger('enterAnimation', [transition(':enter', [style({opacity: 0}), animate('300ms', style({opacity: 1})),]), transition(':leave', [style({opacity: 1}), animate('300ms', style({opacity: 0})),]),]),],
})
export class SessionsComponent {
    get sortActions(): Action[] {
        return [new Action('Nom', this.getSortIcon('name'), (self) => {
            const sort = 'name';
            return this.sortAction(sort, self);
        }), new Action('Type', this.getSortIcon('type'), (self) => {
            const sort = 'type';
            return this.sortAction(sort, self);
        }), new Action('Taille', this.getSortIcon('size'), (self) => {
            const sort = 'size';
            return this.sortAction(sort, self);
        }), new Action('Date de modification', this.getSortIcon('date'), (self) => {
            const sort = 'date';
            return this.sortAction(sort, self);
        }),];

    }

    get sort(): 'name' | 'date' | 'size' | 'type' | undefined {
        return this._sort;
    }

    openCreateFolderPrompt: boolean = false;
    openCreateSession: boolean = true;

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

    private sortAction(sort: 'name' | 'date' | 'size' | 'type' | undefined, self: Action) {
        this.sort = sort;
        this.removeIcons();
        self.icon = this.getSortIcon(sort);
        return false;
    }

    get actions(): Action[] {
        return [new Action('Créer un nouveau dossier', '', () => {
            this.openCreateFolderPrompt = true;
        }),  this.selecting ? new Action('Supprimer', '', () => {
            const sessionsToDelete = this._sessions.filter((session) => session.active);
            new Promise(async (resolve) => {
                for (const session of sessionsToDelete) {
                    await Filesystem.deleteFile({
                        path: this.path + '/' + session.file.name, directory: Directory.ExternalStorage,
                    })
                }
                resolve(true);
            }).then(() => {
                this.openPath();
                this.initializeMenuActions()
            }
            )

        }) : new Action('Créer une nouvelle session', '', () => {
            this.openCreateSession = true;
        }),new Action('Trier par', '', () => {
        }, this.sortActions),];
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
            mtime: 0, size: 0, type: 'directory', uri: '', name: 'Dossier précédent',
        };
    }

    constructor(private filesService: FilesService) {
        this.openPath();
        this.initializeMenuActions();
    }

    private _sort: 'name' | 'date' | 'size' | 'type' | undefined = 'name';

    sortDirection: 'asc' | 'desc' = 'asc';

    timeoutLongPress: Date = new Date();

    onLongPress(event: any, session: Session) {
        session.active = true;
        console.log('long press', event);
        this.timeoutLongPress = new Date();
        this.initializeMenuActions()
    }


    get sessions(): Session[] {
        return this._sessions
            .filter((session) => session.file.name
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

    sessionClick(session: Session) {
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
                            active: false, file: file,
                        };
                    });
                })
                .catch((error) => {
                    this._path.pop();
                });
        }
    }

    openRoot() {
        this._path = [];
        this.openPath();
    }

    private openPath() {
        this.filesService.loadDirectory(this.path).then((files) => {
            console.log(files);
            this._sessions = files.map((file) => {
                return {
                    active: false, file: file,
                };
            });
        });
    }

    openAtIndexPath(index: number) {
        this._path = this._path.slice(0, index + 1);
        this.openPath();
    }

    searchValue: string = '';
    _sessions: Session[] = [];

    messageBoxCallback(event: any) {
        if (event.btn === 'ok') {
            Filesystem.mkdir({
                path: this.path + '/' + event.value, directory: Directory.ExternalStorage,
            })
                .then(() => {
                    this._path.push(event.value);
                    this.filesService.loadDirectory(this.path).then((files) => {
                        console.log(files);
                        this._sessions = files.map((file) => {
                            return {
                                active: false, file: file,
                            };
                        });
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }

    back() {
        this._path.pop();
        this.filesService.loadDirectory(this.path).then((files) => {
            console.log(files);
            this._sessions = files.map((file) => {
                return {
                    active: false, file: file,
                };
            });
        });
    }

    protected readonly console = console;
}
