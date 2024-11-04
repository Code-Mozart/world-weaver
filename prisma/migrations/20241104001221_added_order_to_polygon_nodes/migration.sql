-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NodesOnPolygons" (
    "nodeId" INTEGER NOT NULL,
    "nextNodeId" INTEGER,
    "polygonId" INTEGER NOT NULL,

    PRIMARY KEY ("nodeId", "polygonId"),
    CONSTRAINT "NodesOnPolygons_nodeId_fkey" FOREIGN KEY ("nodeId") REFERENCES "Node" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NodesOnPolygons_nextNodeId_fkey" FOREIGN KEY ("nextNodeId") REFERENCES "Node" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "NodesOnPolygons_polygonId_fkey" FOREIGN KEY ("polygonId") REFERENCES "Polygon" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_NodesOnPolygons" ("nodeId", "polygonId") SELECT "nodeId", "polygonId" FROM "NodesOnPolygons";
DROP TABLE "NodesOnPolygons";
ALTER TABLE "new_NodesOnPolygons" RENAME TO "NodesOnPolygons";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
