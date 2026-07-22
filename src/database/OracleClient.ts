import { DatabaseConnectionOptions, IDatabaseClient } from './IDatabaseClient';
import { DatabaseError } from '../exceptions/DatabaseError';
import Logger from '../logger/Logger';

export class OracleClient implements IDatabaseClient {
  private connection: any;

  constructor(private readonly options: DatabaseConnectionOptions) {}

  public async connect(): Promise<void> {
    let oracledb: any;
    try {
      oracledb = await import('oracledb');
    } catch {
      throw new DatabaseError("OracleClient requires the 'oracledb' package. Install it with: npm install oracledb");
    }
    this.connection = await oracledb.getConnection({
      user: this.options.user,
      password: this.options.password,
      connectString: `${this.options.host}:${this.options.port}/${this.options.database}`
    });
    Logger.info(`OracleClient connected to ${this.options.host}:${this.options.port}/${this.options.database}`);
  }

  public async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    this.assertConnected();
    const result = await this.connection.execute(sql, params);
    return (result.rows ?? []) as T[];
  }

  public async execute(sql: string, params: unknown[] = []): Promise<void> {
    this.assertConnected();
    await this.connection.execute(sql, params, { autoCommit: true });
  }

  public async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      Logger.info('OracleClient disconnected');
    }
  }

  private assertConnected(): void {
    if (!this.connection) {
      throw new DatabaseError('OracleClient is not connected. Call connect() first.');
    }
  }
}
