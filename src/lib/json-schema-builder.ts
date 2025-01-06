interface ArrayOptions {
  minItems?: number;
  maxItems?: number;
}

export function array<T>(itemSchema: T, options?: ArrayOptions) {
  return {
    type: "array",
    items: itemSchema,
    ...options,
  };
}

interface ObjectOptions<AdditionalPropertiesType> {
  additionalProperties: boolean | AdditionalPropertiesType;
  required?: string[];
}

export function object<PropertiesType extends Object, AdditionalPropertiesType>(
  properties: PropertiesType,
  options: ObjectOptions<AdditionalPropertiesType> = { additionalProperties: false },
) {
  if ("required" in options) {
    return {
      type: "object",
      required: options.required,
      additionalProperties: options.additionalProperties,
      properties,
    };
  }

  return {
    type: "object",
    additionalProperties: options.additionalProperties,
    required: Object.keys(properties),
    properties,
  };
}

interface ValueOptions {
  nullable: boolean;
}

export function number(options: ValueOptions = { nullable: false }) {
  return {
    type: "number",
    ...options,
  };
}

export function string(options: ValueOptions = { nullable: false }) {
  return {
    type: "string",
    ...options,
  };
}

export function enumeration<T>(values: T, options: ValueOptions = { nullable: false }) {
  return {
    type: "string",
    enum: values,
    ...options,
  };
}

export function datetime(options: ValueOptions = { nullable: false }) {
  return {
    type: "string",
    format: "date-time",
    ...options,
  };
}

export function allOf<T extends any[]>(...schemas: [...T]) {
  return {
    allOf: schemas,
  };
}

export function oneOf<T extends any[]>(...schemas: [...T]) {
  return {
    oneOf: schemas,
  };
}
