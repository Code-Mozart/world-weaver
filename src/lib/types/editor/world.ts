import type { AnyIdentifier } from "$lib/deltas/base-delta";
import type { Change } from "$lib/deltas/change";
import type { Geometry, Point, World } from "$lib/types/world";

export interface EditorWorld extends World {
  selectionCount: number;
  selection: Geometry[];

  commitChange(change: Change): void;
  isInvisible(geometry: Geometry): boolean;
  isSelected(geometry: Geometry): boolean;
  setSelection(geometry: Geometry[]): void;
  getGeometryInBox(startX: number, startY: number, endX: number, endY: number): Geometry[];
  getNearestPoint(x: number, y: number, maxDistance?: number): Point | null;
  getPointOrThrow(identifier: AnyIdentifier): Point;
  undo(): boolean;
  redo(): boolean;
}
