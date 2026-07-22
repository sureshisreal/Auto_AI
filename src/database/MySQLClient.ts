import { DatabaseConnectionOptions, IDatabaseClient } from './IDatabaseClient';
import { DatabaseError } from '../exceptions/DatabaseError';
import Logger from '../logger/Logger';

export class MySQLClient implements IDatabaseClient {
  private connection: any;

  constructor(private readonly options: DatabaseConnectionOptions) {}

  public async connect(): Promise<void> {
    let mysql: any;
    try {
      mysql = await import('mysql2/promise');
    } catch {
      throw new DatabaseError("MySQLClient requires the 'mysql2' package. Install it with: npm install mysql2");
    }
    this.connection = await mysql.createConnection(this.options);
    Logger.info(`MySQLClient connected to ${this.options.host}:${this.options.port}/${this.options.database}`);
  }

  public async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    this.assertConnected();
    const [rows] = await this.connection.execute(sql, params);
    return rows as T[];
  }

  public async execute(sql: string, params: unknown[] = []): Promise<void> {
    this.assertConnected();
    await this.connection.execute(sql, params);
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      Logger.info('MySQLClient disconnected');
    }
  }

  private assertConnected(): void {
    if (!this.connection) {
      throw new DatabaseError('MySQLClient is not connected. Call connect() first.');
    }
  }
}
