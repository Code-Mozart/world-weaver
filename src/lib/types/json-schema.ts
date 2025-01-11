import type { JsonObject } from "$lib/types/json";

export interface JsonNullable {
  nullable?: boolean;
}

export interface JsonObjectSchema extends JsonNullable {
  type: "object";
  properties: JsonObjectPropertiesSchema;
  required: string[];
  additionalProperties: boolean | JsonObject;
}

export interface JsonArraySchema extends JsonNullable {
  type: "array";
  items: JsonObjectOrCompositionSchema;
  minItems?: number;
  maxItems?: number;
}

export interface JsonNullSchema {
  type: "null";
}

export interface JsonBooleanSchema extends JsonNullable {
  type: "boolean";
  // constrains...
}

export interface JsonIntegerSchema extends JsonNullable {
  type: "integer";
  enum?: number[];
  // constrains...
}

export interface JsonNumberSchema extends JsonNullable {
  type: "number";
  enum?: number[];
  // constrains...
}

export interface JsonStringSchema extends JsonNullable {
  type: "string";
  enum?: string[];
  format?: string;
  // constrains...
}

export type JsonPrimitiveSchema =
  | JsonNullSchema
  | JsonBooleanSchema
  | JsonIntegerSchema
  | JsonNumberSchema
  | JsonStringSchema;

export interface JsonObjectCompositionSchema {
  unevaluatedProperties?: boolean;
}

export interface JsonAllOfSchema extends JsonObjectCompositionSchema {
  allOf: JsonObjectOrCompositionSchema[];
}

export interface JsonOneOfSchema extends JsonObjectCompositionSchema {
  oneOf: JsonObjectOrCompositionSchema[];
}

export type JsonObjectOrCompositionSchema = JsonObjectSchema | JsonAllOfSchema | JsonOneOfSchema;

export type JsonObjectPropertiesSchema = { [key: string]: JsonSchemaPartial };

export type JsonSchemaPartial = JsonArraySchema | JsonObjectSchema | JsonPrimitiveSchema;
