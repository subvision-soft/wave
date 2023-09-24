import { Impact } from './impact';
import { Event } from './event';

export interface Target {
  impacts: Impact[];
  event: Event;
  total: number;
  time: number;
  date: Date;
  user: string;
}
