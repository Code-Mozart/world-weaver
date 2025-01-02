import { database } from "$lib/database.server";
import type {
  Network as NetworkRow,
  NetworkNode as NetworkNodeRow,
  NetworkEdges as NetworkEdgesRow,
} from "$lib/types/database-wrappers";
import type { Network as APINetwork } from "$lib/types/api/world";
import type { Network } from "$lib/types/world";

interface HasNetworkProperty {
  networkId: number;
}

interface LoadNetworksResult {
  networkRows: NetworkRow[];
  networkNodeRows: NetworkNodeRow[];
  networkEdgeRows: NetworkEdgesRow[];
}
export async function loadNetworks(...args: HasNetworkProperty[]): Promise<LoadNetworksResult> {
  const networkIds = args.map(row => row.networkId);
  const networks = await database.selectFrom("Network").where("id", "in", networkIds).selectAll().execute();

  const networkNodes = await database
    .selectFrom("NetworkNode")
    .where("networkId", "in", networkIds)
    .selectAll()
    .execute();
  const networkNodeIds = networkNodes.map(row => row.id);

  validateNetworkEdges(networkNodeIds);

  const networkEdges = await database
    .selectFrom("NetworkEdges")
    .where("fromNodeId", "in", networkNodeIds)
    .selectAll()
    .execute();

  return {
    networkRows: networks,
    networkNodeRows: networkNodes,
    networkEdgeRows: networkEdges,
  };
}

export function constructNetworksWithIdReferences(
  networkRows: NetworkRow[],
  networkNodeRows: NetworkNodeRow[],
  networkEdgeRows: NetworkEdgesRow[],
): Map<number, APINetwork> {
  return new Map(
    networkRows.map(networkRow => [
      networkRow.id,
      constructNetworkWithIdReferences(networkRow, networkNodeRows, networkEdgeRows),
    ]),
  );
}

async function validateNetworkEdges(networkNodeIds: number[]) {
  // Check if there are edges connecting to nodes that do not have the same network id
  // This should be a database constraint/trigger
  //   -> See migration 20241217225116_check_edges_connect_only_nodes_of_same_network
  //      unfortunately, it doesn't work for some reason

  const invalidEdges = await database
    .selectFrom("NetworkEdges")
    .innerJoin("NetworkNode as fromNetworkNode", join =>
      join.onRef("fromNetworkNode.id", "=", "NetworkEdges.fromNodeId").on("fromNetworkNode.id", "in", networkNodeIds),
    )
    .innerJoin("NetworkNode as toNetworkNode", join =>
      join.onRef("toNetworkNode.id", "=", "NetworkEdges.toNodeId").on("toNetworkNode.id", "in", networkNodeIds),
    )
    .whereRef("fromNetworkNode.networkId", "!=", "toNetworkNode.networkId")
    .select([
      "NetworkEdges.fromNodeId",
      "fromNetworkNode.networkId as fromNetworkId",
      "NetworkEdges.toNodeId",
      "toNetworkNode.networkId as toNetworkId",
    ])
    .execute();

  if (invalidEdges.length == 0) return;

  throw new Error(`Invalid edges found: ${JSON.stringify(invalidEdges)}`);
}

function constructNetworkWithIdReferences(
  networkRow: NetworkRow,
  nodeRows: NetworkNodeRow[],
  edgeRows: NetworkEdgesRow[],
): APINetwork {
  const networkId = networkRow.id;
  const nodeRowsInNetwork = nodeRows.filter(row => row.networkId == networkId);
  const nodesMap = new Map(nodeRowsInNetwork.map(constructNetworkNodeWithIdReferences));

  // We only need to check the "from" nodes, as the "to" nodes are guaranteed
  // to always be in the same network
  const edgesInNetwork = edgeRows.filter(edge => edge.fromNodeId in nodeRowsInNetwork);

  return {
    id: networkId,
    nodes: nodesMap,
    edges: edgesInNetwork
  };
}

function constructNetworkNodeWithIdReferences(row: NetworkNodeRow): [number, APINetwork.Node] {
  return [row.id, { id: row.id, pointId: row.pointId }];
}

function getNodeOrThrow(nodesMap: Map<number, Network.Node>, id: number): Network.Node {
  const node = nodesMap.get(id);
  if (node === undefined) {
    throw new Error(`Node with id ${id} does not exist within the network`);
  }
  return node;
}

export function getNetworkOrThrow(networks: Map<number, Network>, id: number): Network {
  const network = networks.get(id);
  if (network === undefined) {
    throw new Error(`Network with id ${id} does not exist`);
  }
  return network;
}
