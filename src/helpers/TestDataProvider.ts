import * as path from 'path';
import { JsonUtils } from '../utils/JsonUtils';
import { CSVUtils } from '../utils/CSVUtils';
import { ExcelUtils } from '../utils/ExcelUtils';
import { FilePaths } from '../constants/FilePaths';

/**
 * Loads test data fixtures from src/testdata/ by file name, so tests never
 * hardcode data inline. Supports JSON, CSV, and Excel per the spec's
 * "never hardcode test data" requirement.
 */
export class TestDataProvider {
  public static loadJson<T>(fileName: string): T {
    return JsonUtils.readJsonFile<T>(path.join(FilePaths.TESTDATA, fileName));
  }

  public static loadCsv<T = Record<string, string>>(fileName: string): T[] {
    return CSVUtils.readCSV<T>(path.join(FilePaths.TESTDATA, fileName));
  }

  public static async loadExcel<T = Record<string, unknown>>(fileName: string, sheetName?: string): Promise<T[]> {
    return ExcelUtils.readExcel<T>(path.join(FilePaths.TESTDATA, fileName), sheetName);
  }
}
