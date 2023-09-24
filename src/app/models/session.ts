import { User } from './user';
import { Team } from './team';

export interface Session {
  date: Date;
  description: string;
  title: string;
  users: User[];
  teams: Team[];
}
