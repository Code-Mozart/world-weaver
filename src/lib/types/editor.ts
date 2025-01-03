import type { GeometryRegistry } from "$lib/controllers/geometry-registry";
import type { World } from "$lib/types/world";

export interface EditorWorld extends World {
  geometryRegistry: GeometryRegistry;
}
