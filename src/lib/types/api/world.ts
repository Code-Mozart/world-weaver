// Defines world types for the API that use id's for relations and do not rely
// on POJO identity.

import type { Point as PointRow } from "$lib/types/database-wrappers";
import type { WorldDocument } from "$lib/types/documents/world-document";
import type { GroundType } from "$lib/types/ground-type";

// Base

interface Record {
    id: number;
}

// Geometry

export type Point = PointRow;

export interface Polygon extends Record {
    pointIds: number[];
}

export namespace Network {
    export interface Node extends Record {
        pointId: number;
    }
    
    export interface Edge {
        fromNodeId: number;
        toNodeId: number;
    }
}

export interface Network extends Record {
    nodes: Map<number, Network.Node>;
    edges: Network.Edge[];
}

// World object

export interface Coastline extends Record {
    polygonId: number;
    groundType: GroundType;
    name: string | null;
}

export interface River extends Record {
    networkId: number
    name: string | null;
}

export interface Mountain extends Record {
    networkId: number
    name: string | null;
}

// World

export interface World {
    worldDocument: WorldDocument

    points: Map<number, Point>;
    polygons: Map<number, Polygon>;
    networks: Map<number, Network>;

    coastlines: Coastline[];
    rivers: River[];
    mountains: Mountain[];
}