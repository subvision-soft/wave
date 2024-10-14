import { Pipe } from '@angular/core';
import { User } from '../models/user';

@Pipe({
  name: 'userLastnameFirstChar',
  standalone: true,
})
export class UserLastnameFirstCharPipe {
  transform(user: User): any {
    return user?.lastname ? user.lastname[0] + '.' : '';
  }
}
