import { Environment } from '../enums/Environment';
import { BrowserType } from '../enums/BrowserType';
import { DatabaseType } from '../enums/DatabaseType';

export interface IConfig {
  environment: Environment;
  baseUrl: string;
  apiBaseUrl: string;
  adminUsername: string;
  adminPassword: string;
  standardUsername: string;
  standardPassword: string;
  headless: boolean;
  parallelWorkers: number;
  retries: number;
  browser?: BrowserType;
  dbType?: DatabaseType;
  dbHost?: string;
  dbPort?: number;
  dbName?: string;
  dbUser?: string;
  dbPassword?: string;
}
