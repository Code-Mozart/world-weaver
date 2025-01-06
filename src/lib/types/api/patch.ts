import { Schema as DeltaSchema, type Delta } from "$lib/deltas/delta";
import * as SchemaBuilder from "$lib/json-schema-builder";

export interface RequestBody {
  author: {
    CUID: string;
  };
  deltas: Delta[];
}

export const RequestBodySchema = SchemaBuilder.object({
  author: SchemaBuilder.object({
    CUID: SchemaBuilder.string(),
  }),
  deltas: SchemaBuilder.array(DeltaSchema, { minItems: 1 }),
});
