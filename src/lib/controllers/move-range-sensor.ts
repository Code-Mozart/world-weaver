import type { Viewport } from "pixi-viewport";
import { VectorMath } from "$lib/math/vector-math";
import { calculateBoundingBox, growRectangle, isPointInRectangle } from "$lib/util/geometry-helpers";
import type { EditorWorld } from "$lib/controllers/editor-world";
import type { Mouse } from "$lib/types/editor/mouse-data";
import { Graphics } from "pixi.js";

// in pixels in screen distance
const SINGLE_SELECTION_MIN_RADIUS = 25;
const SINGLE_SELECTION_MIN_SQR_RADIUS = SINGLE_SELECTION_MIN_RADIUS * SINGLE_SELECTION_MIN_RADIUS;

export class MoveRangeSensor {
  protected world: EditorWorld;
  protected viewport: Viewport;
  protected mouse: Mouse;

  protected _isCursorInRangeOfSelected: boolean | null;

  constructor(world: EditorWorld, viewport: Viewport, mouse: Mouse) {
    this.world = world;
    this.viewport = viewport;
    this.mouse = mouse;

    this._isCursorInRangeOfSelected = null;
  }

  public get isInRange() {
    if (this._isCursorInRangeOfSelected === null) {
      this._isCursorInRangeOfSelected = this.check();
    }
    return this._isCursorInRangeOfSelected;
  }

  public invalidate() {
    this._isCursorInRangeOfSelected = null;
  }

  protected check(): boolean {
    return this.world.selectionCount === 1 ? this.checkSingle() : this.checkMultiple();
  }

  protected checkSingle(): boolean {
    const geometry = this.world.selection[0];

    if (!("x" in geometry && "y" in geometry)) {
      throw new Error("Only points are implemented for now");
    }

    const { x, y } = this.viewport.toScreen(geometry.x, geometry.y);
    const sqrDistance = VectorMath.sqrMagnitude(this.mouse.screen.x - x, this.mouse.screen.y - y);
    return sqrDistance < SINGLE_SELECTION_MIN_SQR_RADIUS;
  }

  protected checkMultiple(): boolean {
    const geometry = this.world.selection;
    const boundingBox = growRectangle(calculateBoundingBox(geometry), SINGLE_SELECTION_MIN_RADIUS);

    // const gfx = new Graphics();
    // gfx.rect(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height);
    // gfx.stroke(0xff0000);
    // this.viewport.addChild(gfx);

    return isPointInRectangle(this.mouse.world.x, this.mouse.world.y, boundingBox);
  }
}
