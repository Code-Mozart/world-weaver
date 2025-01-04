import { toTitleCase } from "$lib/util/string-extensions";

export function toEnum<E>(key: string, enumType: { [key: string]: E }): E {
  return enumType[toTitleCase(key) as keyof typeof enumType];
}
