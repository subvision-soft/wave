import { Target } from '@angular/compiler';
import { User } from './user';

export interface Session {
  date: Date;
  description: string;
  title: string;
  targets: Target[];
  users: User[];
}
