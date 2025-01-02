import { database } from "$lib/database.server";
import type { Document } from "$lib/types/database-wrappers";
import type { World } from "$lib/types/world";
import { omit } from "$lib/util/object-extensions";

export async function insertWorld(world: World) {
  await insertDocument(dumpWorldDocument(world));
}

async function insertDocument(document: Document) {
  const { id } = await database
    .insertInto("Document")
    .values(omit(document, "id"))
    .returning("id")
    .executeTakeFirstOrThrow();
  document.id = id;
}

function dumpWorldDocument(world: World): Document {
  return {
    id: world.worldDocument.id,
    worldCuid: world.cuid,
    name: "world",
    jsonData: JSON.stringify(world.worldDocument),
  };
}
