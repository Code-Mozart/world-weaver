import * as SchemaBuilder from "$lib/json-schema/json-schema-builder";
import type { ObjectCompositionSchema, ValueSchema } from "$lib/types/json-schema";

export const Vector2Schema = SchemaBuilder.object({
  x: SchemaBuilder.number(),
  y: SchemaBuilder.number(),
});

/**
 * This does not allow additional properties. To include it
 * in an allOf, use `withAnyIdentifier`.
 */
export const AnyIdentifierSchema = SchemaBuilder.oneOf(
  SchemaBuilder.object({
    id: SchemaBuilder.integer(),
  }),
  SchemaBuilder.object({
    temporaryCUID: SchemaBuilder.string(),
  }),
);

export function withAnyIdentifier<T extends ObjectCompositionSchema>(schema: T) {
  const [combinedSchema1, ...combinedSchemas] = AnyIdentifierSchema.oneOf.map(identifierSchema =>
    SchemaBuilder.allOf(schema, identifierSchema),
  );
  return SchemaBuilder.oneOf(combinedSchema1, ...combinedSchemas);
}
