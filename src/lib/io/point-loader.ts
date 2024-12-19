import { database } from "$lib/database";
import type { Point } from "$lib/types/database-wrappers";

interface HasPointProperty {
  pointId: number;
}

export async function loadPoints(...args: HasPointProperty[]): Promise<Map<number, Point>> {
  const pointIds = args.map(row => row.pointId);
  const points = await database.selectFrom("Point").where("id", "in", pointIds).selectAll().execute();

  return new Map(points.map(point => [point.id, point]));
}

export function getOrThrow(map: Map<number, Point>, key: number): Point {
  const point = map.get(key);
  if (point === undefined) {
    throw new Error(`Point with id ${key} does not exist`);
  }
  return point;
}
