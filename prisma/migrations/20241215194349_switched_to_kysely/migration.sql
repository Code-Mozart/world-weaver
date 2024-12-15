/*
  Warnings:

  - You are about to drop the column `worldCuid` on the `Coastline` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `worldCuid` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `worldCuid` on the `Mountain` table. All the data in the column will be lost.
  - You are about to drop the column `worldCuid` on the `River` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coastline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "polygonId" INTEGER NOT NULL,
    "groundType" INTEGER NOT NULL,
    "name" TEXT,
    CONSTRAINT "Coastline_polygonId_fkey" FOREIGN KEY ("polygonId") REFERENCES "Polygon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Coastline" ("groundType", "id", "name", "polygonId") SELECT "groundType", "id", "name", "polygonId" FROM "Coastline";
DROP TABLE "Coastline";
ALTER TABLE "new_Coastline" RENAME TO "Coastline";
CREATE UNIQUE INDEX "Coastline_polygonId_key" ON "Coastline"("polygonId");
CREATE TABLE "new_Document" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jsonData" TEXT NOT NULL
);
INSERT INTO "new_Document" ("id", "jsonData") SELECT "id", "jsonData" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE TABLE "new_Mountain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);
INSERT INTO "new_Mountain" ("id", "name") SELECT "id", "name" FROM "Mountain";
DROP TABLE "Mountain";
ALTER TABLE "new_Mountain" RENAME TO "Mountain";
CREATE TABLE "new_River" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);
INSERT INTO "new_River" ("id", "name") SELECT "id", "name" FROM "River";
DROP TABLE "River";
ALTER TABLE "new_River" RENAME TO "River";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
