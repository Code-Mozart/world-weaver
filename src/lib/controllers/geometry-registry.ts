import { VectorMath } from "$lib/math/vector-math";
import type { Geometry, Network, Point, Polygon } from "$lib/types/world";

export class GeometryRegistry {
  protected points: Set<Point>;
  protected networks: Set<Network>;
  protected networkNodes: Set<Network.Node>;
  protected polygons: Set<Polygon>;

  protected selectedGeometry: Set<Geometry>;
  protected invisibleGeometry: Set<Geometry>;

  constructor(points: Set<Point>, networks: Set<Network>, networkNodes: Set<Network.Node>, polygons: Set<Polygon>) {
    this.points = points;
    this.networks = networks;
    this.networkNodes = networkNodes;
    this.polygons = polygons;

    this.selectedGeometry = new Set();
    this.invisibleGeometry = new Set();
  }

  public isInvisible(geometry: Geometry): boolean {
    return this.invisibleGeometry.has(geometry);
  }

  public isSelected(geometry: Geometry): boolean {
    return this.selectedGeometry.has(geometry);
  }

  get selectionCount(): number {
    return this.selectedGeometry.size;
  }

  get selection(): Geometry[] {
    return [...this.selectedGeometry];
  }

  public setSelection(geometry: Geometry[]) {
    this.selectedGeometry.clear();
    geometry.forEach(geometry => this.selectedGeometry.add(geometry));
  }

  public getInBox(startX: number, startY: number, endX: number, endY: number): Geometry[] {
    return [...this.points].filter(
      point => point.x >= startX && point.x <= endX && point.y >= startY && point.y <= endY,
    );
  }

  public getNearestPoint(x: number, y: number, maxDistance?: number): Point | null {
    const nearest = this.getPointsByDistance(x, y).at(0);
    if (nearest !== undefined && maxDistance !== undefined) {
      const maxDistanceSqr = maxDistance * maxDistance;
      return nearest.sqrDistance <= maxDistanceSqr ? nearest.point : null;
    }
    return nearest?.point ?? null;
  }

  protected getPointsByDistance(queryX: number, queryY: number): SqrDistanceToPoint[] {
    const distancesSqr = new Array<SqrDistanceToPoint>(this.points.size);
    let i = 0;
    for (const point of this.points) {
      distancesSqr[i++] = { sqrDistance: VectorMath.sqrMagnitude(point.x - queryX, point.y - queryY), point };
    }
    distancesSqr.sort((a, b) => a.sqrDistance - b.sqrDistance);
    return distancesSqr;
  }

  public static fromMaps(
    pointsMap: Map<number, Point>,
    polygonsMap: Map<number, Polygon>,
    networksMap: Map<number, Network>,
  ): GeometryRegistry {
    return new GeometryRegistry(
      new Set(pointsMap.values()),
      new Set(networksMap.values()),
      new Set(networksMap.values().flatMap(network => network.nodes.values())),
      new Set(polygonsMap.values()),
    );
  }
}

interface SqrDistanceToPoint {
  sqrDistance: number;
  point: Point;
}
