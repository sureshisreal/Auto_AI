import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { HeaderComponent } from '../components/HeaderComponent';
import { NavigationMenu } from '../components/NavigationMenu';
import { TableComponent } from '../components/TableComponent';
import { Pagination } from '../components/Pagination';
import { ToastMessage } from '../components/ToastMessage';
import { CommonDialog } from '../components/CommonDialog';
import { Routes } from '../constants/Routes';

export class DashboardPage extends BasePage {
  public readonly header: HeaderComponent;
  public readonly navigationMenu: NavigationMenu;
  public readonly jobsTable: TableComponent;
  public readonly pagination: Pagination;
  public readonly toast: ToastMessage;
  public readonly logoutDialog: CommonDialog;
  private readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.navigationMenu = new NavigationMenu(page, page.locator('header nav'));
    this.jobsTable = new TableComponent(page, page.getByRole('table', { name: 'Jobs' }));
    this.pagination = new Pagination(page, page.getByRole('navigation', { name: 'Pagination' }));
    this.toast = new ToastMessage(page);
    this.logoutDialog = new CommonDialog(page);
    this.saveButton = this.page.getByRole('button', { name: 'Save Changes' });
  }

  public async navigate(): Promise<void> {
    await this.navigateTo(Routes.DASHBOARD);
  }

  public async saveChanges(): Promise<void> {
    await this.click(this.saveButton);
  }

  public async logout(): Promise<void> {
    await this.header.clickLogout();
    await this.logoutDialog.waitForOpen();
    await this.logoutDialog.confirm();
  }
}
