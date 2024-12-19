import type { WorldDocument } from "./documents/world-document";
import type { GroundType } from "./ground-type";

// Abstract Types

// defines any point on the map
// this way a coastline vertex and a river mouth can share the same point for example
export type Point = import("$lib/types/database-wrappers").Point;

// defines any area on the map with definite boundaries
// nodes are in clockwise order
export interface Polygon {
  id: number;
  points: Point[];
}

export namespace Network {
  // defines a single node in a network
  export interface Node {
    id: number;
    point: Point;
    nextNodes: Network.Node[];
  }
}

// defines any network (e.g path) on the map
// networks must always be fully connected (single component)
export interface Network {
  id: number;
  nodes: Network.Node[];
}

// World Object Type

export interface Coastline {
  id: number;
  shape: Polygon;
  groundType: GroundType;

  // user information
  name: string | null;
}

export interface River {
  id: number;
  path: Network;

  // user information
  name: string | null;
}

export interface Mountain {
  id: number;
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
