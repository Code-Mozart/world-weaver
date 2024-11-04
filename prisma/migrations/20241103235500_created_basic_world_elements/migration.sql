/*
  Warnings:

  - You are about to drop the `Rectangle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Rectangle";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Node" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "x" REAL NOT NULL,
    "y" REAL NOT NULL
);

-- CreateTable
CREATE TABLE "Path" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "riverId" INTEGER,
    "mountainId" INTEGER,
    CONSTRAINT "Path_riverId_fkey" FOREIGN KEY ("riverId") REFERENCES "River" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Path_mountainId_fkey" FOREIGN KEY ("mountainId") REFERENCES "Mountain" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Polygon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "ExtraInformation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Coastline" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "polygonId" INTEGER NOT NULL,
    "groundType" INTEGER NOT NULL,
    "name" TEXT,
    CONSTRAINT "Coastline_polygonId_fkey" FOREIGN KEY ("polygonId") REFERENCES "Polygon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "River" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Mountain" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "NodesOnPolygons" (
    "nodeId" INTEGER NOT NULL,
    "polygonId" INTEGER NOT NULL,

    PRIMARY KEY ("nodeId", "polygonId"),
    CONSTRAINT "NodesOnPolygons_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NodesOnPolygons_polygonId_fkey" FOREIGN KEY ("polygonId") REFERENCES "Polygon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "NodesOnPaths" (
    "nodeId" INTEGER NOT NULL,
    "nextNodeId" INTEGER,
    "pathId" INTEGER NOT NULL,

    PRIMARY KEY ("nodeId", "pathId"),
    CONSTRAINT "NodesOnPaths_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NodesOnPaths_nextNodeId_fkey" FOREIGN KEY ("nextNodeId") REFERENCES "Node" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "NodesOnPaths_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "Path" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PathLinks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PathLinks_A_fkey" FOREIGN KEY ("A") REFERENCES "Path" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PathLinks_B_fkey" FOREIGN KEY ("B") REFERENCES "Path" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Coastline_polygonId_key" ON "Coastline"("polygonId");

-- CreateIndex
CREATE UNIQUE INDEX "_PathLinks_AB_unique" ON "_PathLinks"("A", "B");

-- CreateIndex
CREATE INDEX "_PathLinks_B_index" ON "_PathLinks"("B");
