import {Component, inject} from '@angular/core';
import {User} from '../../models/user';
import {Action} from '../../models/action';
import {Category} from '../../models/category';
import {Router} from '@angular/router';
import {SearchComponent} from '../../components/search/search.component';
import {HeaderComponent} from '../../components/header/header.component';
import {NgForOf, NgIf} from '@angular/common';
import {AddButtonComponent} from '../../components/add-button/add-button.component';
import {EmptyTextComponent} from '../../components/empty-text/empty-text.component';
import {UserItemComponent} from '../../components/user-item/user-item.component';
import {LongPressDirective} from '../../directives/long-press.directive';
import {MessageBoxComponent} from '../../components/message-box/message-box.component';
import {InputComponent} from '../../components/input/input.component';
import {SelectComponent} from '../../components/select/select.component';
import {UserService} from '../../services/user.services';
import {ModalService} from '../../components/modal/service/modal.service';

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
    InputComponent,
    SelectComponent,
  ],
})
export class UsersComponent {
  create: boolean = true;
  searchValue = '';
  openCreateUser = false;
  private modalService: ModalService = inject(ModalService);
  menuActions = [
    new Action(
      'Supprimer le tireur',
      undefined,
      () => {
        this.modalService.open({
          title: 'Supprimer la sélection ?',
          content: 'Êtes-vous sur de vouloir supprimer la sélection ?',
          type: 'yesno',
          closeable: true,
        }).response.then((response) => {
            if (response) {
              for (const selectedUser of this.selectedUsers) {
                this.userService.delete(selectedUser.id)
              }
              this.selectedUsers = [];
            }
          }
        );
      },
      undefined,
      () => this.selectedUsers.length > 0
    ),
    new Action(
      'Modifier le tireur',
      undefined,
      () => {
        this.openCreateUser = true;
        this.newUser = this.selectedUsers[0];
        this.create = false;
      },
      undefined,
      () => {
        return this.selectedUsers.length == 1;
      }
    ),
    new Action('Ajouter un tireur', undefined, () => {
      this.createUserButton();
    }),
  ];
  timeoutLongPress: Date = new Date();

  selectedUsers: User[] = [];

  constructor(private readonly router: Router, private readonly userService: UserService) {
  }

  storeCategories = [
    {id: Category.MINIME, label: 'Minime'},
    {id: Category.CADET, label: 'Cadet'},
    {id: Category.JUNIOR, label: 'Junior'},
    {id: Category.SENIOR, label: 'Sénior'},
    {id: Category.MASTER, label: 'Master'},
  ];

  newUser: User = {
    id: 0,
    label: '',
    firstname: '',
    lastname: '',
    category: Category.SENIOR,
  };

  createUserCallback(event: any) {
    if (event.btn === 'ok' && this.isRequired(this.newUser.id) && this.isRequired(this.newUser.firstname) && this.isRequired(this.newUser.lastname) && (!this.create || (this.create && !this.alreadyExist()))) {
      if (this.create) {
        this.userService.create(this.newUser);
      } else {
        this.userService.update(this.newUser);
      }
      this.selectedUsers = [];
      this.openCreateUser = false;
    }
  }

  get users(): User[] {
    return this.userService.all().filter((user: User) => {
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
      this.router.navigate(['/sessions/user'], {
        state: {user},
      });
    }
  }

  createUserButton() {
    this.openCreateUser = true;
    this.create = true;
    this.newUser = {
      id: 0,
      label: '',
      firstname: '',
      lastname: '',
      category: Category.SENIOR,
    };
  }

  isRequired(field: any): boolean {
    return field !== undefined && field !== null && field !== '';
  }

  alreadyExist(): boolean {
    return this.userService.exists(this.newUser.id);
  }
}
