export function omit<T extends Object, K extends keyof T>(obj: T, key: K): Omit<T, K>;
export function omit<T extends Object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
export function omit<T extends Object, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K>;
export function omit<T extends Object, K extends keyof T>(obj: T, arg: K | K[]): Omit<T, K> {
  const keys = Array.isArray(arg) ? arg : [arg];
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !keys.includes(k as K))) as Omit<T, K>;
}

export function isEqual<T extends any>(a: T, b: T): boolean {
  if (a === b) {
    return true;
  }

  return JSON.stringify(a) === JSON.stringify(b);
}

export function haveMatchingValues<T extends any[]>(objects: [...T], keys: (keyof T[number])[]): boolean {
  return objects.slice(1).every(obj => keys.every(key => isEqual(obj[key], obj[key])));
}
