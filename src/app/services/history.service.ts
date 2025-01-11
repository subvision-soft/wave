import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { SessionHistory } from '../models/session-history';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private _cacheHistory: SessionHistory[] = [];

  constructor() {
    try {
      this.loadHistory();
    } catch (err) {
      this._cacheHistory = [];
    }
  }

  get history(): SessionHistory[] {
    return this._cacheHistory;
  }

  loadHistory() {
    Filesystem.readFile({
      path: 'history.json',
      directory: Directory.Data,
    })
      .then(async (data) => {
        if (typeof data.data === 'string') {
          this._cacheHistory = JSON.parse(atob(data.data));
        } else {
          this._cacheHistory = JSON.parse(await data.data.text());
        }
      })
      .catch((err) => {});
  }

  addHistory(url: string) {
    this._cacheHistory = this._cacheHistory.filter(
      (history) => history.url !== url
    );
    this._cacheHistory.push({
      url: url,
      date: new Date(),
    });
    this.saveHistory();
  }

  removeHistory(url: string) {
    this._cacheHistory = this._cacheHistory.filter((history) => history.url !== url);
    this.saveHistory();
  }

  saveHistory() {
    console.log(this._cacheHistory);
    Filesystem.writeFile({
      path: 'history.json',
      data: btoa(JSON.stringify(this._cacheHistory)),
      directory: Directory.Data,
    });
  }
}
