import { Workbook } from 'exceljs';
import * as path from 'path';
import { FileUtils } from './FileUtils';

export class ExcelUtils {
  public static async readExcel<T = Record<string, unknown>>(filePath: string, sheetName?: string): Promise<T[]> {
    const workbook = new Workbook();
    await workbook.xlsx.readFile(filePath);
    const worksheet = sheetName ? workbook.getWorksheet(sheetName) : workbook.worksheets[0];
    if (!worksheet) {
      throw new Error(`Worksheet not found in ${filePath}`);
    }

    const headers: string[] = [];
    const rows: T[] = [];
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.eachCell((cell, colNumber) => {
          headers[colNumber - 1] = String(cell.value ?? '');
        });
        return;
      }
      const record: Record<string, unknown> = {};
      row.eachCell((cell, colNumber) => {
        record[headers[colNumber - 1]] = cell.value;
      });
      rows.push(record as T);
    });
    return rows;
  }

  public static async writeExcel<T extends Record<string, unknown>>(
    filePath: string,
    rows: T[],
    sheetName = 'Sheet1'
  ): Promise<void> {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(sheetName);
    if (rows.length > 0) {
      worksheet.columns = Object.keys(rows[0]).map((key) => ({ header: key, key }));
      worksheet.addRows(rows);
    }

    const dir = path.dirname(filePath);
    if (!FileUtils.fileExists(dir)) {
      FileUtils.writeFile(path.join(dir, '.gitkeep'), '');
    }
    await workbook.xlsx.writeFile(filePath);
  }
}
