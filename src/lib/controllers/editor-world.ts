import type { WorldDocument } from "$lib/types/documents/world-document";
import type { Coastline, Mountain, River, World } from "$lib/types/world";
import type { GeometryRegistry } from "./geometry-registry";

export class EditorWorld implements World {
  cuid: string;
  worldDocument: WorldDocument;
  coastlines: Coastline[];
  rivers: River[];
  mountains: Mountain[];

  geometryRegistry: GeometryRegistry;

  constructor(
    cuid: string,
    worldDocument: WorldDocument,
    coastlines: Coastline[],
    rivers: River[],
    mountains: Mountain[],

    geometryRegistry: GeometryRegistry,
  ) {
    this.cuid = cuid;
    this.worldDocument = worldDocument;
    this.coastlines = coastlines;
    this.rivers = rivers;
    this.mountains = mountains;

    this.geometryRegistry = geometryRegistry;
  }
}
