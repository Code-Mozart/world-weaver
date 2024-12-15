import type { GroundType } from "$lib/types/ground-type";

export interface WorldDocument {
    // From the world document (json)
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    authors: string[];
    // ---
    groundType: GroundType;
}
