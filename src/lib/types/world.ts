import type { WorldDocument } from "./documents/world-document";
import type { GroundType } from "./ground-type";

// Abstract Types

export interface Record {
  id: number;
  temporaryCuid: string | null;
}

// defines any point on the map
// this way a coastline vertex and a river mouth can share the same point for example
export interface Point extends Record {
  x: number;
  y: number;
}

// defines any area on the map with definite boundaries
// nodes are in clockwise order
export interface Polygon {
  id: number;
  temporaryCuid: string | null;

  points: Point[];
}

export namespace Network {
  // defines a single node in a network
  export interface Node extends Record {
    point: Point;
    nextNodes: Network.Node[];
  }
}

// defines any network (e.g path) on the map
// networks must always be fully connected (single component)
export interface Network extends Record {
  nodes: Network.Node[];
}

// World Object Type

export interface Coastline extends Record {
  shape: Polygon;
  groundType: GroundType;

  // user information
  name: string | null;
}

export interface River extends Record {
  path: Network;

  // user information
  name: string | null;
}

export interface Mountain extends Record {
  path: Network;

  // user information
  name: string | null;
}

// World Type

export interface World {
  cuid: string;

  // Documents
  worldDocument: WorldDocument;
  // other documents go here ...

  // Physical world data
  coastlines: Coastline[];
  rivers: River[];
  mountains: Mountain[];
}

// Unions

export type Geometry = Point | Network | Network.Node | Polygon;
export type WorldObject = Coastline | River | Mountain;
