import { EditorWorld } from "$lib/controllers/editor-world";
import { GeometryRegistry } from "$lib/controllers/geometry-registry";
import type {
  World as APIWorld,
  Polygon as APIPolygon,
  Network as APINetwork,
  Coastline as APICoastline,
  River as APIRiver,
  Mountain as APIMountain,
} from "$lib/types/api/world";
import type { Coastline, Network, Point, Polygon, River, Mountain } from "$lib/types/world";
import { transformValues } from "$lib/util/map-extensions";

export function loadWorldIntoPOJOs(cuid: string, apiWorld: APIWorld): EditorWorld {
  // 1. Construct geometry POJOs
  const pointsMap = transformValues(apiWorld.points, ({ id, x, y }) => ({ id, x, y, temporaryCuid: null }));
  const polygonsMap = transformValues(apiWorld.polygons, apiPolygon => {
    return loadPolygonIntoPOJOs(pointsMap, apiPolygon);
  });
  const networksMap = transformValues(apiWorld.networks, apiNetwork => {
    return loadNetworkIntoPOJOs(pointsMap, apiNetwork);
  });

  // 2. Construct world object POJOs
  const coastlines = loadCoastlinesIntoPOJOs(polygonsMap, apiWorld.coastlines);
  const rivers = loadRiversIntoPOJOs(networksMap, apiWorld.rivers);
  const mountains = loadMountainsIntoPOJOs(networksMap, apiWorld.mountains);

  // 3. Construct the geometry registry
  const geometryRegistry = GeometryRegistry.fromMaps(pointsMap, polygonsMap, networksMap);

  return new EditorWorld(cuid, apiWorld.worldDocument, coastlines, rivers, mountains, geometryRegistry);
}

function loadCoastlinesIntoPOJOs(polygonsMap: Map<number, Polygon>, apiCoastlines: APICoastline[]): Coastline[] {
  return apiCoastlines.map(apiCoastline => {
    const polygon = getPolygonOrThrow(polygonsMap, apiCoastline.polygonId);
    return {
      id: apiCoastline.id,
      temporaryCuid: null,

      shape: polygon,
      groundType: apiCoastline.groundType,

      name: apiCoastline.name,
    };
  });
}

function loadRiversIntoPOJOs(networksMap: Map<number, Network>, apiRivers: APIRiver[]): River[] {
  return apiRivers.map(apiRiver => {
    const network = getNetworkOrThrow(networksMap, apiRiver.networkId);
    return {
      id: apiRiver.id,
      temporaryCuid: null,

      path: network,

      name: apiRiver.name,
    };
  });
}

function loadMountainsIntoPOJOs(networksMap: Map<number, Network>, apiMountains: APIMountain[]): Mountain[] {
  return apiMountains.map(apiMountain => {
    const network = getNetworkOrThrow(networksMap, apiMountain.networkId);
    return {
      id: apiMountain.id,
      temporaryCuid: null,

      path: network,

      name: apiMountain.name,
    };
  });
}

function loadPolygonIntoPOJOs(pointsMap: Map<number, Point>, apiPolygon: APIPolygon): Polygon {
  return {
    id: apiPolygon.id,
    temporaryCuid: null,

    points: apiPolygon.pointIds.map(pointId => getPointOrThrow(pointsMap, pointId)),
  };
}

function loadNetworkIntoPOJOs(pointsMap: Map<number, Point>, apiNetwork: APINetwork): Network {
  // 1. Construct all nodes without any edges
  const nodesMap = transformValues(apiNetwork.nodes, ({ id, pointId }) => {
    return {
      id,
      temporaryCuid: null,

      point: getPointOrThrow(pointsMap, pointId),
      nextNodes: [],
    };
  });

  // 2. Add edges
  apiNetwork.edges.forEach(edge => {
    const fromNode = getNodeOrThrow(nodesMap, edge.fromNodeId, apiNetwork.id);
    const toNode = getNodeOrThrow(nodesMap, edge.toNodeId, apiNetwork.id);
    fromNode.nextNodes.push(toNode);
  });

  return {
    id: apiNetwork.id,
    temporaryCuid: null,
    nodes: [...nodesMap.values()],
  };
}

function getPointOrThrow(points: Map<number, Point>, pointId: number): Point {
  const point = points.get(pointId);
  if (point === undefined) {
    throw new Error(`Point with id ${pointId} does not exist`);
  }
  return point;
}

function getNodeOrThrow(nodesMap: Map<number, Network.Node>, id: number, networkId: number): Network.Node {
  const node = nodesMap.get(id);
  if (node === undefined) {
    throw new Error(`Node with id ${id} does not exist within the network with id ${networkId}`);
  }
  return node;
}

function getPolygonOrThrow(polygons: Map<number, Polygon>, polygonId: number): Polygon {
  const polygon = polygons.get(polygonId);
  if (polygon === undefined) {
    throw new Error(`Polygon with id ${polygonId} does not exist`);
  }
  return polygon;
}

function getNetworkOrThrow(networks: Map<number, Network>, networkId: number): Network {
  const network = networks.get(networkId);
  if (network === undefined) {
    throw new Error(`Network with id ${networkId} does not exist`);
  }
  return network;
}
