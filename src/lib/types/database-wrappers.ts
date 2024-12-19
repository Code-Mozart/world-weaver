import type { Insertable, Selectable, Updateable } from "kysely";
import type {
  Document as DocumentTable,
  Coastline as CoastlineTable,
  Mountain as MountainTable,
  Network as NetworkTable,
  NetworkNode as NetworkNodeTable,
  NetworkEdges as NetworkEdgesTable,
  Point as PointTable,
  PointsInPolygons as PointsInPolygonsTable,
  Polygon as PolygonTable,
  River as RiverTable,
} from "$lib/types/database";

export type Coastline = Selectable<CoastlineTable>;
export type NewCoastline = Insertable<CoastlineTable>;
export type CoastlineUpdate = Updateable<CoastlineTable>;

export type Document = Selectable<DocumentTable>;
export type NewDocument = Insertable<DocumentTable>;
export type DocumentUpdate = Updateable<DocumentTable>;

export type Mountain = Selectable<MountainTable>;
export type NewMountain = Insertable<MountainTable>;
export type MountainUpdate = Updateable<MountainTable>;

export type Network = Selectable<NetworkTable>;
export type NewNetwork = Insertable<NetworkTable>;
export type NetworkUpdate = Updateable<NetworkTable>;

export type NetworkNode = Selectable<NetworkNodeTable>;
export type NewNetworkNode = Insertable<NetworkNodeTable>;
export type NetworkNodeUpdate = Updateable<NetworkNodeTable>;

export type NetworkEdges = Selectable<NetworkEdgesTable>;
export type NewNetworkEdges = Insertable<NetworkEdgesTable>;
export type NetworkEdgesUpdate = Updateable<NetworkEdgesTable>;

export type Point = Selectable<PointTable>;
export type NewPoint = Insertable<PointTable>;
export type PointUpdate = Updateable<PointTable>;

export type PointsInPolygons = Selectable<PointsInPolygonsTable>;
export type NewPointsInPolygons = Insertable<PointsInPolygonsTable>;
export type PointsInPolygonsUpdate = Updateable<PointsInPolygonsTable>;

export type Polygon = Selectable<PolygonTable>;
export type NewPolygon = Insertable<PolygonTable>;
export type PolygonUpdate = Updateable<PolygonTable>;

export type River = Selectable<RiverTable>;
export type NewRiver = Insertable<RiverTable>;
export type RiverUpdate = Updateable<RiverTable>;
