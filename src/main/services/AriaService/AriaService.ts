import { ChildProcess, spawn } from 'child_process';
import { app } from 'electron';
import { existsSync } from 'fs';
import { Service } from 'typedi';
import Aria2 from 'aria2';
import ws from 'ws';
import path, { basename } from 'path';
import { getAppPath, handleError } from '../../util';
import { FileInput } from '../WebService/schema/FileInput';
import type { DownloadingFile } from '../WebService/schema/DownloadingFile';
import {
  fetchFileName,
  getDefaultConfig,
  showInFolder,
} from './ariaServiceUtils';
import { Download } from './ariaTypes';
import { StorageService } from '../StorageService';

@Service()
export class AriaService {
  private instance: ChildProcess | null = null;

  private client?: Aria2;

  constructor(private storageService: StorageService) {
    this.start().catch(handleError);
  }

  async download(fileData: FileInput): Promise<DownloadingFile> {
    const pageUrl = new URL(fileData.pageUrl);
    const referrer = `${pageUrl.origin}${pageUrl.pathname}`;

    const fetchedFileName = await fetchFileName(fileData.linkUrl, referrer);
    const dir = app.getPath('downloads');

    const gid = await this.client?.call('addUri', [fileData.linkUrl], {
      dir: app.getPath('downloads'),
      out: fetchedFileName,
      referer: referrer,
      'auto-file-renaming': true,
    });
    const status: Download = await this.client?.call('tellStatus', gid);

    const fileName =
      fetchedFileName || basename(status.files[0].path) || 'noname';

    return this.storageService.addFile({
      id: status.gid,
      name: fileName,
      path: path.join(dir, fileName),
      createdDate: Date.now(),
      status: status.status,
      size: status.totalLength,
      downloadedSize: 0,
    });
  }

  async getFiles(): Promise<DownloadingFile[]> {
    return this.storageService.getFileArray();
  }

  async pause(): Promise<DownloadingFile> {
    throw new Error('implement me');
  }

  async resume(): Promise<DownloadingFile> {
    throw new Error('implement me');
  }

  async cancel(): Promise<DownloadingFile> {
    throw new Error('implement me');
  }

  async retry(): Promise<DownloadingFile> {
    throw new Error('implement me');
  }

  async showInFolder(fileId: string): Promise<DownloadingFile> {
    const file = (await this.storageService.getFiles())[fileId];
    if (!file) throw Error('No file by such id');

    await showInFolder(file.path);
    return file;
  }

  private async start() {
    this.instance = spawn(
      `${getAppPath(false)}/extra/aria2/aria2c.exe`,
      this.buildArgs(),
      {
        stdio: 'inherit',
      }
    );

    this.client = new Aria2({
      WebSocket: ws,
      port: 16800,
      secret: 'kmsDFOiFPh4U',
    });

    await this.client.open();

    setInterval(() => {
      this.fetchFiles().catch(handleError);
    }, 1000);
  }

  private async fetchFiles() {
    const ariaDownloads: Download[] = await this.client
      ?.multicall([
        ['aria2.tellActive'],
        ['aria2.tellWaiting', 0, 20],
        ['tellStopped', 0, 20],
      ])
      .then((data) => data.flat().flat());

    const downloads = ariaDownloads.map((downl) => ({
      id: downl.gid,
      name: basename(downl.files[0].path),
      size: downl.totalLength,
      downloadedSize: downl.completedLength,
      status: downl.status,
    }));

    this.storageService.updateFiles(downloads);
  }

  private buildArgs() {
    const sessionPath = `${app.getPath('userData')}/download.session`;
    const argsObj = {
      '--conf-path': `${app.getAppPath()}/extra/aria2/aria2.conf`,
      '--save-session': sessionPath,
      '--input-file': existsSync(sessionPath) ? sessionPath : null,
      '--rpc-listen-port': 16800,
      '--rpc-secret': 'kmsDFOiFPh4U',
      ...getDefaultConfig(),
    };

    return Object.entries(argsObj)
      .filter(([, val]) => val !== null)
      .map(([key, val]) => `${key}=${val}`);
  }
}
