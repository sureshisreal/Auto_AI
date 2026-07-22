import { DatabaseConnectionOptions, IDatabaseClient } from './IDatabaseClient';
import { DatabaseError } from '../../shared/exceptions/DatabaseError';
import Logger from '../../config/logger/Logger';

export class PostgresClient implements IDatabaseClient {
  private client: any;

  constructor(private readonly options: DatabaseConnectionOptions) {}

  public async connect(): Promise<void> {
    let pg: any;
    try {
      pg = await import('pg');
    } catch {
      throw new DatabaseError("PostgresClient requires the 'pg' package. Install it with: npm install pg");
    }
    this.client = new pg.Client(this.options);
    await this.client.connect();
    Logger.info(`PostgresClient connected to ${this.options.host}:${this.options.port}/${this.options.database}`);
  }

  public async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    this.assertConnected();
    const result = await this.client.query(sql, params);
    return result.rows as T[];
  }

  public async execute(sql: string, params: unknown[] = []): Promise<void> {
    this.assertConnected();
    await this.client.query(sql, params);
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
      Logger.info('PostgresClient disconnected');
    }
  }

  private assertConnected(): void {
    if (!this.client) {
      throw new DatabaseError('PostgresClient is not connected. Call connect() first.');
    }
  }
}
