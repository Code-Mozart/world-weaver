import * as SchemaBuilder from "$lib/json-schema-builder";

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
