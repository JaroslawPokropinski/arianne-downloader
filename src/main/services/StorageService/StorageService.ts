import { app } from 'electron';
import { Service } from 'typedi';
import storage from 'electron-json-storage';
import { promisify } from 'util';
import type { DownloadingFile } from '../WebService/schema/DownloadingFile';

@Service()
export class StorageService {
  constructor() {
    storage.setDataPath(`${app.getPath('userData')}/data`);
  }

  async getFileArray() {
    return this.getFiles().then((files) => Object.values(files));
  }

  async getFiles() {
    return (promisify(storage.get)('files') ?? {}) as Promise<
      Record<string, DownloadingFile>
    >;
  }

  async addFile(file: DownloadingFile) {
    const files = await this.getFiles();
    files[file.id] = file;

    await promisify(storage.set)('files', files);
    return file;
  }

  async updateFiles(changes: ({ id: string } & Partial<DownloadingFile>)[]) {
    const files = await this.getFiles();
    changes.forEach((change) => {
      if (!files[change.id]) return;

      files[change.id] = { ...files[change.id], ...change };
    });
    await promisify(storage.set)('files', files);
  }
}
