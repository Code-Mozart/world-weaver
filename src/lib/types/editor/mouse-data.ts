import type { Vector2 } from "$lib/types/math/vector2";

export interface Mouse {
  screen: Vector2;
  world: Vector2;

  left: boolean;
  right: boolean;

  drag: {
    start: { screen: Vector2; world: Vector2 } | null;
    wasReleasedThisFrame: boolean;
  };
}
