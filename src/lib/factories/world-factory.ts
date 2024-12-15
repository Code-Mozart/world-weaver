import type { WorldDocument } from "$lib/types/documents/world-document";
import { GroundType } from "$lib/types/ground-type";
import type { World } from "$lib/types/world";
import { createId } from "@paralleldrive/cuid2";

export namespace WorldFactory {
    /**
     * Creates a new empty world.
     */
    export function createEmpty(): World {
        return {
            cuid: createId(),

            worldDocument: createEmptyWorldDocument(),

            coastlines: [],
            rivers: [],
            mountains: []
        };
    }

    export function createEmptyWorldDocument(): WorldDocument {
        return {
            id: 0,
            name: "world",
            createdAt: new Date(),
            updatedAt: new Date(),
            authors: [],
            groundType: GroundType.Land
        };
    }
}