import { Drawing } from "$lib/drawing/drawing";
import { Viewport } from "pixi-viewport";
import type { Theme } from "$lib/view/themes/theme";

/**
 * This class is responsible for drawing the world.
 */
export class ControlsDrawer {
  protected _viewport: Viewport;
  protected drawing: Drawing;
  protected worldData: any;
  protected theme: Theme;

  get viewport() {
    return this._viewport;
  }

  constructor(viewport: Viewport, drawing: Drawing, worldData: any, theme: Theme) {
    this._viewport = viewport;
    this.drawing = drawing;
    this.worldData = worldData;
    this.theme = theme;
  }

  public draw() {}
}
