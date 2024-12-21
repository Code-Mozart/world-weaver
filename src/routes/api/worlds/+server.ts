import { WorldFactory } from "$lib/factories/world-factory";
import { insertWorld } from "$lib/io/writing/world-database-writer.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  const world = WorldFactory.createEmpty();
  insertWorld(world);
  return json({ worldCUID: world.cuid });
}
