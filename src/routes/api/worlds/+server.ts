import { WorldFactory } from "$lib/factories/world-factory";
import { insertWorld } from "$lib/orm/world-writer.js";
import { json } from "@sveltejs/kit";

export async function POST({ request }) {
  const world = WorldFactory.createEmpty();
  insertWorld(world);
  return json({ worldCUID: world.cuid });
}
