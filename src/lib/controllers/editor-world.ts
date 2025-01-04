import type { WorldDocument } from "$lib/types/documents/world-document";
import type { Coastline, Geometry, Mountain, Point, River, World } from "$lib/types/world";
import type { GeometryRegistry } from "$lib/controllers/geometry-registry";

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

  public isInvisible(geometry: Geometry): boolean {
    return this.geometryRegistry.isInvisible(geometry);
  }

  public isSelected(geometry: Geometry): boolean {
    return this.geometryRegistry.isSelected(geometry);
  }

  get selectionCount(): number {
    return this.geometryRegistry.selectionCount;
  }

  get selection(): Geometry[] {
    return this.geometryRegistry.selection;
  }

  public setSelection(geometry: Geometry[]) {
    this.geometryRegistry.setSelection(geometry);
  }

  public getGeometryInBox(startX: number, startY: number, endX: number, endY: number): Geometry[] {
    return this.geometryRegistry.getInBox(startX, startY, endX, endY);
  }

  public getNearestPoint(x: number, y: number, maxDistance?: number): Point | null {
    return this.geometryRegistry.getNearestPoint(x, y, maxDistance);
  }
}
