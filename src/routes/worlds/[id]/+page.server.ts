import { WorldFactory } from "$lib/factories/world-factory";
import { loadWorld } from "$lib/io/reading/world-loader";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const world = await loadWorld(params.id);
  WorldFactory.addDemoObjects(world);
  return { world };
};
