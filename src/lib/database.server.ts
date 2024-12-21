import { DATABASE_PATH_FROM_REPOSITORY_ROOT } from "$env/static/private";
import type { DB } from "$lib/types/database";
import type { Database as BetterSQLite3Database } from "better-sqlite3";
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

const dialect = new SqliteDialect({
  database: initializeDatabase(),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const database = new Kysely<DB>({
  dialect,
});

function initializeDatabase(): BetterSQLite3Database {
  const db = new SQLite(DATABASE_PATH_FROM_REPOSITORY_ROOT);
  db.exec("PRAGMA foreign_keys = ON");
  return db;
}
