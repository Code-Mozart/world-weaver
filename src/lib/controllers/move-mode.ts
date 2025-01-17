import type { Line } from "$assembly";
import { BaseMode } from "$lib/controllers/mode";
import { setPointPositions } from "$lib/deltas/set-point-positions";
import { Mode } from "$lib/types/editor/mode";
import type { Vector2 } from "$lib/types/math/vector2";
import type { Geometry, Point } from "$lib/types/world";
import type { Ticker } from "pixi.js";

export class MoveMode extends BaseMode {
  public name = Mode.Move;

  protected isDragging = false;
  protected isSelectAndMove = false;
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
    if (this.world.selectionCount === 0) {
      this.selectNearestPoint();
    }

    this.isDragging = true;
    this.startPositions = this.getCurrentPositions();
    this.updateDrag();
  }

  protected updateDrag() {
    const start = this.mouse.drag.start!.world;
    const end = this.mouse.world;
    this.delta = { x: end.x - start.x, y: end.y - start.y };

    const selectedPoints = this.world.selection.filter(geometry => "x" in geometry && "y" in geometry);
    const polygons = this.world.getPolygonsIncludingPoints(selectedPoints);
    if (
      polygons.some(polygon => {
        const edges: Line[] = new Array(polygon.points.length);
        for (let i = 0; i < polygon.points.length; i++) {
          const from = polygon.points[i];
          const to = polygon.points[(i + 1) % polygon.points.length];
          edges[i] = { from_x: from.x, from_y: from.y, to_x: to.x, to_y: to.y };
        }
        return false; //areAnyIntersecting(edges);
      })
    ) {
      this.world.selection.forEach(geometry => {
        if (!("x" in geometry && "y" in geometry)) {
          throw this.createOtherGeometryError(geometry);
        }

        const startPosition = this.startPositions.get(geometry)!;
        geometry.x = startPosition.x;
        geometry.y = startPosition.y;
      });
      return;
    }

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
    if (this.isSelectAndMove) {
      this.isSelectAndMove = false;
      this.world.setSelection([]);
    }

    this.isDragging = false;
    const positionData = [
      ...this.startPositions.entries().map(([point, startPosition]) => ({
        point,
        oldPosition: startPosition,
        newPosition: { x: startPosition.x + this.delta.x, y: startPosition.y + this.delta.y },
      })),
    ];
    this.world.commitChange(setPointPositions(positionData));
  }

  protected getCurrentPositions(): Map<Point, Vector2> {
    return new Map(
      this.world.selection.map(geometry => {
        if (!("x" in geometry && "y" in geometry)) {
          throw this.createOtherGeometryError(geometry);
        }
        return [geometry, { x: geometry.x, y: geometry.y }];
      }),
    );
  }

  protected selectNearestPoint() {
    const point = this.moveRangeSensor.pointNearCursor!;
    this.isSelectAndMove = true;
    this.world.setSelection([point]);
  }

  protected createOtherGeometryError(geometry: Geometry) {
    return new Error("Don't know how to handle geometry other than points yet");
  }
}
