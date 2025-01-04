import type { ColorSource } from "pixi.js";

export interface StrokePatternStyle {
  color?: ColorSource;
  width?: number;
  pattern?: number[];
}

export function validateStrokePatternStyle(pattern: number[]) {
  if (pattern.length < 2) {
    throw new Error("Pattern must have at least 2 items, one for the stroke length and one for the gap length.");
  }
  if (pattern.length % 2 !== 0) {
    throw new Error("Pattern must have an even number of items, alternating between stroke length and gap length.");
  }
}
