/*
  Warnings:

  - Added the required column `startPointId` to the `Polygon` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Polygon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "startPointId" INTEGER NOT NULL,
    CONSTRAINT "Polygon_startPointId_fkey" FOREIGN KEY ("startPointId") REFERENCES "Point" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Polygon" ("id") SELECT "id" FROM "Polygon";
DROP TABLE "Polygon";
ALTER TABLE "new_Polygon" RENAME TO "Polygon";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
