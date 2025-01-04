import { BaseMode } from "$lib/controllers/mode";
import { Mode } from "$lib/types/editor/mode";
import type { Vector2 } from "$lib/types/math/vector2";
import type { Geometry, Point } from "$lib/types/world";
import type { Ticker } from "pixi.js";

export class MoveMode extends BaseMode {
  public name = Mode.Move;

  protected isDragging = false;
  protected startPositions: Map<Point, Vector2> = new Map();
  protected delta: Vector2 = { x: 0, y: 0 };

  public enter(previousModeName?: Mode): void {
    this.controlsDrawer.setCursorIcon("move");
  }

  public update(ticker: Ticker): Mode | undefined {
    if (!this.moveRangeSensor.isInRange && !this.isDragging) {
      return Mode.Select;
    }

    if (this.mouse.left && !this.isDragging) {
      this.startDrag();
    } else if (this.mouse.left && this.isDragging) {
      this.updateDrag();
    } else if (this.isDragging) {
      this.stopDrag();
    }
  }

  public exit(nextModeName?: Mode): void {
    this.controlsDrawer.setCursorIcon("default");
  }

  protected startDrag() {
    this.isDragging = true;
    this.startPositions = this.savePositions();
    this.updateDrag();
  }

  protected updateDrag() {
    const start = this.mouse.drag.start!.world;
    const end = this.mouse.world;
    this.delta = { x: end.x - start.x, y: end.y - start.y };

    this.world.selection.forEach(geometry => {
      if (!("x" in geometry && "y" in geometry)) {
        throw this.createOtherGeometryError(geometry);
      }

      const startPosition = this.startPositions.get(geometry)!;
      geometry.x = startPosition.x + this.delta.x;
      geometry.y = startPosition.y + this.delta.y;
    });
  }

  protected stopDrag() {
    this.isDragging = false;
    // save new positions
  }

  protected savePositions(): Map<Point, Vector2> {
    return new Map(
      this.world.selection.map(geometry => {
        if (!("x" in geometry && "y" in geometry)) {
          throw this.createOtherGeometryError(geometry);
        }
        return [geometry, { x: geometry.x, y: geometry.y }];
      }),
    );
  }

  protected createOtherGeometryError(geometry: Geometry) {
    return new Error("Don't know how to handle geometry other than points yet");
  }
}
