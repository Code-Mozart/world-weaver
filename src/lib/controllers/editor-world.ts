import type { WorldDocument } from "$lib/types/documents/world-document";
import type { Coastline, Geometry, Mountain, Point, Record, River } from "$lib/types/world";
import type { EditorWorld as EditorWorldInterface } from "$lib/types/editor/world";
import type { GeometryRegistry } from "$lib/controllers/geometry-registry";
import type { Delta } from "$lib/deltas/delta";
import { ChangesManager } from "./changes-manager";
import type { Change } from "$lib/deltas/change";
import type { AnyIdentifier } from "$lib/deltas/base-delta";

export class EditorWorld implements EditorWorldInterface {
  cuid: string;
  worldDocument: WorldDocument;
  coastlines: Coastline[];
  rivers: River[];
  mountains: Mountain[];

  geometryRegistry: GeometryRegistry;
  changesManager: ChangesManager;

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
    this.changesManager = new ChangesManager(this);
  }

  public commitChange(change: Change) {
    this.changesManager.setMostRecent(change);
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

  public getPointOrThrow(identifier: AnyIdentifier): Point {
    const identifierProperty = getIdentifierProperty(identifier);
    const identifierValue = identifier[identifierProperty as keyof AnyIdentifier];

    const point = this.geometryRegistry.findPoint(point => point[identifierProperty] === identifierValue);
    if (point === null) {
      throw new Error(`Point with ${identifierProperty} ${identifierValue} was not found`);
    }
    return point;
  }

  public undo(): boolean {
    return this.changesManager.undo();
  }

  public redo(): boolean {
    return this.changesManager.redo();
  }
}

function getIdentifierProperty(identifier: AnyIdentifier): keyof Record {
  if ("id" in identifier) {
    return "id";
  } else {
    return "temporaryCuid";
  }
}
