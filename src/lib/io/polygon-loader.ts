import { database } from "$lib/database";
import type { PointsInPolygons, Polygon as PolygonRow } from "$lib/types/database-wrappers";
import type { Point, Polygon } from "$lib/types/world";
import { getOrThrow as getPointOrThrow } from "./point-loader";

interface HasPolygonProperty {
  polygonId: number;
}

interface LoadPolygonsResult {
  polygonRows: PolygonRow[];
  pointsInPolygons: PointsInPolygons[];
}
export async function loadPolygons(...args: HasPolygonProperty[]): Promise<LoadPolygonsResult> {
  const polygonIds = args.map(row => row.polygonId);
  const polygons = await database.selectFrom("Polygon").where("id", "in", polygonIds).selectAll().execute();

  const pointsInPolygons = await database
    .selectFrom("PointsInPolygons")
    .where("polygonId", "in", polygonIds)
    .selectAll()
    .execute();

  return { polygonRows: polygons, pointsInPolygons };
}

export function constructPolygons(
  polygonRows: PolygonRow[],
  pointsInPolygons: PointsInPolygons[],
  pointsMap: Map<number, Point>,
): Map<number, Polygon> {
  return new Map(
    polygonRows.map(polygonRow => [polygonRow.id, constructPolygon(polygonRow, pointsInPolygons, pointsMap)]),
  );
}

export function getPolygonOrThrow(map: Map<number, Polygon>, key: number): Polygon {
  const polygon = map.get(key);
  if (polygon === undefined) {
    throw new Error(`Polygon with id ${key} does not exist.`);
  }
  return polygon;
}

function constructPolygon(
  polygonRow: PolygonRow,
  pointsInPolygons: PointsInPolygons[],
  pointsMap: Map<number, Point>,
): Polygon {
  const polygonId = polygonRow.id;
  const pointsInPolygon = pointsInPolygons.filter(mappingRow => mappingRow.polygonId === polygonId);
  const pointIds = pointsInPolygon.map(pointsInPolygon => pointsInPolygon.pointId);

  let polygonPoints = new Array<Point>(pointIds.length);
  let pointId = polygonRow.startPointId;
  for (let i = 0; i < pointIds.length; i++) {
    polygonPoints[i] = getPointOrThrow(pointsMap, pointId);
    const nextId = pointsInPolygon[i].nextPointId;
    if (nextId === null) {
      throw new Error(`The point ${pointId} on the polygon ${polygonId} was expected \
                to have a next point, because there should still be points after it, but it \
                did not. Either the polygon has orphan points (some extra points, that are \
                not part of the linked list), or the next point is missing.`);
    }
  }

  if (pointsInPolygon[pointsInPolygon.length - 1].nextPointId !== null) {
    throw new Error(`The point ${pointId} on the polygon ${polygonId} was expected to have \
            no next point, because there should not be any points after it, but it did.`);
  }

  return { id: polygonId, points: polygonPoints };
}
