import type { DB } from "$lib/types/database"
import SQLite from "better-sqlite3"
import { Kysely, SqliteDialect } from "kysely"

const dialect = new SqliteDialect({
    database: new SQLite(process.env.DATABASE_URL),
})

// Database interface is passed to Kysely's constructor, and from now on, Kysely 
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
// to communicate with your database.
export const database = new Kysely<DB>({
    dialect,
})