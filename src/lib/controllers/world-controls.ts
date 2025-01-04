import { EditorWorld } from "$lib/controllers/editor-world";
import { VectorMath } from "$lib/math/vector-math";
import { calculateBoundingBox, growRectangle, isPointInRectangle } from "$lib/util/geometry-helpers";
import type { ControlsDrawer } from "$lib/view/controls-drawer";
import type { WorldDrawer } from "$lib/view/world-drawer";
import type { Viewport } from "pixi-viewport";
import type { Ticker } from "pixi.js";

// in pixels in screen distance
const SINGLE_SELECTION_MIN_RADIUS = 25;
const SINGLE_SELECTION_MIN_SQR_RADIUS = SINGLE_SELECTION_MIN_RADIUS * SINGLE_SELECTION_MIN_RADIUS;

export class WorldControls {
  protected world: EditorWorld;
  protected viewport: Viewport;
  protected controlsDrawer: ControlsDrawer;
  protected worldDrawer: WorldDrawer;

  protected mouse: {
    screen: { x: number; y: number };
    world: { x: number; y: number };
    leftClick: boolean;
    rightClick: boolean;
    drag: {
      start: {
        screen: { x: number; y: number };
        world: { x: number; y: number };
      } | null;
      released: boolean;
      mode: "move" | "select" | null;
    };
  };

  constructor(world: EditorWorld, viewport: Viewport, controlsDrawer: ControlsDrawer, worldDrawer: WorldDrawer) {
    this.world = world;
    this.viewport = viewport;
    this.controlsDrawer = controlsDrawer;
    this.worldDrawer = worldDrawer;

    this.registerCallbacks();

    this.mouse = {
      screen: { x: 0, y: 0 },
      world: { x: 0, y: 0 },
      leftClick: false,
      rightClick: false,
      drag: {
        start: null,
        released: false,
        mode: "select",
      },
    };
  }

  public update(ticker: Ticker) {
    // // Only for debugging
    // this.controlsDrawer.drawCursorPosition(this.mouse.screen.x, this.mouse.screen.y);

    this.updateMouseDrag();
    if (this.mouse.drag.released) {
      this.controlsDrawer.setSelectionBox(null);
    }

    const inMoveRange = this.world.selectionCount > 0 && this.isCursorInRangeOfSelected;
    if (inMoveRange && this.mouse.drag.mode !== "select") {
      this.handleMoveSelectedGeometry();
    } else {
      this.controlsDrawer.setCursorIcon("default");
    }

    if (!inMoveRange && this.mouse.drag.start !== null && this.mouse.drag.mode !== "move") {
      this.mouse.drag.mode = "select";
      this.updateSelectionBox();
    }

    if (this.mouse.drag.start === null) {
      this.mouse.drag.mode = null;
    }
  }

  protected registerCallbacks() {
    this.controlsDrawer.viewport.onmousedown = event => {
      if (event.button === 0) {
        this.mouse.leftClick = true;
      } else if (event.button === 2) {
        this.mouse.rightClick = true;
      }
    };

    this.controlsDrawer.viewport.onmouseup = event => {
      if (event.button === 0) {
        this.mouse.leftClick = false;
      } else if (event.button === 2) {
        this.mouse.rightClick = false;
      }
    };

    this.controlsDrawer.viewport.onmousemove = event => {
      this.mouse.screen.x = event.globalX;
      this.mouse.screen.y = event.globalY;

      this.mouse.world = this.controlsDrawer.viewport.toWorld(event.globalX, event.globalY);
    };

    this.controlsDrawer.viewport.ontouchmove = event => {
      this.mouse.screen.x = event.globalX;
      this.mouse.screen.y = event.globalY;

      this.mouse.world = this.controlsDrawer.viewport.toWorld(event.globalX, event.globalY);
    };
  }

  protected updateMouseDrag() {
    this.mouse.drag.released = false;
    if (this.mouse.leftClick) {
      if (this.mouse.drag.start === null) {
        // Start drag
        this.mouse.drag.start = {
          screen: Object.assign({}, this.mouse.screen),
          world: Object.assign({}, this.mouse.world),
        };
      } else {
        // Drag
      }
    } else if (!this.mouse.leftClick && this.mouse.drag.start !== null) {
      // End drag
      this.mouse.drag.start = null;
      this.mouse.drag.released = true;
      this.mouse.drag.mode = null;
    }
  }

  protected handleMoveSelectedGeometry() {
    const inMoveRange = this.isCursorInRangeOfSelected;
    if (inMoveRange || this.mouse.drag.start !== null) {
      this.mouse.drag.mode = "move";
      this.controlsDrawer.setCursorIcon("move");
    } else {
      this.controlsDrawer.setCursorIcon("default");
      if (this.mouse.leftClick) {
        this.world.setSelection([]);
      }
    }
  }

  protected get isCursorInRangeOfSelected() {
    return this.world.selectionCount === 1
      ? this.isCursorInRangeOfSingleSelected()
      : this.isCursorInRangeOfMultipleSelected();
  }

  protected isCursorInRangeOfSingleSelected(): boolean {
    const geometry = this.world.selection[0];

    if (!("x" in geometry && "y" in geometry)) {
      throw new Error("Only points are implemented for now");
    }

    const { x, y } = this.viewport.toScreen(geometry.x, geometry.y);
    const sqrDistance = VectorMath.sqrMagnitude(this.mouse.screen.x - x, this.mouse.screen.y - y);
    return sqrDistance < SINGLE_SELECTION_MIN_SQR_RADIUS;
  }

  protected isCursorInRangeOfMultipleSelected(): boolean {
    const geometry = this.world.selection;
    const boundingBox = growRectangle(calculateBoundingBox(geometry), SINGLE_SELECTION_MIN_RADIUS);
    return isPointInRectangle(this.mouse.world.x, this.mouse.world.y, boundingBox);
  }

  protected updateSelectionBox() {
    const mouseDragStart = this.mouse.drag.start!;

    const geometry = this.world.getGeometryInBox(
      Math.min(mouseDragStart.world.x, this.mouse.world.x),
      Math.min(mouseDragStart.world.y, this.mouse.world.y),
      Math.max(mouseDragStart.world.x, this.mouse.world.x),
      Math.max(mouseDragStart.world.y, this.mouse.world.y),
    );
    this.world.setSelection(geometry);

    this.controlsDrawer.setSelectionBox({
      x: Math.min(mouseDragStart.screen.x, this.mouse.screen.x),
      y: Math.min(mouseDragStart.screen.y, this.mouse.screen.y),
      width: Math.abs(mouseDragStart.screen.x - this.mouse.screen.x),
      height: Math.abs(mouseDragStart.screen.y - this.mouse.screen.y),
    });
  }
}
