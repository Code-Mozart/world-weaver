import type { Network, Point, Polygon } from "$lib/types/world";

export class GeometryRegistry {
    points: Set<Point>
    networks: Set<Network>
    networkNodes: Set<Network.Node>
    polygons: Set<Polygon>

    constructor(points: Set<Point>, networks: Set<Network>, networkNodes: Set<Network.Node>, polygons: Set<Polygon>) {
        this.points = points;
        this.networks = networks;
        this.networkNodes = networkNodes;
        this.polygons = polygons;
    }
}