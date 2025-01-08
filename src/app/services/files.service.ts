import { Injectable } from '@angular/core';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';
import { Session } from '../models/session';
import { HistoryService } from './history.service';
import { Target } from '../models/target';
import { ToastService, ToastTypes } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(
    private historyService: HistoryService,
    private toastService: ToastService
  ) {}

  private _session?: Session = undefined;

  private _target?: Target = undefined;

  public path: string = '';

  get session(): Session | undefined {
    return this._session;
  }

  loadSession(session: Session) {
    this._session = session;
  }

  set session(session: Session | undefined) {
    this._session = session;
    if (session) {
      this.updateSession();
    }
  }

  clearSession() {
    this._session = undefined;
    this.path = '';
  }

  get target(): Target | undefined {
    return this._target;
  }

  set target(target: Target | undefined) {
    this._target = target;
  }

  clearTarget() {
    this._target = undefined;
  }

  async updateSession() {
    await this.writeFile(this.path, JSON.stringify(this.session), true);
    this.toastService.initiate({
      title: 'Sauvegarde réussie',
      type: ToastTypes.SUCCESS,
      content: 'La session a été sauvegardée avec succès',
      duration: 1500,
      show: true,
    });
  }

  async loadFiles(path: string, files: FileInfo[] = []) {
    const result = await Filesystem.readdir({
      path: path,
      directory: Directory.Documents,
    });
    for (const file of result.files) {
      if (file.type === 'directory') {
        await this.loadFiles(path + '\\' + file.name, files);
      } else if (file.name.endsWith('.subapp')) {
        files.push(file);
      }
    }
    return files;
  }

  async loadDirectory(path: string, files: FileInfo[] = []) {
    const result = await Filesystem.readdir({
      path: path,
      directory: Directory.Documents,
    });
    for (const file of result.files) {
      if (file.type === 'file' && !file.name.endsWith('.subapp')) {
        break;
      }
      files.push(file);
    }
    return files;
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      await Filesystem.stat({
        path: fileName,
        directory: Directory.Documents,
      });
      return true;
    } catch (error) {
      if ((error as any).message.includes('does not exist')) {
        return false;
      }
      console.error('Error checking if file exists:', error);
      throw error;
    }
  }

  async writeFile(
    path: string,
    content: string,
    directoryInPath: boolean = false
  ) {
    await Filesystem.writeFile({
      path: path,
      data: btoa(content),
      recursive: true,
      directory: directoryInPath ? undefined : Directory.Documents,
    })
      .then(() => {})
      .catch(() => {});
  }

  async openFileByFile(file: FileInfo) {
    return await this.openFileByUrl(file.uri);
  }

  async openFileByUrl(url: string, saveInHistory?: boolean): Promise<Session> {
    const result = await Filesystem.readFile({
      path: url,
    });

    let parse: Session;
    if (typeof result.data === 'string') {
      parse = JSON.parse(atob(result.data));
    } else {
      parse = JSON.parse(await result.data.text());
    }
    if (saveInHistory) {
      this.historyService.addHistory(url);
    }
    return parse;
  }

  async deleteFile(file: FileInfo) {
    await Filesystem.deleteFile({
      path: file.uri,
      directory: Directory.Documents,
    });
  }
}
