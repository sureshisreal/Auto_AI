import AdmZip from 'adm-zip';
import * as path from 'path';
import { FileUtils } from './FileUtils';

export class ZipUtils {
  public static zipDirectory(sourceDir: string, outputZipPath: string): void {
    const zip = new AdmZip();
    zip.addLocalFolder(sourceDir);
    const dir = path.dirname(outputZipPath);
    if (!FileUtils.fileExists(dir)) {
      FileUtils.writeFile(path.join(dir, '.gitkeep'), '');
    }
    zip.writeZip(outputZipPath);
  }

  public static zipFile(filePath: string, outputZipPath: string): void {
    const zip = new AdmZip();
    zip.addLocalFile(filePath);
    zip.writeZip(outputZipPath);
  }

  public static unzip(zipFilePath: string, outputDir: string): void {
    const zip = new AdmZip(zipFilePath);
    zip.extractAllTo(outputDir, true);
  }

  public static listEntries(zipFilePath: string): string[] {
    const zip = new AdmZip(zipFilePath);
    return zip.getEntries().map((entry) => entry.entryName);
  }
}
