export function resolveColor(value: string): string {
  if (/^#[0-9A-Fa-f]{3,6}$/.test(value)) {
    return value;
  } else if (/^rgba\(#[0-9A-Fa-f]{6},(?: *)(?:(?:1)|(?:1\.0+)|(?:0?\.[0-9]+))\)$/.test(value)) {
    const match = value.match(
      /^rgba\(#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2}),(?: *)((?:1)|(?:1\.0+)|(?:0?\.[0-9]+))\)$/,
    );
    if (match === null) throw new Error("Test for color regex succeeded but match failed. This is a bug!");
    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);
    const a = parseFloat(match[4]);
    return `rgba(${r},${g},${b},${a})`;
  }

  throw new Error(`Invalid color: ${value}`);
}
