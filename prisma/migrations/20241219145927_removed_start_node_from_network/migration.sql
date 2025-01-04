/*
  Warnings:

  - You are about to drop the column `startNodeId` on the `Network` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Network" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);
INSERT INTO "new_Network" ("id") SELECT "id" FROM "Network";
DROP TABLE "Network";
ALTER TABLE "new_Network" RENAME TO "Network";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
