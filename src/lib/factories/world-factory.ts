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
    world.coastlines.push({
      id: -1,
      temporaryCuid: createId(),

      name: "Continent 1",
      groundType: GroundType.Land,
      shape: createPolygon([
        { x: 0, y: 0 },
        { x: 100, y: 0 },
        { x: 100, y: 100 },
        { x: 0, y: 100 },
      ]),
    });
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
