import { database } from "$lib/database.server";
import type {
  Coastline as CoastlineRow,
  River as RiverRow,
  Mountain as MountainRow,
  Document,
} from "$lib/types/database-wrappers";
import { type WorldDocument } from "$lib/types/documents/world-document";
import { GroundType } from "$lib/types/ground-type";
import type { World as APIWorld, Coastline as APICoastline, River as APIRiver, Mountain as APIMountain } from "$lib/types/api/world";
import type { Selectable } from "kysely";
import { constructNetworksWithIdReferences, loadNetworks } from "$lib/orm/network-loader";
import { constructPolygonsWithIdReferences, loadPolygons } from "$lib/orm/polygon-loader";
import { loadPoints } from "$lib/orm/point-loader";
import { toEnum } from "$lib/util/enum-helpers";

/**
 * Loads the world from the database into an API world (that uses id's and does not rely
 * on POJO identity for relations).
 * 
 * @param cuid {string} - The CUID of the world whose data should be loaded.
 */
export async function loadWorldFromDatabase(cuid: string): Promise<APIWorld> {
  const allDocuments = await database.selectFrom("Document").where("worldCuid", "=", cuid).selectAll().execute();
  const worldDocument = loadWorldDocument(allDocuments);

  // 1. Load all the world data by matching the world CUID

  const coastlineRows = await database.selectFrom("Coastline").where("worldCuid", "=", cuid).selectAll().execute();
  const riverRows = await database.selectFrom("River").where("worldCuid", "=", cuid).selectAll().execute();
  const mountainRows = await database.selectFrom("Mountain").where("worldCuid", "=", cuid).selectAll().execute();

  // 2. Load all the geometry data by collecting the IDs from the world data

  const { polygonRows, pointsInPolygons } = await loadPolygons(...coastlineRows);
  const { networkRows, networkNodeRows, networkEdgeRows } = await loadNetworks(...riverRows, ...mountainRows);

  // 3. Construct the corresponding JSON serializable data, now that we have all the data from the database loaded up
  //    This data will not rely on POJO identity for relations but use numeric id's and maps.

  // We should not need to load the points from the polygons 'nextPointId' column, because they should always
  // be included as 'pointId' for some other row in the 'PointsInPolygons' table
  const pointsMap = await loadPoints(...networkNodeRows, ...pointsInPolygons);

  const polygonMap = constructPolygonsWithIdReferences(polygonRows, pointsInPolygons);
  const networkMap = constructNetworksWithIdReferences(networkRows, networkNodeRows, networkEdgeRows);

  const coastlines = coastlineRows.map(coastlineRow => constructCoastlineWithIdReferences(coastlineRow));
  const rivers = riverRows.map(riverRow => constructRiverWithIdReferences(riverRow));
  const mountains = mountainRows.map(mountainRow => constructMountainWithIdReferences(mountainRow));

  return {
    points: pointsMap,
    polygons: polygonMap,
    networks: networkMap,

    coastlines,
    rivers,
    mountains,

    worldDocument,
  }
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
  const groundType = toEnum(parsed.groundType, GroundType);
  if (groundType === undefined)
    throw createLoadError(`World document groundType "${parsed.groundType.toUpperCase()}" is not a valid ground type`);

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

function constructCoastlineWithIdReferences(row: CoastlineRow): APICoastline {
  return {
    id: row.id,
    polygonId: row.polygonId,
    groundType: GroundType[row.groundType.toUpperCase() as keyof typeof GroundType],
    name: row.name,
  };
}

function constructRiverWithIdReferences(row: RiverRow): APIRiver {
  return {
    id: row.id,
    networkId: row.networkId,
    name: row.name,
  };
}

function constructMountainWithIdReferences(row: MountainRow): APIMountain {
  return {
    id: row.id,
    networkId: row.networkId,
    name: row.name,
  };
}

function createLoadError(message: string): Error {
  return new Error("An error occurred while loading the world: " + message);
}
