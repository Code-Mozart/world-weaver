export function omit<T extends Object, K extends keyof T>(obj: T, key: K): Omit<T, K>;
export function omit<T extends Object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
export function omit<T extends Object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K>;
export function omit<T extends Object, K extends keyof T>(obj: T, arg: K | K[]): Omit<T, K> {
  const keys = Array.isArray(arg) ? arg : [arg];
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k as K))) as Omit<T, K>;
}
