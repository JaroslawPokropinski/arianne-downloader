/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import { app } from 'electron';
import log from 'electron-log';

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function handleError(error: Error | unknown) {
  if (error instanceof Error) {
    return log.error(error.message);
  }

  if (typeof error === 'object') {
    return log.error((error ?? 'null').toString());
  }

  return log.error('unknown error');
}

export function getRootPath() {
  const appPath = app.getAppPath();
  if (appPath.endsWith('app')) {
    return path.resolve(path.join(appPath, '..'));
  }
  return appPath;
}
