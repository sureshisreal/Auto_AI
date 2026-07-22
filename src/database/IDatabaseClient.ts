export interface DatabaseConnectionOptions {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

/**
 * Common contract every concrete DB client implements, so tests can
 * validate data against SQL Server, Oracle, PostgreSQL, or MySQL through
 * the same API (see DatabaseClientFactory for the Factory/Strategy pattern
 * that picks the implementation).
 */
export interface IDatabaseClient {
  connect(): Promise<void>;
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  execute(sql: string, params?: unknown[]): Promise<void>;
  disconnect(): Promise<void>;
}
