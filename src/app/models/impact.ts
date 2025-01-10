import { Zone } from './zone';

export interface Impact {
  id: number
  distance: number;
  score: number;
  zone: Zone;
  angle: number;
  amount: number;
}
