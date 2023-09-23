import { Component } from '@angular/core';
import { Session } from '../../models/session';
import { User } from '../../models/user';
import { Action } from '../../models/action';
import { Category } from '../../models/category';
import { FilesService } from '../../services/files.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  searchValue = '';
  openCreateUser = true;
  menuActions = [
    new Action('Supprimer', undefined, (self) => {}),
    new Action('Modifier', undefined, (self) => {}),
  ];
  timeoutLongPress: Date = new Date();

  selectedUsers: User[] = [];

  session: Session = {
    title: 'Rennes',
    description: 'Description 1',
    date: new Date(),
    targets: [],
    users: [],
    teams: [],
  };

  constructor(private filesService: FilesService) {
    this.session = this.filesService.session || this.session;
  }

  storeCategories = [
    { id: Category.MINIME, label: 'Minime' },
    { id: Category.CADET, label: 'Cadet' },
    { id: Category.JUNIOR, label: 'Junior' },
    { id: Category.SENIOR, label: 'Senior' },
    { id: Category.MASTER, label: 'Master' },
  ];

  newUser: User = {
    id: '',
    name: '',
    category: Category.SENIOR,
  };

  createUserCallback: (event: any) => void = () => {};

  get users(): User[] {
    return this.session.users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
        user.id.toLowerCase().includes(this.searchValue.toLowerCase())
    );
  }

  isUserSelected(user: User): boolean {
    return this.selectedUsers.includes(user);
  }

  onLongPress(event: any, user: User) {
    this.selectedUsers.push(user);
    this.timeoutLongPress = new Date();
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
    }
  }

  parseDate(dateString: string): Date {
    return new Date(dateString);
  }
}
