import {Injectable} from '@angular/core';
import {Directory, FileInfo, Filesystem} from '@capacitor/filesystem';
import {Session} from '../models/session';
import {HistoryService} from './history.service';
import {ToastService, ToastTypes} from './toast.service';
import {getSize} from '../utils/storage';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor(
    private historyService: HistoryService,
    private toastService: ToastService
  ) {
  }

  private _session?: Session = undefined;

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
  }

  async updateSession() {
    if (this.session) {
      this.session.size = getSize(JSON.stringify(this.session));
      for (const target of this.session.targets) {
        this.session.size += target.imageSize;
      }
    }

    await this.writeFile(this.session?.path, JSON.stringify(this.session));
    this.toastService.initiate({
      title: 'Sauvegarde réussie',
      type: ToastTypes.SUCCESS,
      content: 'La session a été sauvegardée avec succès',
      duration: 1500,
      show: true,
    });
  }

  private async loadFiles(path: string, files: FileInfo[] = []): Promise<FileInfo[]> {
    const result = await Filesystem.readdir({
      path: path,
      directory: Directory.Data,
    });
    for (const file of result.files) {
      if (file.type === 'directory' && file.name !== 'images') {
        await this.loadFiles(path + '\\' + file.name, files);
      } else if (file.name.endsWith('.subapp')) {
        files.push(file);
      }
    }
    return files;
  }

  async loadDirectory(path: string, files: FileInfo[] = []): Promise<FileInfo[]> {
    const result = await Filesystem.readdir({
      path: path,
      directory: Directory.Data,
    });
    for (const file of result.files) {
      if ((file.type === 'file' && !file.name.endsWith('.subapp')) || file.name === 'images') {
        continue;
      }
      files.push(file);
    }
    return files;
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      await Filesystem.stat({
        path: fileName,
        directory: Directory.Data,
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
    path: string | undefined,
    content: string,
    directoryInPath: boolean = false
  ) {
    if (path === undefined) {
      return;
    }
    await Filesystem.writeFile({
      path: path,
      data: btoa(content),
      recursive: true,
      directory: directoryInPath ? undefined : Directory.Data,
    })
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
      directory: Directory.Data,
    });
  }

  async getAllSessions(): Promise<Session[]> {
    const files = await this.loadFiles('');

    const sessions: Session[] = [];
    for (const file of files) {
      sessions.push(await this.openFileByFile(file));
    }

    return sessions.sort((sessionA: Session, sessionB) => (new Date(sessionA.date)).getTime() - (new Date(sessionB.date)).getTime());
  }

  async saveImage(base64: string, path: string) {
    try {
      await Filesystem.writeFile({
        path: `images${path}`,
        data: base64,
        directory: Directory.Data,
        recursive: true
      });
    } catch (error) {
      console.error('Error saving image:', error);
    }
  }

  async loadImage(path: string): Promise<string | null> {
    try {
      const file = await Filesystem.readFile({
        path: `images${path}`,
        directory: Directory.Data,
      });

      return `data:image/webp;base64,${file.data}`;
    } catch (error) {
      console.error('Error loading image:', error);
      return null;
    }
  }
}
