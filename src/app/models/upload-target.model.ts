import { Impact } from './impact';

export interface UploadTargetModel {
  time: number;
  date: Date;
  competitionId: number;
  userId: number;
  id: number;
  pictureBase64: number;
  impacts: Impact[];
}
