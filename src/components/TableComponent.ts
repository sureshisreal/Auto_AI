import { Locator } from '@playwright/test';
import { BaseComponent } from './BaseComponent';

/**
 * Generic, ARIA-role-driven table wrapper reusable against any semantic
 * <table> (or role="table" element). Assumes a single header row.
 */
export class TableComponent extends BaseComponent {
  public rows(): Locator {
    return this.rootLocator.getByRole('row');
  }

  public async getRowCount(): Promise<number> {
    const totalRows = await this.rows().count();
    return Math.max(totalRows - 1, 0);
  }

  public async getCellText(rowIndex: number, columnIndex: number): Promise<string> {
    const dataRow = this.rows().nth(rowIndex + 1);
    const cell = dataRow.getByRole('cell').nth(columnIndex);
    return (await cell.textContent()) ?? '';
  }

  public findRowByText(text: string): Locator {
    return this.rootLocator.getByRole('row', { name: text });
  }
}
