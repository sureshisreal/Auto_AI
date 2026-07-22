import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

export class UploadUtils {
  /** Generates a temp file of arbitrary size/content for upload-flow tests. */
  public static createTempFile(fileName: string, content = 'sample upload content', sizeInBytes?: number): string {
    const filePath = path.join(os.tmpdir(), fileName);
    const body = sizeInBytes ? content.repeat(Math.ceil(sizeInBytes / content.length)).slice(0, sizeInBytes) : content;
    fs.writeFileSync(filePath, body);
    return filePath;
  }

  public static cleanupTempFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}
