// TYPES

export type ValueSchema =
  | CompositionSchema
  | UnionSchema
  | ObjectLikeSchema
  | ArraySchema
  | NullSchema
  | BooleanSchema
  | IntegerSchema
  | NumberSchema
  | StringSchema;
export type ObjectLikeSchema = DictionarySchema | ObjectSchema;
export type CompositionSchema = AllOfSchema | OneOfSchema;

// Unions are not supported, use `oneOf`
export type UnionSchema = never;

// HELPER INTERFACES

interface Nullable {
  nullable?: boolean;
}

interface Numeric {
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: boolean;
  exclusiveMaximum?: boolean;
  multipleOf?: number;
}

interface Const<T> {
  const?: T;
}

interface Enum<T> {
  enum?: T[];
}

interface SchemaType<T extends string> {
  type: T;
}

interface Schema<T, TName extends string> extends SchemaType<TName>, Nullable, Const<T>, Enum<T> {}

interface DictionaryKeyPattern extends SchemaType<"string"> {
  pattern: string;
}

interface DictionaryKeyEnum extends SchemaType<"string">, Enum<string> {}

interface ObjectType extends SchemaType<"object"> {}

// SCHEMA INTERFACES

export interface NullSchema extends SchemaType<"null"> {}
export interface BooleanSchema extends Schema<boolean, "boolean"> {}
export interface IntegerSchema extends Schema<number, "integer">, Numeric {}
export interface NumberSchema extends Schema<number, "number">, Numeric {}

export interface StringSchema extends Schema<string, "string"> {
  minLength?: number;
  maxLength?: number;
  format?: string;
  pattern?: string;

  // ... other validators are not supported right now
}

export interface ArraySchema extends Nullable, SchemaType<"array"> {
  items: ValueSchema;
  minItems?: number;
  maxItems?: number;
  uniqueItems?: boolean;

  // ... other validators are not supported right now
}

export interface DictionarySchema extends Nullable, ObjectType {
  additionalProperties: true | ValueSchema;
  propertyNames: DictionaryKeyPattern | DictionaryKeyEnum;
  minProperties?: number;
  maxProperties?: number;
  patternProperties?: Record<string, ValueSchema>;
}

export interface ObjectSchema extends Nullable, ObjectType {
  properties: Record<string, ValueSchema>;
  required?: string[];
  additionalProperties: boolean | ValueSchema;
}

// COMPOSITION

export type ObjectCompositionSchema = ObjectSchema | OneOfObjectsSchema | AllOfObjectsSchema;
export type AllOfSchema = AllOfObjectsSchema | AllOfAnySchema;
export type OneOfSchema = OneOfObjectsSchema | OneOfAnySchema;

interface ObjectComposition extends ObjectType {
  unevaluatedProperties?: boolean;
}

export interface AllOfObjectsSchema extends ObjectComposition {
  allOf: ObjectSchema[];
}

export interface AllOfAnySchema {
  allOf: ValueSchema[];
}

export interface OneOfObjectsSchema extends ObjectComposition {
  oneOf: ObjectSchema[];
}

export interface OneOfAnySchema {
  oneOf: ValueSchema[];
}
