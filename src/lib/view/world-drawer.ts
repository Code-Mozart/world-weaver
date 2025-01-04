import { Colors } from "$lib/drawing/colors";
import { Drawing } from "$lib/drawing/drawing";
import type { Geometry, Point } from "$lib/types/world";
import { Viewport } from "pixi-viewport";
import type { Theme } from "$lib/view/themes/theme";
import { GroundType } from "$lib/types/ground-type";
import type { ColorSource, FillInput } from "pixi.js";
import type { EditorWorld } from "$lib/controllers/editor-world";
import type { StrokePatternStyle } from "$lib/types/stroke-pattern-style";

/**
 * This class is responsible for drawing the world.
 */
export class WorldDrawer {
  protected _viewport: Viewport;
  protected drawing: Drawing;
  protected world: EditorWorld;
  protected theme: Theme;

  get viewport() {
    return this._viewport;
  }

  constructor(viewport: Viewport, drawing: Drawing, world: EditorWorld, theme: Theme) {
    this._viewport = viewport;
    this.drawing = drawing;
    this.world = world;
    this.theme = theme;
  }

  public draw() {
    this.drawing.addOutlinedRectangle(0, 0, this.viewport.worldWidth, this.viewport.worldHeight, {
      pattern: [20, 20],
      color: Colors.gray,
      width: 5,
    });

    this.drawGround();
  }

  protected drawGround() {
    this.drawing.addFilledRectangle(
      0,
      0,
      this.viewport.worldWidth,
      this.viewport.worldHeight,
      this.getGroundTypeColor(this.world.worldDocument.groundType),
    );

    const scaledOutline = {
      ...this.theme.coastline.outline,
      width: (this.theme.coastline.outline.width ?? 1) / this.viewport.scaled,
    };

    // LATER: draw the polygon smoothly and not with sharp corners
    // see https://pixijs.com/8.x/examples/mesh-and-shaders/shared-geometry for reference on how we might achieve this
    this.world.coastlines.forEach(coastline => {
      this.drawing.addFilledPolygon(coastline.shape.points, this.getGroundTypeColor(coastline.groundType));
      this.drawing.addOutlinedPolygon(coastline.shape.points, scaledOutline);

      this.onlyVisible(coastline.shape.points).forEach(point => {
        this.drawPoint(point, scaledOutline, this.theme.point.selectedFillColor);
      });
    });
  }

  protected drawPoint(point: Point, strokeStyle: StrokePatternStyle, fillStyle: FillInput) {
    if (this.world.isSelected(point)) {
      this.drawing.addFilledCircle(point.x, point.y, this.theme.point.radius / this.viewport.scaled, fillStyle);
    } else {
      this.drawing.addOutlinedCircle(point.x, point.y, this.theme.point.radius / this.viewport.scaled, strokeStyle);
    }
  }

  protected onlyVisible<T extends Geometry>(all: T[]): T[] {
    return all.filter(geometry => !this.world.isInvisible(geometry));
  }

  protected getGroundTypeColor(groundType: GroundType): ColorSource {
    switch (groundType) {
      case GroundType.Land:
        return this.theme.groundTypes.land.fillColor;
      case GroundType.Water:
        return this.theme.groundTypes.water.fillColor;
      case GroundType.Lava:
        return this.theme.groundTypes.lava.fillColor;
      case GroundType.Void:
        return this.theme.groundTypes.void.fillColor;
    }
  }
}
