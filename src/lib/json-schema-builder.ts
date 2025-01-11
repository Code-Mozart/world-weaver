import type { JsonArray, JsonObject } from "$lib/types/json";
import type {
  JsonObjectOrCompositionSchema,
  JsonObjectPropertiesSchema,
  JsonObjectSchema,
} from "$lib/types/json-schema";

interface ArrayOptions {
  minItems?: number;
  maxItems?: number;
}

export function array<T extends JsonObjectOrCompositionSchema>(itemSchema: T, options?: ArrayOptions) {
  return {
    type: "array" as const,
    items: itemSchema,
    ...options,
  };
}

interface ObjectOptions<AdditionalPropertiesType extends boolean | JsonObject> {
  additionalProperties?: AdditionalPropertiesType;
  required?: string[];
}

export function object<
  PropertiesType extends JsonObjectPropertiesSchema,
  AdditionalPropertiesType extends boolean | JsonObject,
>(
  properties: PropertiesType,
  {
    additionalProperties = false as AdditionalPropertiesType,
    ...options
  }: ObjectOptions<AdditionalPropertiesType> = {},
) {
  const required = options.required ?? Object.keys(properties);

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
 * For now this always sets `unevaluatedProperties: false`.
 */
export function allOf<T extends JsonObjectOrCompositionSchema[]>(...schemas: [...T]) {
  if (schemas.length === 0) {
    throw new Error("allOf must have at least one schema");
  }

  if (areAllObjectSchemas(schemas) && haveMatchingAdditionalPropertiesValue(schemas)) {
    const properties = Object.assign({}, ...schemas.map((schema: JsonObjectSchema) => schema.properties));
    const required = Object.assign([], ...schemas.map((schema: JsonObjectSchema) => schema.required));
    const additionalProperties = schemas[0].additionalProperties;

    return {
      type: "object" as const,
      properties,
      required,
      additionalProperties,
    };
  } else {
    return {
      allOf: recursivelyAllowAdditionalProperties(schemas),
      unevaluatedProperties: false,
    };
  }
}

export function oneOf<T extends JsonObjectOrCompositionSchema[]>(...schemas: [...T]) {
  return {
    oneOf: schemas,
  };
}

function areAllObjectSchemas(schemas: JsonObjectOrCompositionSchema[]): schemas is JsonObjectSchema[] {
  return schemas.every(schema => "type" in schema && schema.type === "object");
}

function haveMatchingAdditionalPropertiesValue<T extends JsonObjectOrCompositionSchema[]>(schemas: T) {
  return schemas
    .slice(1)
    .every(
      schema =>
        "additionalProperties" in schema &&
        "additionalProperties" in schemas[0] &&
        schema.additionalProperties === schemas[0].additionalProperties,
    );
}

function recursivelyAllowAdditionalProperties<T extends JsonObjectOrCompositionSchema[]>(schemas: [...T]) {
  function inObject<T extends JsonObjectOrCompositionSchema>(schema: T): T {
    if ("type" in schema && schema.type === "object") {
      return {
        ...(JSON.parse(JSON.stringify(schema)) as T),
        additionalProperties: true,
      };
    } else if ("oneOf" in schema) {
      return {
        oneOf: inArray(schema.oneOf),
        unevaluatedProperties: false,
      } as T;
    } else if ("anyOf" in schema) {
      throw new Error("'anyOf' is not supported");
    } else {
      // this should have already been set correctly, if the builder was used
      return schema;
    }
  }

  function inArray<T extends JsonObjectOrCompositionSchema[]>(schemas: [...T]) {
    return schemas.map(inObject);
  }

  return inArray(schemas);
}
