import { User } from './user';
import { Team } from './team';
import {Target} from './target';

export interface Session {
  path: string;
  size: number
  date: Date;
  description: string;
  title: string;
  users: User[];
  teams: Team[];
  targets: Target[];
}
