import { Colors } from "$lib/drawing/colors";
import { Drawing } from "$lib/drawing/drawing";
import type { World } from "$lib/types/world";
import { Viewport } from "pixi-viewport";
import type { Theme } from "$lib/view/themes/theme";

/**
 * This class is responsible for drawing the world.
 */
export class WorldDrawer {
  protected _viewport: Viewport;
  protected drawing: Drawing;
  protected world: any;
  protected theme: Theme;

  get viewport() {
    return this._viewport;
  }

  constructor(viewport: Viewport, drawing: Drawing, world: World, theme: Theme) {
    this._viewport = viewport;
    this.drawing = drawing;
    this.world = world;
    this.theme = theme;
  }

  public draw() {
    this.drawing.addOutlinedRectangle(0, 0, 1000, 1000, {
      pattern: [20, 20],
      color: Colors.gray,
      width: 5,
    });
  }

  protected drawGround() {
    this.world;
  }
}
