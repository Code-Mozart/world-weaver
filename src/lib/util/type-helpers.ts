// from https://stackoverflow.com/questions/70807442/how-to-declare-the-intersection-type-of-variable-amount-of-argument-types
type IntersectionOf<T extends any[]> = {
  [I in keyof T]: (x: T[I]) => void;
}[number] extends (x: infer I) => void
  ? I
  : never;

type NonEmptyArray<T> = [T, ...T[]];
