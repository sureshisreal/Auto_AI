import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import { FileUtils } from './FileUtils';

export class CSVUtils {
  public static readCSV<T = Record<string, string>>(filePath: string): T[] {
    const content = FileUtils.readFile(filePath);
    return parse(content, { columns: true, skip_empty_lines: true, trim: true }) as T[];
  }

  public static writeCSV<T extends Record<string, unknown>>(filePath: string, rows: T[]): void {
    const content = stringify(rows, { header: true });
    FileUtils.writeFile(filePath, content);
  }
}
