import type { WorldDocument } from "./documents/world-document";
import type { GroundType } from "./ground-type";

// Abstract Types

// defines any point on the map
// this way a coastline vertex and a river mouth can share the same point for example
export interface Point {
  id: number;
  temporaryCuid: string | null;

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
  export interface Node {
    id: number;
    temporaryCuid: string | null;

    point: Point;
    nextNodes: Network.Node[];
  }
}

// defines any network (e.g path) on the map
// networks must always be fully connected (single component)
export interface Network {
  id: number;
  temporaryCuid: string | null;

  nodes: Network.Node[];
}

// World Object Type

export interface Coastline {
  id: number;
  temporaryCuid: string | null;

  shape: Polygon;
  groundType: GroundType;

  // user information
  name: string | null;
}

export interface River {
  id: number;
  temporaryCuid: string | null;

  path: Network;

  // user information
  name: string | null;
}

export interface Mountain {
  id: number;
  temporaryCuid: string | null;

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
