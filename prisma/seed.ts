// prisma/seed.ts

import { Kysely, SqliteDialect } from "kysely";
import type { DB } from "../src/lib/types/database";
import SQLite from "better-sqlite3";
import seedData from "../src/lib/data.json" assert { type: "json" };

const database = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new SQLite(process.env.DATABASE_URL),
  }),
});

async function main() {
  console.log(`Start seeding ...`);

  for (const [tableName, rows] of Object.entries(seedData)) {
    let query = database.insertInto(tableName as keyof DB).values(rows as any);
    await query.execute();
  }
}

main()
  .then(async () => {
    await database.destroy();
    console.log(`Seeding finished.`);
  })
  .catch(async e => {
    console.error(e);
    console.log(`Seeding failed.`);
    await database.destroy();
    process.exit(1);
  });
