/*
  Warnings:

  - You are about to drop the `ExtraInformation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Node` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NodesOnPaths` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `NodesOnPolygons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Path` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PathLinks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `networkId` to the `Mountain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `networkId` to the `River` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_PathLinks_B_index";

-- DropIndex
DROP INDEX "_PathLinks_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ExtraInformation";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Node";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NodesOnPaths";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "NodesOnPolygons";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Path";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_PathLinks";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Point" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "NetworkNode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pointId" INTEGER NOT NULL,
    "networkId" INTEGER NOT NULL,
    CONSTRAINT "NetworkNode_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NetworkNode_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Network" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "PointsInPolygons" (
    "polygonId" INTEGER NOT NULL,
    "pointId" INTEGER NOT NULL,
    "nextPointId" INTEGER,

    PRIMARY KEY ("polygonId", "pointId"),
    CONSTRAINT "PointsInPolygons_polygonId_fkey" FOREIGN KEY ("polygonId") REFERENCES "Polygon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PointsInPolygons_pointId_fkey" FOREIGN KEY ("pointId") REFERENCES "Point" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PointsInPolygons_nextPointId_fkey" FOREIGN KEY ("nextPointId") REFERENCES "Point" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Coastline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worldCuid" TEXT NOT NULL,
    "polygonId" INTEGER NOT NULL,
    "groundType" TEXT NOT NULL,
    "name" TEXT,
    CONSTRAINT "Coastline_polygonId_fkey" FOREIGN KEY ("polygonId") REFERENCES "Polygon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Coastline" ("groundType", "id", "name", "polygonId", "worldCuid") SELECT "groundType", "id", "name", "polygonId", "worldCuid" FROM "Coastline";
DROP TABLE "Coastline";
ALTER TABLE "new_Coastline" RENAME TO "Coastline";
CREATE UNIQUE INDEX "Coastline_polygonId_key" ON "Coastline"("polygonId");
CREATE INDEX "Coastline_worldCuid_idx" ON "Coastline"("worldCuid");
CREATE TABLE "new_Mountain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worldCuid" TEXT NOT NULL,
    "networkId" INTEGER NOT NULL,
    "name" TEXT,
    CONSTRAINT "Mountain_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Mountain" ("id", "name", "worldCuid") SELECT "id", "name", "worldCuid" FROM "Mountain";
DROP TABLE "Mountain";
ALTER TABLE "new_Mountain" RENAME TO "Mountain";
CREATE INDEX "Mountain_worldCuid_idx" ON "Mountain"("worldCuid");
CREATE TABLE "new_River" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "worldCuid" TEXT NOT NULL,
    "networkId" INTEGER NOT NULL,
    "name" TEXT,
    CONSTRAINT "River_networkId_fkey" FOREIGN KEY ("networkId") REFERENCES "Network" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_River" ("id", "name", "worldCuid") SELECT "id", "name", "worldCuid" FROM "River";
DROP TABLE "River";
ALTER TABLE "new_River" RENAME TO "River";
CREATE INDEX "River_worldCuid_idx" ON "River"("worldCuid");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
