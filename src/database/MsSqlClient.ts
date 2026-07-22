import { DatabaseConnectionOptions, IDatabaseClient } from './IDatabaseClient';
import { DatabaseError } from '../exceptions/DatabaseError';
import Logger from '../logger/Logger';

/**
 * SQL Server client. Note: the `mssql` driver parameterizes queries via
 * `.input(name, value)` rather than a positional array, so the `params`
 * argument on query()/execute() is unused here - bind values using
 * named parameters (e.g. `WHERE id = @id`) directly in the SQL string
 * when adopting this client for real use.
 */
export class MsSqlClient implements IDatabaseClient {
  private pool: any;

  constructor(private readonly options: DatabaseConnectionOptions) {}

  public async connect(): Promise<void> {
    let mssql: any;
    try {
      mssql = await import('mssql');
    } catch {
      throw new DatabaseError("MsSqlClient requires the 'mssql' package. Install it with: npm install mssql");
    }
    this.pool = await new mssql.ConnectionPool({
      server: this.options.host,
      port: this.options.port,
      database: this.options.database,
      user: this.options.user,
      password: this.options.password,
      options: { trustServerCertificate: true }
    }).connect();
    Logger.info(`MsSqlClient connected to ${this.options.host}:${this.options.port}/${this.options.database}`);
  }

  public async query<T = unknown>(sql: string): Promise<T[]> {
    this.assertConnected();
    const result = await this.pool.request().query(sql);
    return result.recordset as T[];
  }

  public async execute(sql: string): Promise<void> {
    this.assertConnected();
    await this.pool.request().query(sql);
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      Logger.info('MsSqlClient disconnected');
    }
  }

  private assertConnected(): void {
    if (!this.pool) {
      throw new DatabaseError('MsSqlClient is not connected. Call connect() first.');
    }
  }
}
