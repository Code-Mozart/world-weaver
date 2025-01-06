import * as SchemaBuilder from "$lib/json-schema-builder";

export const AnyIdentifierSchema = SchemaBuilder.oneOf([
  SchemaBuilder.object({
    id: SchemaBuilder.number(),
  }),
  SchemaBuilder.object({
    temporaryCUID: SchemaBuilder.string(),
  }),
]);

export const Vector2Schema = SchemaBuilder.object({
  x: SchemaBuilder.number(),
  y: SchemaBuilder.number(),
});
