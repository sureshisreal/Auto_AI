import { Download } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { FilePaths } from '../../config/constants/FilePaths';

export class DownloadUtils {
  public static async saveDownload(download: Download, fileName?: string): Promise<string> {
    const targetPath = path.join(FilePaths.DOWNLOADS, fileName || download.suggestedFilename());
    await download.saveAs(targetPath);
    return targetPath;
  }

  public static verifyDownloadExists(filePath: string): boolean {
    return fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
  }

  public static getDownloadedFileSize(filePath: string): number {
    return fs.statSync(filePath).size;
  }
}
