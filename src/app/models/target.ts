import { Impact } from './impact';
import { Event } from './event';

export interface Target {
  impacts: Impact[];
  event: Event;
  total: number;
  time: number;
  date: Date;
  user: string;
  image: string;
  shotsTooCloseCount: number;
  badArrowExtractionsCount: number;
  targetSheetNotTouchedCount: number;
  departureSteal: boolean;
  armedBeforeCountdown: boolean;
  timeRanOut: boolean;
}
