import type { Rectangle } from "$lib/types/editor";
import type { Geometry } from "$lib/types/world";

export function calculateBoundingBox(geometry: Geometry[]): Rectangle {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const g of geometry) {
    if ("x" in g && "y" in g) {
      minX = Math.min(minX, g.x);
      minY = Math.min(minY, g.y);
      maxX = Math.max(maxX, g.x);
      maxY = Math.max(maxY, g.y);
    } else {
      throw new Error("Only points are implemented for now");
    }
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function growRectangle(rectangle: Rectangle, sideLength: number): Rectangle {
  return {
    x: rectangle.x - sideLength,
    y: rectangle.y - sideLength,
    width: rectangle.width + sideLength * 2,
    height: rectangle.height + sideLength * 2,
  };
}

export function isPointInRectangle(x: number, y: number, rectangle: Rectangle) {
  return (
    x >= rectangle.x && x <= rectangle.x + rectangle.width && y >= rectangle.y && y <= rectangle.y + rectangle.height
  );
}
