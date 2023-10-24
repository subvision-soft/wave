import { Component } from '@angular/core';
import { Session } from '../../models/session';
import { User } from '../../models/user';
import { Action } from '../../models/action';
import { Category } from '../../models/category';
import { FilesService } from '../../services/files.service';
import { Target } from '../../models/target';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  set target(value: Target | undefined) {
    this._target = value;
  }

  get target(): Target | undefined {
    return this._target;
  }

  searchValue = '';
  openCreateUser = false;
  menuActions = [
    new Action(
      'Supprimer le tireur',
      undefined,
      () => {
        this.session.users = this.session.users.filter(
          (user) => !this.selectedUsers.includes(user)
        );
        this.filesService.session = this.session;
        this.selectedUsers = [];
      },
      undefined,
      () => this.selectedUsers.length > 0
    ),
    new Action(
      'Modifier le tireur',
      undefined,
      (self) => {},
      undefined,
      () => {
        console.log(this.selectedUsers);
        return this.selectedUsers.length == 1;
      }
    ),
    new Action('Ajouter un tireur', undefined, (self) => {
      this.openCreateUser = true;
    }),
  ];
  timeoutLongPress: Date = new Date();

  selectedUsers: User[] = [];

  session: Session = {
    title: 'Rennes',
    description: 'Description 1',
    date: new Date(),
    users: [
      {
        id: '1',
        firstname: 'Tireur',
        lastname: '1',
        category: Category.SENIOR,
        targets: [],
      },
      {
        id: '2',
        firstname: 'Tireur',
        lastname: '2',
        category: Category.SENIOR,
        targets: [],
      },
    ],
    teams: [],
  };
  private _target: Target | undefined;

  constructor(private filesService: FilesService, private router: Router) {
    this.session = this.filesService.session || this.session;
    this._target = this.filesService.target;
  }

  storeCategories = [
    { id: Category.MINIME, label: 'Minime' },
    { id: Category.CADET, label: 'Cadet' },
    { id: Category.JUNIOR, label: 'Junior' },
    { id: Category.SENIOR, label: 'Sénior' },
    { id: Category.MASTER, label: 'Master' },
  ];

  newUser: User = {
    id: '',
    firstname: '',
    lastname: '',
    category: Category.SENIOR,
    targets: [],
  };

  createUserCallback(event: any) {
    if (event.btn === 'ok') {
      this.session.users.push({ ...this.newUser });
      this.filesService.session = this.session;
    }
  }

  get users(): User[] {
    return this.session.users.filter(
      (user) =>
        user.firstname.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        user.lastname.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        user.id.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  isUserSelected(user: User): boolean {
    return this.selectedUsers.includes(user);
  }

  onLongPress(event: any, user: User) {
    this.timeoutLongPress = new Date();
    if (this.isUserSelected(user)) return;
    this.selectedUsers.push(user);
  }

  userClick(user: User) {
    if (new Date().getTime() - this.timeoutLongPress.getTime() < 500) return;
    if (this.selectedUsers.length > 0) {
      if (this.isUserSelected(user)) {
        this.selectedUsers = this.selectedUsers.filter((u) => u !== user);
      } else {
        this.selectedUsers.push(user);
      }
    } else {
      // Ouvrir page user
      if (this.target) {
        this.target = { ...this.target, user: user.id };
        this.session.users = this.session.users.map((u) => {
          if (u === user) {
            if (this.target) {
              u.targets.push(this.target);
            }
          }
          return u;
        });
        this.filesService.session = this.session;
        this.filesService.clearTarget();
        this.filesService.clearSession();
        this.router.navigate(['/camera']);
      }
    }
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}
