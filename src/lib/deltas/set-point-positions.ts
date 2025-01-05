import {
  BaseDelta,
  createDelta,
  DeltaType,
  getIdentifier,
  type AnyIdentifier,
  type BaseDeltaData,
} from "$lib/deltas/base-delta";
import type { EditorWorld } from "$lib/types/editor/world";
import type { Vector2 } from "$lib/types/math/vector2";
import type { Point } from "$lib/types/world";
import { Change } from "$lib/deltas/change";

export type SetPointPositionsItem = Vector2 & AnyIdentifier;

export class SetPointPositions extends BaseDelta {
  data: SetPointPositionsItem[];

  constructor(baseData: BaseDeltaData, data: SetPointPositionsItem[]) {
    super(baseData);
    this.data = data;
  }

  public apply(world: EditorWorld): boolean {
    this.data.forEach(({ x, y, ...identifier }) => {
      const point = world.getPointOrThrow(identifier);
      point.x = x;
      point.y = y;
    });
    return true;
  }
}

export function setPointPositions(arg: { point: Point; oldPosition: Vector2; newPosition: Vector2 }[]): Change {
  const base = createDelta(DeltaType.SetPointPositions);
  const forward = new SetPointPositions(
    base,
    arg.map(({ point, newPosition }) => ({ x: newPosition.x, y: newPosition.y, ...getIdentifier(point) })),
  );
  const backward = new SetPointPositions(
    base,
    arg.map(({ point, oldPosition }) => ({ x: oldPosition.x, y: oldPosition.y, ...getIdentifier(point) })),
  );
  console.log("Created set position change", forward, backward);
  return new Change(forward, backward);
}
