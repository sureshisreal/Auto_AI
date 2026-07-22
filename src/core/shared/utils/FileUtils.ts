import * as fs from 'fs';
import * as path from 'path';

export class FileUtils {
  public static fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  public static readFile(filePath: string): string {
    return fs.readFileSync(filePath, 'utf-8');
  }

  public static writeFile(filePath: string, content: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content);
  }

  public static deleteFile(filePath: string): void {
    if (this.fileExists(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  public static getFileExtension(filePath: string): string {
    return path.extname(filePath);
  }

  public static getFileName(filePath: string): string {
    return path.basename(filePath);
  }
}
