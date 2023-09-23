import { Target } from '@angular/compiler';
import { User } from './user';
import { Team } from './team';

export interface Session {
  date: Date;
  description: string;
  title: string;
  targets: Target[];
  users: User[];
  teams: Team[];
}
