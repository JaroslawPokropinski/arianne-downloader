import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';

export function getDefaultConfig() {
  return {
    '--auto-file-renaming': true,
    '--bt-load-saved-metadata': true,
    '--bt-save-metadata': true,
    '--continue': true,
    '--dht-listen-port': 26701,
    '--follow-metalink': true,
    '--follow-torrent': true,
    '--listen-port': 21301,
    '--max-concurrent-downloads': 5,
    '--max-connection-per-server': 64,
    '--max-download-limit': 0,
    '--max-overall-download-limit': 0,
    '--max-overall-upload-limit': '256K',
    '--min-split-size': '1M',
    '--pause': true,
    '--pause-metadata': false,
    '--seed-ratio': 1,
    '--seed-time': 60,
    '--split': 64,
    '--user-agent': 'Transmission/2.94',
  };
}

export async function fetchFileName(link: string, referrer: string) {
  return axios
    .head(link, {
      headers: {
        referer: referrer,
      },
    })
    .then((res) => res.headers)
    .then((headers) => {
      if (!headers['content-disposition']) return null;

      const regExpFilename = /filename="?(?<filename>([^"]|\\")+)"?/;

      return (
        regExpFilename.exec(headers['content-disposition'])?.groups?.filename ??
        null
      );
    })
    .catch(() => null);
}

export async function showInFolder(path: string) {
  if (process.platform === 'win32') {
    return promisify(exec)(`explorer.exe /select,"${path}"`).catch(
      () => null // there always will be an error so we ignore it
    );
  }

  throw new Error('not implemented');
}
