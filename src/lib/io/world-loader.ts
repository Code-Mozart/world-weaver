import { database } from "$lib/database";
import type {
  Coastline as CoastlineRow,
  River as RiverRow,
  Mountain as MountainRow,
  Document,
} from "$lib/types/database-wrappers";
import { type WorldDocument } from "$lib/types/documents/world-document";
import { GroundType } from "$lib/types/ground-type";
import type { Coastline, Network, Mountain, River, Polygon, World } from "$lib/types/world";
import type { Selectable } from "kysely";
import { constructNetworks, getNetworkOrThrow, loadNetworks } from "./network-loader";
import { constructPolygons, getPolygonOrThrow, loadPolygons } from "./polygon-loader";
import { loadPoints } from "./point-loader";

/**
 * Loads the world from the database
 */
export async function loadWorld(cuid: string): Promise<World> {
  const allDocuments = await database.selectFrom("Document").where("worldCuid", "=", cuid).selectAll().execute();
  const worldDocument = loadWorldDocument(allDocuments);

  // 1. Load all the world data by matching the world CUID

  const coastlineRows = await database.selectFrom("Coastline").where("worldCuid", "=", cuid).selectAll().execute();
  const riverRows = await database.selectFrom("River").where("worldCuid", "=", cuid).selectAll().execute();
  const mountainRows = await database.selectFrom("Mountain").where("worldCuid", "=", cuid).selectAll().execute();

  // 2. Load all the geometry data by collecting the IDs from the world data

  const { polygonRows, pointsInPolygons } = await loadPolygons(...coastlineRows);
  const { networkRows, networkNodeRows, networkEdgeRows } = await loadNetworks(...riverRows, ...mountainRows);

  // We should not need to load the points from the polygons 'nextPointId' column, because they should always
  // be included as 'pointId' for some other row in the 'PointsInPolygons' table
  const pointsMap = await loadPoints(...networkNodeRows, ...pointsInPolygons);

  // 3. Construct the corresponding in-memory data, now that we have all the data from the database loaded up

  const polygonsMap = constructPolygons(polygonRows, pointsInPolygons, pointsMap);
  const networksMap = constructNetworks(networkRows, networkNodeRows, networkEdgeRows, pointsMap);

  // 4. Create the in-memory world objects

  const coastlines = coastlineRows.map(coastlineRow => constructCoastline(coastlineRow, polygonsMap));
  const rivers = riverRows.map(riverRow => constructRiver(riverRow, networksMap));
  const mountains = mountainRows.map(mountainRow => constructMountain(mountainRow, networksMap));

  return {
    cuid,

    worldDocument,

    coastlines,
    rivers,
    mountains,
  };
}

/**
 * Validates and deserializes the world document json.
 * @param {Document[]} documents All documents associated with the world CUID
 */
function loadWorldDocument(documents: Selectable<Document>[]): WorldDocument {
  const worldDocumentRow = findWorldDocument(documents);

  const parsed = JSON.parse(worldDocumentRow.jsonData);
  if (typeof parsed !== "object") {
    throw createLoadError("World document is not a valid JSON object");
  }

  if (!("id" in parsed)) throw createLoadError("World document is missing an ID");
  if (typeof parsed.id !== "number") throw createLoadError("World document ID is not a number");

  if (!("name" in parsed)) throw createLoadError("World document is missing a name");
  if (typeof parsed.name !== "string") throw createLoadError("World document name is not a string");

  if (!("createdAt" in parsed)) throw createLoadError("World document is missing a createdAt date");
  if (typeof parsed.createdAt !== "string") throw createLoadError("World document createdAt is not a string");
  const createdAt = new Date(parsed.createdAt);

  if (!("updatedAt" in parsed)) throw createLoadError("World document is missing an updatedAt date");
  if (typeof parsed.updatedAt !== "string") throw createLoadError("World document updatedAt is not a string");
  const updatedAt = new Date(parsed.updatedAt);

  if (!("authors" in parsed)) throw createLoadError("World document is missing an authors array");
  if (!Array.isArray(parsed.authors)) throw createLoadError("World document authors is not an array");
  parsed.authors.forEach((author: unknown, index: number) => {
    if (typeof author !== "string") throw createLoadError(`World document author at position ${index} is not a string`);
  });

  if (!("groundType" in parsed)) throw createLoadError("World document is missing a groundType");
  if (typeof parsed.groundType !== "string") throw createLoadError("World document groundType is not a string");
  const groundType = GroundType[parsed.groundType.toUpperCase() as keyof typeof GroundType];
  if (groundType === undefined) throw createLoadError("World document groundType is not a valid ground type");

  return {
    id: parsed.id,
    name: parsed.name,
    createdAt: createdAt,
    updatedAt: updatedAt,
    authors: parsed.authors,
    groundType: groundType,
  };
}

function findWorldDocument(documents: Document[]): Document {
  const worldDocumentRow = documents.find(document => document.name === "world");
  if (worldDocumentRow === undefined) {
    throw createLoadError("World document not found for this CUID");
  }
  return worldDocumentRow;
}

function constructCoastline(coastlineRow: CoastlineRow, polygonsMap: Map<number, Polygon>): Coastline {
  return {
    id: coastlineRow.id,
    shape: getPolygonOrThrow(polygonsMap, coastlineRow.polygonId),
    groundType: GroundType[coastlineRow.groundType.toUpperCase() as keyof typeof GroundType],
    name: coastlineRow.name,
  };
}

function constructRiver(riverRow: RiverRow, networksMap: Map<number, Network>): River {
  return {
    id: riverRow.id,
    path: getNetworkOrThrow(networksMap, riverRow.networkId),
    name: riverRow.name,
  };
}

function constructMountain(mountainRow: MountainRow, networksMap: Map<number, Network>): Mountain {
  return {
    id: mountainRow.id,
    path: getNetworkOrThrow(networksMap, mountainRow.networkId),
    name: mountainRow.name,
  };
}

function createLoadError(message: string): Error {
  return new Error("An error occurred while loading the world: " + message);
}
