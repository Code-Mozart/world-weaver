import type { WorldDocument } from "$lib/types/documents/world-document";
import { GroundType } from "$lib/types/ground-type";
import type { Point, Polygon, World } from "$lib/types/world";
import { createId } from "@paralleldrive/cuid2";

export namespace WorldFactory {
  /**
   * Creates a new empty world.
   */
  export function createEmpty(): World {
    return {
      cuid: createId(),

      worldDocument: createEmptyWorldDocument(),

      coastlines: [],
      rivers: [],
      mountains: [],
    };
  }

  export function createEmptyWorldDocument(): WorldDocument {
    return {
      id: 0,
      name: "world",
      createdAt: new Date(),
      updatedAt: new Date(),
      authors: [],
      groundType: GroundType.Land,
    };
  }

  export function createDemoWorld(): World {
    const world = createEmpty();
    addDemoObjects(world);
    return world;
  }

  export function addDemoObjects(world: World) {
    world.coastlines.push(
      {
        id: -1,
        temporaryCuid: createId(),

        name: "The Lake of first live",
        groundType: GroundType.Water,
        shape: createPolygon([
          { x: 80, y: 40 },
          { x: 180, y: 40 },
          { x: 260, y: 100 },
          { x: 220, y: 160 },
          { x: 220, y: 220 },
          { x: 140, y: 240 },
          { x: 120, y: 160 },
          { x: 140, y: 100 },
          { x: 60, y: 80 },
        ]),
      },
      {
        id: -1,
        temporaryCuid: createId(),

        name: "The Rift",
        groundType: GroundType.Void,
        shape: createPolygon([
          { x: 450, y: 300 },
          { x: 600, y: 320 },
          { x: 650, y: 300 },
          { x: 650, y: 350 },
          { x: 550, y: 350 },
        ]),
      },
    );
  }

  function createPolygon(positions: { x: number; y: number }[]): Polygon {
    return {
      id: -1,
      temporaryCuid: createId(),
      points: positions.map(position => createPoint(position.x, position.y)),
    };
  }

  function createPoint(x: number, y: number): Point {
    return { id: -1, temporaryCuid: createId(), x, y };
  }
}
