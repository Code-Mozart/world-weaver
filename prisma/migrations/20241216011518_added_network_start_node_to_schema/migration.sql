/*
  Warnings:

  - Added the required column `startNodeId` to the `Network` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Network" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startNodeId" INTEGER NOT NULL,
    CONSTRAINT "Network_startNodeId_fkey" FOREIGN KEY ("startNodeId") REFERENCES "NetworkNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Network" ("id") SELECT "id" FROM "Network";
DROP TABLE "Network";
ALTER TABLE "new_Network" RENAME TO "Network";
CREATE UNIQUE INDEX "Network_startNodeId_key" ON "Network"("startNodeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
