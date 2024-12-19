-- CREATE TABLE IF NOT EXISTS "NetworkEdges_new" (
--     "fromNodeId" INTEGER NOT NULL,
--     "toNodeId" INTEGER NOT NULL,

--     PRIMARY KEY ("fromNodeId", "toNodeId"),
--     CONSTRAINT "NetworkEdges_fromNodeId_fkey" FOREIGN KEY ("fromNodeId") REFERENCES "NetworkNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
--     CONSTRAINT "NetworkEdges_toNodeId_fkey" FOREIGN KEY ("toNodeId") REFERENCES "NetworkNode" ("id") ON DELETE RESTRICT ON UPDATE CASCADE

--     CONSTRAINT "edge_must_be_within_network" CHECK (
--         (SELECT "networkId" FROM "NetworkNode" WHERE "id" = "fromNodeId") =
--         (SELECT "networkId" FROM "NetworkNode" WHERE "id" = "toNodeId")
--     )
-- );
-- INSERT INTO "NetworkEdges_new" SELECT * FROM "NetworkEdges";
-- DROP TABLE "NetworkEdges";
-- ALTER TABLE "NetworkEdges_new" RENAME TO "NetworkEdges";
BEGIN;

-- Insert Trigger
CREATE TRIGGER check_edges_connect_only_nodes_of_same_network_before_insert
BEFORE INSERT ON "NetworkEdges"
BEGIN
    SELECT RAISE(ABORT, 'edge must be within network')
    FROM "NetworkNode"
    INNER JOIN "NetworkNode" AS "fromNetworkNode" ON "NetworkNode"."id" = NEW."fromNodeId"
    INNER JOIN "NetworkNode" AS "toNetworkNode" ON "NetworkNode"."id" = NEW."toNodeId"
    WHERE "fromNetworkNode"."networkId" != "toNetworkNode"."networkId";
END;

-- Update Trigger
CREATE TRIGGER check_edges_connect_only_nodes_of_same_network_before_update
BEFORE UPDATE ON "NetworkEdges"
BEGIN
    SELECT RAISE(ABORT, 'edge must be within network')
    FROM "NetworkNode"
    INNER JOIN "NetworkNode" AS "fromNetworkNode" ON "NetworkNode"."id" = NEW."fromNodeId"
    INNER JOIN "NetworkNode" AS "toNetworkNode" ON "NetworkNode"."id" = NEW."toNodeId"
    WHERE "fromNetworkNode"."networkId" != "toNetworkNode"."networkId";
END;

COMMIT;
