/**
 * Ambient declarations for optional database drivers. None of these
 * packages are project dependencies - teams install only the one they
 * need (`npm install pg` / `mysql2` / `mssql` / `oracledb`). Declaring
 * them here lets `await import('pg')` type-check without requiring the
 * package at compile time; if it's missing at runtime, the dynamic
 * import throws and the concrete client wraps that in a DatabaseError.
 */
declare module 'pg';
declare module 'mysql2/promise';
declare module 'mssql';
declare module 'oracledb';
