/*
  Warnings:

  - A unique constraint covering the columns `[worldCuid,name]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Document_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Document_worldCuid_name_key" ON "Document"("worldCuid", "name");
