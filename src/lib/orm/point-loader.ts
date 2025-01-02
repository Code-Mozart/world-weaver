import { database } from "$lib/database.server";
import type { Point } from "$lib/types/world";

interface HasPointProperty {
  pointId: number;
}

export async function loadPoints(...args: HasPointProperty[]): Promise<Map<number, Point>> {
  const pointIds = args.map(row => row.pointId);
  const pointRows = await database.selectFrom("Point").where("id", "in", pointIds).selectAll().execute();

  return new Map(pointRows.map(point => [point.id, { ...point, temporaryCuid: null }]));
}

export function getOrThrow(map: Map<number, Point>, key: number): Point {
  const point = map.get(key);
  if (point === undefined) {
    throw new Error(`Point with id ${key} does not exist`);
  }
  return point;
}
