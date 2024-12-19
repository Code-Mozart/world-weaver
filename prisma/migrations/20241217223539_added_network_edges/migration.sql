-- CreateTable
CREATE TABLE "NetworkEdges" (
    "fromNodeId" INTEGER NOT NULL,
    "toNodeId" INTEGER NOT NULL,

    PRIMARY KEY ("fromNodeId", "toNodeId"),
    CONSTRAINT "NetworkEdges_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "NetworkNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "NetworkEdges_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "NetworkNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
