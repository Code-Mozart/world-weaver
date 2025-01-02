import type { WorldDocument } from "$lib/types/documents/world-document";
import type { Coastline, Mountain, River, World } from "$lib/types/world";

export class EditorWorld implements World {
    cuid: string;
    worldDocument: WorldDocument;
    coastlines: Coastline[];
    rivers: River[];
    mountains: Mountain[];

    constructor(
        cuid: string,
        worldDocument: WorldDocument,
        coastlines: Coastline[],
        rivers: River[],
        mountains: Mountain[],
    ) {
        this.cuid = cuid;
        this.worldDocument = worldDocument;
        this.coastlines = coastlines;
        this.rivers = rivers;
        this.mountains = mountains;
    }
}