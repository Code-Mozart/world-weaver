import { ChangesManager } from "$lib/controllers/changes-manager";
import { EditorWorld } from "$lib/controllers/editor-world";
import { GeometryRegistry } from "$lib/controllers/geometry-registry";
import type { Change } from "$lib/deltas/change";
import { setPointPositions } from "$lib/deltas/set-point-positions";
import { GroundType } from "$lib/types/ground-type";
import type { Point } from "$lib/types/world";
import { createId } from "@paralleldrive/cuid2";
import { beforeEach, describe, expect, test } from "vitest";

let points: Point[];
let changesManager: ChangesManager;

beforeEach(() => {
  points = createPoints();
  changesManager = createManager(points);
});

describe("when adding a new change", () => {
  describe("when there are no undone changes", () => {
    test("correctly appending the new change", () => {
      const changes = [createChange(points[0]), createChange(points[0]), createChange(points[0])];
      changes.forEach(change => changesManager.setCurrent(change));

      expectChangeList(changes);
      expectCurrent(changes[changes.length - 1]);
      expectCurrentIsApplied(true);
    });
  });

  describe("when there are undone changes", () => {
    test("prunes the undone changes", () => {
      const change1 = createChange(points[0]);
      const change2 = createChange(points[0]);
      const change3 = createChange(points[0]);
      const changes = [change1, change2, change3];
      changes.forEach(change => changesManager.setCurrent(change));
      expectChangeList(changes);
      expectCurrent(change3);
      expectCurrentIsApplied(true);

      changesManager.undo();
      expectCurrentIsApplied(false);
      expectCurrent(change3);
      expectChangeList(changes);

      changesManager.undo();
      expectCurrentIsApplied(false);
      expectCurrent(change2);
      expectChangeList(changes);

      const change4 = createChange(points[0]);
      changesManager.setCurrent(change4);
      expectChangeList([change1, change4]);
      expectCurrentIsApplied(true);
      expectCurrent(change4);
    });
  });
});

function expectChangeList(changes: Change[]) {
  expect([...changesManager["changes"].list]).toEqual(changes);
}

function expectCurrentIsApplied(expectedValue: boolean) {
  expect(changesManager["changes"].isCurrentApplied).toEqual(expectedValue);
}

function expectCurrent(change: Change) {
  expect(changesManager["changes"].current?.value).toEqual(change);
}

function createChange(point: Point): Change {
  return setPointPositions([
    { point, oldPosition: { x: point.x, y: point.y }, newPosition: { x: point.x + 1, y: point.y + 1 } },
  ]);
}

function createPoints() {
  return [{ id: 0, temporaryCuid: null, x: 0, y: 0 }];
}

function createManager(points: Point[]) {
  const worldCUID = createId();
  const world = new EditorWorld(
    worldCUID,
    { id: -1, name: "test", createdAt: new Date(), updatedAt: new Date(), authors: [], groundType: GroundType.Land },
    [],
    [],
    [],
    GeometryRegistry.fromMaps(new Map(points.map(point => [point.id, point])), new Map(), new Map()),
  );
  return new ChangesManager(world);
}
