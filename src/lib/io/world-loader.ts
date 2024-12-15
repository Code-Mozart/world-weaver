import { database } from "$lib/database";
import { type WorldDocument } from "$lib/types/documents/world-document";
import { GroundType } from "$lib/types/ground-type";
import type { World } from "$lib/types/world";
import type { Coastline, Document } from "@prisma/client";

/**
 * Loads the world from the database
 */
export async function loadWorld(cuid: string): Promise<World> {
    const allDocuments = await database.selectFrom("Document").where("worldCuid", "=", cuid).selectAll().execute();
    const worldDocument = loadWorldDocument(allDocuments);

    const coastlines = await prisma.coastline.findMany({
        where: { worldCuid: cuid },
        include: {
            Shape: {
                include: {
                    Nodes: true
                }
            }
        }
    });
    const rivers = await prisma.river.findMany({
        where: { worldCuid: cuid },
        include: {
            Path: true
        }
    })
    const mountains = await prisma.mountain.findMany({
        where: { worldCuid: cuid },
        include: {
            Path: true
        }
    });

    const polygonIds = coastlines.map((coastline) => coastline.Shape.id);

    return {
        cuid,

        worldDocument,

        coastlines,
        rivers,
        mountains
    };
}

/**
 * Validates and deserializes the world document json.
 * @param {Document[]} documents All documents associated with the world CUID
 */
function loadWorldDocument(documents: Document[]): WorldDocument {
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
    })

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
        groundType: groundType
    };
}

function findWorldDocument(documents: Document[]): Document {
    const worldDocumentRow = documents.find((document) => document.name === "world");
    if (worldDocumentRow === undefined) {
        throw createLoadError("World document not found for this CUID");
    }
    return worldDocumentRow;
}

function createLoadError(message: string): Error {
    return new Error("An error occurred while loading the world: " + message);
}