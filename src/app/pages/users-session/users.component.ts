import {Component} from '@angular/core';
import {User} from '../../models/user';
import {Action} from '../../models/action';
import {Category} from '../../models/category';
import {Router} from '@angular/router';
import {SearchComponent} from '../../components/search/search.component';
import {HeaderComponent} from '../../components/header/header.component';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {AddButtonComponent} from '../../components/add-button/add-button.component';
import {EmptyTextComponent} from '../../components/empty-text/empty-text.component';
import {UserItemComponent} from '../../components/user-item/user-item.component';
import {LongPressDirective} from '../../directives/long-press.directive';
import {MessageBoxComponent} from '../../components/message-box/message-box.component';
import {UserService} from '../../services/user.services';
import {FilesService} from '../../services/files.service';
import {Session} from '../../models/session';
import {Team} from '../../models/team';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [
    SearchComponent,
    HeaderComponent,
    AddButtonComponent,
    EmptyTextComponent,
    UserItemComponent,
    NgIf,
    LongPressDirective,
    NgForOf,
    MessageBoxComponent,
    MatLabel,
    DatePipe,
    MatFormField,
    MatSelect,
    MatOption,
    FormsModule,

  ],
})
export class UsersSessionComponent {
  searchValue = '';
  openCreateUser = false;
  menuActions = [
    new Action(
      'Supprimer le tireur',
      undefined,
      () => {
        if (!confirm("Etes vous sur de vouloir supprimer \"" + this.selectedUsers[0].firstname + " " + this.selectedUsers[0].lastname + "\" ?")) {
          return;
        }
        for (const selectedUser of this.selectedUsers) {
          this.session.users = this.session.users.filter(user => user.id !== selectedUser.id)
        }
        this.filesService.updateSession()
        this.selectedUsers = [];
      },
      undefined,
      () => this.selectedUsers.length > 0
    ),
    new Action('Ajouter un tireur', undefined, () => {
      this.createUserButton();
    }),
  ];
  timeoutLongPress: Date = new Date();

  selectedUsers: User[] = [];
  session: Session;
  userToAdd: number[];

  constructor(private readonly filesService: FilesService, private readonly router: Router, private readonly userService: UserService) {
    this.session = this.filesService.session || new class implements Session {
      date: Date;
      description: string;
      teams: Team[];
      title: string;
      users: User[] = [];
      targets = [];
      path: '';
      size: 0
    }
  }

  newUser: User = {
    id: 0,
    label: '',
    firstname: '',
    lastname: '',
    category: Category.SENIOR,
  };

  createUserCallback(event: any) {
    if (event.btn === 'ok') {
      this.userToAdd.forEach((userId) => {
        const user = this.userService.get(userId);
        if (user) {
          this.session.users.push(user);
        }
      })
      this.filesService.updateSession()
      this.selectedUsers = [];
      this.openCreateUser = false;
    }
  }

  get users(): User[] {
    return this.session.users.filter((user: User) => {
      return this.searchValue === '' || user.id === Number(this.searchValue) || user.firstname.startsWith(this.searchValue) || user.lastname.startsWith(this.searchValue);
    });
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
      console.log('click')
      this.router.navigate(['/sessions/user'], {
        state: {user, session: this.session},
      });
    }
  }

  createUserButton() {
    this.openCreateUser = true;
  }

  usersSelect(): any[] {
    return this.userService.all().filter((user) => this.session.users.findIndex((u: User) => u.id === user.id) === -1);
  }
}
