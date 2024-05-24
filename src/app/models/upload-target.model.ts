import { Impact } from './impact';

export interface UploadTargetModel {
  time: number;
  date: Date;
  competitionId: number;
  competitorId: number;
  id: number;
  pictureBase64: number;
  impacts: Impact[];
}
