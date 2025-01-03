import type { Network, Point, Polygon } from "$lib/types/world";

export class GeometryRegistry {
  points: Set<Point>;
  networks: Set<Network>;
  networkNodes: Set<Network.Node>;
  polygons: Set<Polygon>;

  constructor(points: Set<Point>, networks: Set<Network>, networkNodes: Set<Network.Node>, polygons: Set<Polygon>) {
    this.points = points;
    this.networks = networks;
    this.networkNodes = networkNodes;
    this.polygons = polygons;
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
