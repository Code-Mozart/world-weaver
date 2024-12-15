import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Coastline = {
    id: Generated<number>;
    worldCuid: string;
    polygonId: number;
    groundType: number;
    name: string | null;
};
export type Document = {
    id: Generated<number>;
    worldCuid: string;
    name: string;
    jsonData: string;
};
export type ExtraInformation = {
    id: Generated<number>;
    data: string;
};
export type Mountain = {
    id: Generated<number>;
    worldCuid: string;
    name: string | null;
};
export type Node = {
    id: Generated<number>;
    x: number;
    y: number;
};
export type NodesOnPaths = {
    nodeId: number;
    nextNodeId: number | null;
    pathId: number;
};
export type NodesOnPolygons = {
    nodeId: number;
    nextNodeId: number | null;
    polygonId: number;
};
export type Path = {
    id: Generated<number>;
    riverId: number | null;
    mountainId: number | null;
};
export type PathLinks = {
    A: number;
    B: number;
};
export type Polygon = {
    id: Generated<number>;
};
export type River = {
    id: Generated<number>;
    worldCuid: string;
    name: string | null;
};
export type DB = {
    _PathLinks: PathLinks;
    Coastline: Coastline;
    Document: Document;
    ExtraInformation: ExtraInformation;
    Mountain: Mountain;
    Node: Node;
    NodesOnPaths: NodesOnPaths;
    NodesOnPolygons: NodesOnPolygons;
    Path: Path;
    Polygon: Polygon;
    River: River;
};
