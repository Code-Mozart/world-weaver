import type { SetPointPositions } from "./set-point-positions";
import * as SchemaBuilder from "$lib/json-schema/json-schema-builder";
import { Schema as BaseDeltaSchema } from "$lib/deltas/base-delta";
import { Schema as SetPointPositionsSchema } from "$lib/deltas/set-point-positions";

export type Delta = SetPointPositions /* | ... */;

export const Schema = SchemaBuilder.object({
  delta: BaseDeltaSchema,
  data: SchemaBuilder.oneOf(SetPointPositionsSchema),
});
