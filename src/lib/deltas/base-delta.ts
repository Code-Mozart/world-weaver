import type { EditorWorld } from "$lib/types/editor/world";
import type { Record } from "$lib/types/world";
import { createId } from "@paralleldrive/cuid2";
import * as SchemaBuilder from "$lib/json-schema-builder";

export enum DeltaType {
  SetWorldName = "World.Documents.WorldDocument.name.SET",
  AddAuthor = "World.Documents.WorldDocument.authors.ADD",
  ReplaceAuthor = "World.Documents.WorldDocument.authors.REPLACE",
  RemoveAuthor = "World.Documents.WorldDocument.authors.REMOVE",
  SetWorldGroundType = "World.Documents.WorldDocument.groundType.SET",

  CreateCoastline = "World.Coastlines.CREATE",
  DeleteCoastline = "World.Coastlines.DELETE",
  SetCoastlineGroundType = "World.Coastlines.groundType.SET",
  SetCoastlineName = "World.Coastlines.name.SET",

  CreateRiver = "World.Rivers.CREATE",
  DeleteRiver = "World.Rivers.DELETE",
  SetRiverName = "World.Rivers.name.SET",

  CreateMountain = "World.Mountains.CREATE",
  DeleteMountain = "World.Mountains.DELETE",
  SetMountainName = "World.Mountains.name.SET",

  SetPointPositions = "World.Points.positions.SET",

  InsertPolygonPoint = "World.Polygons.points.INSERT",
  RemovePolygonPoint = "World.Polygons.points.REMOVE",

  InsertNetworkEdge = "World.Networks.Edges.INSERT",
  RemoveNetworkEdge = "World.Networks.Edges.REMOVE",
}

export interface BaseDeltaData {
  CUID: string;
  createdAt: Date;
  type: string;
}

export abstract class BaseDelta {
  delta: BaseDeltaData;

  constructor(data: BaseDeltaData) {
    this.delta = data;
  }

  abstract apply(world: EditorWorld): void;
}

export type AnyIdentifier = { id: number } | { temporaryCUID: string };

export function createDelta(type: DeltaType): BaseDeltaData {
  return {
    CUID: createId(),
    createdAt: new Date(),
    type,
  };
}

export function getIdentifier(record: Record): AnyIdentifier {
  return record.temporaryCuid ? { temporaryCUID: record.temporaryCuid } : { id: record.id };
}

export const Schema = SchemaBuilder.object({
  CUID: SchemaBuilder.string(),
  createdAt: SchemaBuilder.datetime(),
  type: SchemaBuilder.enumeration(Object.values(DeltaType)),
});
