import type { JsonArray } from "$lib/types/json";
import type { ObjectSchema, ValueSchema } from "$lib/types/json-schema";
import { hasOneOf, isObjectSchema } from "$lib/json-schema/json-schema-queries";
import { haveMatchingValues } from "$lib/util/object-extensions";

const ONEOF_IN_ALLOF_ERROR_MESSAGE = `
An 'allOf' schema must not contain a 'oneOf' schema because this leads to a contradiction and
no JSON value will ever match. This is because the 'allOf' schema requires the 'oneOf' schema
to allow for additional properties (the additional properties in the 'allOf' schema), but if it
does then it would also allow for the properties in the other 'oneOf' schema alternatives and
more than one 'oneOf' schema would match.

To fix this problem make sure to have the 'allOf' schema be nested inside the 'oneOf' schema.
This unfortunately means that the 'allOf' schema will be used twice.

A later version should do this automatically.
`.replaceAll("\n", " ");

interface ArrayOptions {
  minItems?: number;
  maxItems?: number;
}

export function array<T extends ValueSchema>(itemSchema: T, options?: ArrayOptions) {
  return {
    type: "array" as const,
    items: itemSchema,
    ...options,
  };
}

interface ObjectOptions<Required extends string[], AdditionalPropertiesType extends boolean | ValueSchema> {
  additionalProperties?: AdditionalPropertiesType;
  required?: Required;
}

export function object<
  Properties extends Record<string, ValueSchema>,
  Required extends Extract<keyof Properties, string>[],
  AdditionalProperties extends boolean | ValueSchema,
>(
  properties: Properties,
  {
    additionalProperties = false as AdditionalProperties,
    ...options
  }: ObjectOptions<Required, AdditionalProperties> = {},
) {
  const required: Required = options.required ?? (Object.keys(properties) as Required);

  return {
    type: "object" as const,
    additionalProperties: additionalProperties,
    required: required,
    properties,
  };
}

interface ValueOptions {
  nullable: boolean;
}

export function integer(options: ValueOptions = { nullable: false }) {
  return {
    type: "integer" as const,
    ...options,
  };
}

export function number(options: ValueOptions = { nullable: false }) {
  return {
    type: "number" as const,
    ...options,
  };
}

export function string(options: ValueOptions = { nullable: false }) {
  return {
    type: "string" as const,
    ...options,
  };
}

export function enumeration<T extends JsonArray>(values: T, options: ValueOptions = { nullable: false }) {
  return {
    type: "string" as const,
    enum: values,
    ...options,
  };
}

export function datetime(options: ValueOptions = { nullable: false }) {
  return {
    type: "string" as const,
    format: "date-time" as const,
    ...options,
  };
}

/**
 * If all of the schemas are object composition schemas (i.e. objects or compositions of objects), then
 * it sets `additionalProperties: true` in each composition and sets `unevaluatedProperties: false` in
 * the `allOf` schema.
 */
export function allOf<T extends ValueSchema[]>(...schemas: NonEmptyArray<T[number]>) {
  if (
    schemas.every(isObjectSchema) &&
    haveMatchingValues(schemas, ["additionalProperties", "nullable"])
    // this may be written in another way, check the StackOverflow post: https://stackoverflow.com/questions/79349552/why-does-typescript-allow-invalid-keys-in-a-generic-function-after-type-narrowin
  ) {
    return mergeObjectSchemas(schemas);
  }

  if (hasOneOf(schemas)) {
    // TODO: automatically restructure the schema from
    //  allOf{ oneOf{ A, B, ... }, ... }
    // to
    //  oneOf{ allOf{ A, ... }, { allOf{ B, ... }, ... } }
    throw new Error(ONEOF_IN_ALLOF_ERROR_MESSAGE);
  }

  return {
    allOf: schemas.map(allowAdditionalProperties),
    unevaluatedProperties: false,
  };
}

export function oneOf<T extends ValueSchema[], U extends NonEmptyArray<T[number]>>(...schemas: U): { oneOf: U } {
  return {
    oneOf: schemas,
  };
}

function mergeObjectSchemas<T extends ObjectSchema[]>(schemas: [...T]) {
  const properties = Object.assign({}, ...schemas.map(schema => schema.properties));
  const required = Object.assign([], ...schemas.map(schema => schema.required));
  const additionalProperties = schemas[0].additionalProperties;
  const nullable = schemas[0].nullable;

  return {
    type: "object" as const,
    properties,
    required,
    additionalProperties,
    ...{ nullable },
  } as IntersectionOf<T> & ObjectSchema;
}

function allowAdditionalProperties<T extends ValueSchema>(schema: T): T {
  if ("allOf" in schema) {
    return {
      ...schema,
      allOf: schema.allOf.map(allowAdditionalProperties),
    };
  } else if ("oneOf" in schema) {
    return {
      ...schema,
      oneOf: schema.oneOf.map(allowAdditionalProperties),
    };
  } else if ("type" in schema && schema.type === "object") {
    return {
      ...schema,
      additionalProperties: true,
    };
  } else {
    return schema;
  }
}
