import type { ObjectCompositionSchema, ObjectSchema, ValueSchema } from "$lib/types/json-schema";

/**
 * Recursively checks if the schema is an object composition schema (i.e. an object or a composition of
 * object composition schemas).
 */
export function isObjectCompositionSchema(schema: ValueSchema): schema is ObjectCompositionSchema {
  if (!("type" in schema)) {
    return false;
  }

  if (schema.type !== "object") {
    return false;
  }

  if (isObjectSchema(schema)) {
    return true;
  } else if ("allOf" in schema) {
    return schema.allOf.every(schema => isObjectCompositionSchema(schema));
  } else if ("oneOf" in schema) {
    return schema.oneOf.every(schema => isObjectCompositionSchema(schema));
  } else {
    throw new Error("Unknown schema type, (`anyOf`, etc.) is not yet supported");
  }
}

export function hasOneOf(schemas: ValueSchema[]): boolean {
  return schemas.some(schema => {
    if ("oneOf" in schema) {
      return true;
    } else if ("allOf" in schema) {
      return hasOneOf(schema.allOf);
    } else {
      return false;
    }
  });
}

export function isObjectSchema(schema: ValueSchema): schema is ObjectSchema {
  return "properties" in schema;
}
