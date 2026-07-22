import { FileUtils } from './FileUtils';

export class JsonUtils {
  public static parseJson<T>(jsonString: string): T {
    return JSON.parse(jsonString) as T;
  }

  public static stringifyJson(obj: any, pretty: boolean = true): string {
    return JSON.stringify(obj, null, pretty ? 2 : 0);
  }

  public static readJsonFile<T>(filePath: string): T {
    const content = FileUtils.readFile(filePath);
    return this.parseJson<T>(content);
  }

  public static writeJsonFile(filePath: string, obj: any, pretty: boolean = true): void {
    const content = this.stringifyJson(obj, pretty);
    FileUtils.writeFile(filePath, content);
  }
}
