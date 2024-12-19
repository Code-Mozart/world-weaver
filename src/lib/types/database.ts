import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Coastline = {
    id: Generated<number>;
    worldCuid: string;
    polygonId: number;
    groundType: string;
    name: string | null;
};
export type Document = {
    id: Generated<number>;
    worldCuid: string;
    name: string;
    jsonData: string;
};
export type Mountain = {
    id: Generated<number>;
    worldCuid: string;
    networkId: number;
    name: string | null;
};
export type Network = {
    id: Generated<number>;
};
export type NetworkEdges = {
    fromNodeId: number;
    toNodeId: number;
};
export type NetworkNode = {
    id: Generated<number>;
    pointId: number;
    networkId: number;
};
export type Point = {
    id: Generated<number>;
    x: number;
    y: number;
};
export type PointsInPolygons = {
    polygonId: number;
    pointId: number;
    nextPointId: number | null;
};
export type Polygon = {
    id: Generated<number>;
    startPointId: number;
};
export type River = {
    id: Generated<number>;
    worldCuid: string;
    networkId: number;
    name: string | null;
};
export type DB = {
    Coastline: Coastline;
    Document: Document;
    Mountain: Mountain;
    Network: Network;
    NetworkEdges: NetworkEdges;
    NetworkNode: NetworkNode;
    Point: Point;
    PointsInPolygons: PointsInPolygons;
    Polygon: Polygon;
    River: River;
};
