import Ajv from "ajv";
import type { RequestHandler } from "./$types";
import { RequestBodySchema } from "$lib/types/api/patch";
import { json } from "@sveltejs/kit";

export const PATCH: RequestHandler = async ({ request }) => {
  const jsonData = await request.json();
  const schema = new Ajv().compile(RequestBodySchema);

  if (!schema(jsonData)) {
    return json({ errors: schema.errors }, { status: 400 });
  }

  return new Response(null, {
    status: 204,
  });
};
