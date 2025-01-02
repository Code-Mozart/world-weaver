import { database } from "$lib/database.server";
import type { PointsInPolygons, Polygon as PolygonRow } from "$lib/types/database-wrappers";
import type { Polygon } from "$lib/types/world";
import type { Polygon as APIPolygon } from "$lib/types/api/world";

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

export function constructPolygonsWithIdReferences(
  polygonRows: PolygonRow[],
  pointsInPolygons: PointsInPolygons[],
): Map<number, APIPolygon> {
  return new Map(
    polygonRows.map(polygonRow => [polygonRow.id, constructPolygonWithIdReferences(polygonRow, pointsInPolygons)]),
  );
}

export function getPolygonOrThrow(map: Map<number, Polygon>, key: number): Polygon {
  const polygon = map.get(key);
  if (polygon === undefined) {
    throw new Error(`Polygon with id ${key} does not exist.`);
  }
  return polygon;
}

function constructPolygonWithIdReferences(
  polygonRow: PolygonRow,
  pointsInPolygons: PointsInPolygons[],
): APIPolygon {
  const polygonId = polygonRow.id;
  const edges = new Map(pointsInPolygons.filter(mappingRow => mappingRow.polygonId === polygonId).map(row => [row.pointId, row.nextPointId]));

  function getNextPoint(edges: Map<number, number | null>, pointId: number): number | null {
    const nextPointId = edges.get(pointId);
    if (nextPointId === undefined) {
      throw new Error(`The point ${pointId} on the polygon ${polygonId} was expected to have a next point, \
                       but did not (There is no such row in the polygons-to-points table)`);
    }
    return nextPointId;
  }

  const pointIds = new Array<number>(edges.size);
  let i = 0;
  for (let pointId: number | null = polygonRow.startPointId; pointId !== null; pointId = getNextPoint(edges, pointId)) {
    pointIds[i++] = pointId;
  }

  if (i < edges.size) {
    throw new Error(`The point ${pointIds[i - 1]} was expected to have a next point, but did not`);
  }

  return { id: polygonId, pointIds };
}
