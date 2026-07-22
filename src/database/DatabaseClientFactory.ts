import { DatabaseType } from '../enums/DatabaseType';
import { DatabaseConnectionOptions, IDatabaseClient } from './IDatabaseClient';
import { PostgresClient } from './PostgresClient';
import { MySQLClient } from './MySQLClient';
import { MsSqlClient } from './MsSqlClient';
import { OracleClient } from './OracleClient';
import { DatabaseError } from '../exceptions/DatabaseError';

/**
 * Factory Pattern: builds the right IDatabaseClient for a DatabaseType.
 * None of the concrete clients connect until connect() is called, so
 * creating a client never requires its driver package to be installed.
 */
export class DatabaseClientFactory {
  public static create(type: DatabaseType, options: DatabaseConnectionOptions): IDatabaseClient {
    switch (type) {
      case DatabaseType.POSTGRES:
        return new PostgresClient(options);
      case DatabaseType.MYSQL:
        return new MySQLClient(options);
      case DatabaseType.MSSQL:
        return new MsSqlClient(options);
      case DatabaseType.ORACLE:
        return new OracleClient(options);
      default:
        throw new DatabaseError(`Unsupported database type: ${type}`);
    }
  }
}
