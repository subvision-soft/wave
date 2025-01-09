import {Injectable} from '@angular/core';
import {Filesystem} from '@capacitor/filesystem';
import {ToastService, ToastTypes} from './toast.service';
import {File} from '../models/file';
import {HistoryService} from './history.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {

  constructor(private readonly toastService: ToastService, private readonly historyService: HistoryService) {
  }

  remove(sessions: File[]): Promise<void> {
    return new Promise(async (resolve, reject) => {
      for (const session of sessions) {
        try {
          await Filesystem.deleteFile({
            path: session.file.uri,
          });
          this.historyService.removeHistory(session.file.uri)
        } catch (error) {
          reject(error);
        }
      }
      resolve(true);
    })
      .then(() => {
        this.toastService.initiate({
          title: 'SESSIONS.MENU.DELETE.TOAST.SUCCESS.TITLE',
          content: 'SESSIONS.MENU.DELETE.TOAST.SUCCESS.MESSAGE',
          type: ToastTypes.SUCCESS,
          show: true,
          duration: 2000,
        });
      })
      .catch((e) => {
        console.error(e)
        this.toastService.initiate({
          title: 'SESSIONS.MENU.DELETE.TOAST.ERROR.TITLE',
          content: 'SESSIONS.MENU.DELETE.TOAST.ERROR.MESSAGE',
          type: ToastTypes.ERROR,
          show: true,
          duration: 2000,
        });
      });
  }
}
