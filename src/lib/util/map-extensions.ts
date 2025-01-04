export function transformValues<K, OldValueType, NewValueType>(
  map: Map<K, OldValueType>,
  transform: (value: OldValueType) => NewValueType,
): Map<K, NewValueType> {
  return new Map([...map].map(([key, value]) => [key, transform(value)]));
}
