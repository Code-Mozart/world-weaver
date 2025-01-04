import { BaseMode } from "$lib/controllers/mode";
import { Mode } from "$lib/types/editor/mode";
import type { Ticker } from "pixi.js";

export class MoveMode extends BaseMode {
  public name = Mode.Move;

  protected isDragging = false;

  public enter(previousModeName?: Mode): void {
    this.controlsDrawer.setCursorIcon("move");
  }

  public update(ticker: Ticker): Mode | undefined {
    if (!this.moveRangeSensor.isInRange && !this.isDragging) {
      return Mode.Select;
    }

    if (this.mouse.left) {
      this.isDragging = true;
    } else {
      this.isDragging = false;
    }
  }

  public exit(nextModeName?: Mode): void {
    this.controlsDrawer.setCursorIcon("default");
  }
}
