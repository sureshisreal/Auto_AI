import dotenv from 'dotenv';
import path from 'path';
import { Environment } from '../enums/Environment';
import { BrowserType } from '../enums/BrowserType';
import { DatabaseType } from '../enums/DatabaseType';
import { IConfig } from '../interfaces/IConfig';
import { ConfigurationError } from '../exceptions/ConfigurationError';
import { EnvKeys } from '../constants/EnvKeys';

class Config implements IConfig {
  private static instance: Config;
  private envConfig: IConfig;

  private constructor() {
    const env = (process.env[EnvKeys.ENVIRONMENT] as Environment) || Environment.QA;
    const envPath = path.resolve(process.cwd(), `.env.${env}`);
    dotenv.config({ path: envPath });
    // Load default .env if environment-specific not found
    if (Object.keys(process.env).length === 0) {
      dotenv.config();
    }
    this.envConfig = this.loadConfig();
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  private loadConfig(): IConfig {
    const environment = this.getEnv(EnvKeys.ENVIRONMENT, Environment.QA) as Environment;
    return {
      environment: environment,
      baseUrl: this.getEnv(EnvKeys.BASE_URL, 'http://127.0.0.1:3000'),
      apiBaseUrl: this.getEnv(EnvKeys.API_BASE_URL, 'http://127.0.0.1:3000/api'),
      adminUsername: this.getEnv(EnvKeys.ADMIN_USERNAME, 'admin@example.com'),
      adminPassword: this.getEnv(EnvKeys.ADMIN_PASSWORD, 'admin123!'),
      standardUsername: this.getEnv(EnvKeys.STANDARD_USERNAME, 'user@example.com'),
      standardPassword: this.getEnv(EnvKeys.STANDARD_PASSWORD, 'user123!'),
      headless: this.getEnvBoolean(EnvKeys.HEADLESS, true),
      parallelWorkers: this.getEnvNumber(EnvKeys.PARALLEL_WORKERS, 4),
      retries: this.getEnvNumber(EnvKeys.RETRIES, 2),
      browser: process.env[EnvKeys.BROWSER] as BrowserType | undefined,
      dbType: process.env[EnvKeys.DB_TYPE] as DatabaseType | undefined,
      dbHost: process.env[EnvKeys.DB_HOST],
      dbPort: process.env[EnvKeys.DB_PORT] ? this.getEnvNumber(EnvKeys.DB_PORT, 0) : undefined,
      dbName: process.env[EnvKeys.DB_NAME],
      dbUser: process.env[EnvKeys.DB_USER],
      dbPassword: process.env[EnvKeys.DB_PASSWORD]
    };
  }

  private getEnv(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  private getEnvBoolean(key: string, defaultValue: boolean): boolean {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    return value.toLowerCase() === 'true';
  }

  private getEnvNumber(key: string, defaultValue: number): number {
    const value = process.env[key];
    if (value === undefined) {
      return defaultValue;
    }
    const parsed = parseInt(value, 10);
    if (isNaN(parsed)) {
      throw new ConfigurationError(`Invalid number for ${key}: ${value}`);
    }
    return parsed;
  }

  public get environment(): Environment {
    return this.envConfig.environment;
  }

  public get baseUrl(): string {
    return this.envConfig.baseUrl;
  }

  public get apiBaseUrl(): string {
    return this.envConfig.apiBaseUrl;
  }

  public get adminUsername(): string {
    return this.envConfig.adminUsername;
  }

  public get adminPassword(): string {
    return this.envConfig.adminPassword;
  }

  public get standardUsername(): string {
    return this.envConfig.standardUsername;
  }

  public get standardPassword(): string {
    return this.envConfig.standardPassword;
  }

  public get headless(): boolean {
    return this.envConfig.headless;
  }

  public get parallelWorkers(): number {
    return this.envConfig.parallelWorkers;
  }

  public get retries(): number {
    return this.envConfig.retries;
  }

  public get browser(): BrowserType | undefined {
    return this.envConfig.browser;
  }

  public get dbType(): DatabaseType | undefined {
    return this.envConfig.dbType;
  }

  public get dbHost(): string | undefined {
    return this.envConfig.dbHost;
  }

  public get dbPort(): number | undefined {
    return this.envConfig.dbPort;
  }

  public get dbName(): string | undefined {
    return this.envConfig.dbName;
  }

  public get dbUser(): string | undefined {
    return this.envConfig.dbUser;
  }

  public get dbPassword(): string | undefined {
    return this.envConfig.dbPassword;
  }
}

export default Config.getInstance();
