import { Ajv2019 } from "ajv/dist/2019";
import addFormats from "ajv-formats";

export const Ajv = addFormats(new Ajv2019());
