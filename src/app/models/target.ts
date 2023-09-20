import { Impact } from './impact';

interface Target {
  user: User;
  impacts: Impact[];
  event: Event;
  total: number;
  time: number;
  date: Date;
}
