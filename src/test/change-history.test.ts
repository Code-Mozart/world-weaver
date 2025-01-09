import { ChangeHistory } from "$lib/controllers/change-history";
import { setPointPositions } from "$lib/deltas/set-point-positions";
import { GeometryRegistry } from "$lib/controllers/geometry-registry";
import { createId } from "@paralleldrive/cuid2";
import type { Coastline, Mountain, Point, River } from "$lib/types/world";
import type { Change } from "$lib/deltas/change";
import { beforeEach, describe, expect, test } from "vitest";
import { EditorWorld } from "$lib/controllers/editor-world";
import { WorldFactory } from "$lib/factories/world-factory";

let changeHistory: ChangeHistory;
let points: Point[];
let changes: Change[];
let world: EditorWorld;

beforeEach(() => {
  points = createPoints();
  changes = [createChange(points[0]), createChange(points[0]), createChange(points[0])];
  world = createWorld(points);
  changeHistory = new ChangeHistory();
});

describe("setCurrent", () => {
  describe("when there are no undone changes", () => {
    beforeEach(() => {
      changeHistory.setCurrent(changes[0]);
    });

    describe("when it is the first change", () => {
      test("sets it as current", () => {
        expectCurrentChange(changes[0]);
      });
      test("marks the current change as applied", () => {
        expectCurrentIsApplied(true);
      });
      test("has only the added change", () => {
        expectChangesList([changes[0]]);
      });
    });

    describe("when there are changes before", () => {
      beforeEach(() => {
        changeHistory.setCurrent(changes[1]);
      });

      test("sets it as current", () => {
        expectCurrentChange(changes[1]);
      });
      test("marks the current change as applied", () => {
        expectCurrentIsApplied(true);
      });
      test("has all changes before and the added change", () => {
        expectChangesList([changes[0], changes[1]]);
      });
    });
  });

  describe("when there are undone changes", () => {
    beforeEach(() => {
      changes.forEach(change => changeHistory.setCurrent(change));
      changeHistory.undo(world);
      changeHistory.undo(world);
    });

    describe("before setting the current change", () => {
      test("the current change is not applied", () => {
        expectCurrentIsApplied(false);
      });
      test("the current change is the last undone change", () => {
        expectCurrentChange(changes[1]);
      });
      test("the change list contains all undone changes", () => {
        expectChangesList(changes);
      });
    });

    describe("when the current change is undone", () => {
      let newChange: Change;

      beforeEach(() => {
        newChange = createChange(points[0]);
        changeHistory.setCurrent(newChange);
      });

      test("sets the new change as current", () => {
        expectCurrentChange(newChange);
      });
      test("marks the new change as applied", () => {
        expectCurrentIsApplied(true);
      });
      test("prunes the undone changes including the undone change, \
        that was current before, and adds the new change", () => {
        expectChangesList([changes[0], newChange]);
      });
    });

    describe("when the current change is applied", () => {
      let newChange: Change;

      beforeEach(() => {
        changeHistory.redo(world);

        newChange = createChange(points[0]);
        changeHistory.setCurrent(newChange);
      });

      test("sets the new change as current", () => {
        expectCurrentChange(newChange);
      });
      test("marks the new change as applied", () => {
        expectCurrentIsApplied(true);
      });

      test("prunes the undone changes ahead of the applied change, \
        that was current before, and adds the new change", () => {
        expectChangesList([changes[0], changes[1], newChange]);
      });
    });
  });
});

describe("undo", () => {
  beforeEach(() => {
    changes.forEach(change => changeHistory.setCurrent(change));
  });

  describe("before undoing the current change", () => {
    test("the last change is current", () => {
      expectCurrentChange(changes[2]);
    });
    test("the current change is applied", () => {
      expectCurrentIsApplied(true);
    });
    test("the change list contains all changes", () => {
      expectChangesList(changes);
    });
  });

  describe("when the current change is applied", () => {
    let undoneChange: Change | null;

    beforeEach(() => {
      undoneChange = changeHistory.undo(world);
    });

    test("succeeds", () => {
      expect(undoneChange).not.toBeNull();
    });
    test("stays at the current change", () => {
      expectCurrentChange(undoneChange!);
    });
    test("marks it as undone", () => {
      expectCurrentIsApplied(false);
    });
    test("the change list contains all changes", () => {
      expectChangesList(changes);
    });
  });

  describe("when the current change is undone", () => {
    let undoneChange: Change;

    beforeEach(() => {
      // this is covered by other tests
      changeHistory.undo(world);

      undoneChange = changeHistory.undo(world)!;
    });

    test("moves to the previous change", () => {
      expect(undoneChange).toBe(changes[1]);
    });
    test("sets the undone change as current", () => {
      expectCurrentChange(undoneChange);
    });
    test("marks the previous change as undone", () => {
      expectCurrentIsApplied(false);
    });
    test("the change list contains all changes", () => {
      expectChangesList(changes);
    });
  });

  describe("when there are no changes", () => {
    beforeEach(() => {
      // reset the change history to clear it
      changeHistory = new ChangeHistory();
    });

    test("returns null", () => {
      const result = changeHistory.undo(world);
      expect(result).toBeNull();
    });
  });
});

describe("redo", () => {
  beforeEach(() => {
    changes.forEach(change => changeHistory.setCurrent(change));
    changeHistory.undo(world);
    changeHistory.undo(world);
  });

  describe("before redoing any changes", () => {
    test("the current change is not applied", () => {
      expectCurrentIsApplied(false);
    });
    test("the current change is the last undone change", () => {
      expectCurrentChange(changes[1]);
    });
    test("the change list contains all changes", () => {
      expectChangesList(changes);
    });
  });

  describe("when the current change is undone", () => {
    let redoneChange: Change | null;

    beforeEach(() => {
      redoneChange = changeHistory.redo(world);
    });

    test("succeeds", () => {
      expect(redoneChange).not.toBeNull();
    });
    test("stays at the current change", () => {
      expectCurrentChange(redoneChange!);
    });
    test("marks it as redone", () => {
      expectCurrentIsApplied(true);
    });
    test("the change list contains all changes", () => {
      expectChangesList(changes);
    });
  });

  describe("when the current change is redone", () => {
    let redoneChange: Change | null;

    beforeEach(() => {
      // this is covered by other tests
      changeHistory.redo(world);

      redoneChange = changeHistory.redo(world);
    });

    test("moves to the next change", () => {
      expect(redoneChange).toBe(changes[2]);
    });
    test("sets the redone change as current", () => {
      expectCurrentChange(redoneChange!);
    });
    test("marks the next change as redone", () => {
      expectCurrentIsApplied(true);
    });
    test("the change list contains all changes", () => {
      expectChangesList(changes);
    });
  });

  describe("when there are no undone changes", () => {
    beforeEach(() => {
      changeHistory.redo(world);
      changeHistory.redo(world);
    });

    test("returns null", () => {
      const result = changeHistory.redo(world);
      expect(result).toBeNull();
    });
    test("stays at the last change", () => {
      expectCurrentChange(changes[2]);
    });
    test("the current change is applied", () => {
      expectCurrentIsApplied(true);
    });
    test("the change list contains all changes", () => {
      expectChangesList(changes);
    });
  });
});

function getChangeList() {
  return [...changeHistory["changes"]];
}

function expectChangesList(expected: Change[]) {
  expect(getChangeList()).toEqual(expected);
}

function expectCurrentChange(expected: Change) {
  expect(changeHistory["current"]?.value).toBe(expected);
}

function expectCurrentIsApplied(expected: boolean) {
  expect(changeHistory["isCurrentApplied"]).toBe(expected);
}

function createPoints(): Point[] {
  return [{ id: 0, temporaryCuid: null, x: 0, y: 0 }];
}

function createChange(point: Point): Change {
  const oldPosition = { x: point.x, y: point.y };
  point.x += 1;
  point.y += 1;
  const newPosition = { x: point.x, y: point.y };
  return setPointPositions([{ point, oldPosition, newPosition }]);
}

function createWorld(points: Point[]): EditorWorld {
  const worldCUID = createId();
  const worldDocument = WorldFactory.createEmptyWorldDocument();

  const coastlines = new Array<Coastline>();
  const rivers = new Array<River>();
  const mountains = new Array<Mountain>();

  return new EditorWorld(
    worldCUID,
    worldDocument,
    coastlines,
    rivers,
    mountains,
    GeometryRegistry.fromMaps(new Map(points.map(point => [point.id, point])), new Map(), new Map()),
  );
}
