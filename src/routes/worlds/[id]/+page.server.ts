import { loadWorld } from "$lib/io/reading/world-loader";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  return { world: await loadWorld(params.id) };
};
