import { type ValidateFunction } from "ajv";
import type { RequestHandler } from "./$types";
import { RequestBodySchema } from "$lib/types/api/patch";
import { json } from "@sveltejs/kit";
import { Ajv } from "$lib/ajv";

export const PATCH: RequestHandler = async ({ request }) => {
  const jsonData = await request.json();

  let schema: ValidateFunction;
  try {
    schema = Ajv.compile(RequestBodySchema);
  } catch (error) {
    console.error("Failed to compile JSON schema\n\t", JSON.stringify(RequestBodySchema));
    console.error(error);
    throw error;
  }

  if (!schema(jsonData)) {
    return json({ errors: schema.errors, schema: RequestBodySchema }, { status: 400 });
  }

  return new Response(null, {
    status: 204,
  });
};
