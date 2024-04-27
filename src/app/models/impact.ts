import { Zone } from './zone';

export interface Impact {
  distance: number;
  score: number;
  zone: Zone;
  angle: number;
  amount: number;
}
