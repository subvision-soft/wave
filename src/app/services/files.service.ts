import { Injectable } from '@angular/core';
import { Directory, FileInfo, Filesystem } from '@capacitor/filesystem';

@Injectable({
  providedIn: 'root',
})
export class FilesService {
  constructor() {}

  async loadFiles(path: string, files: FileInfo[] = []) {
    const result = await Filesystem.readdir({
      path: path,
      directory: Directory.ExternalStorage,
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
      directory: Directory.ExternalStorage,
    });
    console.log(result.files);
    for (const file of result.files) {
      if (file.type === 'file' && !file.name.endsWith('.subapp')) {
        break;
      }
      files.push(file);
    }
    return files;
  }

  writeFile(path: string, content: Blob) {
    Filesystem.writeFile({
      path: path,
      data: content,
      directory: Directory.ExternalStorage,
      recursive: true,
    })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {});
  }

  async openFile(file: FileInfo) {
    const result = await Filesystem.readFile({
      path: file.uri,
    });
    if (typeof result.data === 'string') {
      return JSON.parse(result.data);
    }
    return JSON.parse(await result.data.text());
  }

  async deleteFile(file: FileInfo) {
    await Filesystem.deleteFile({
      path: file.uri,
      directory: Directory.ExternalStorage,
    });
  }
}
