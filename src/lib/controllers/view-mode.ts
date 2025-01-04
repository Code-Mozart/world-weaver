import { BaseMode } from "$lib/controllers/mode";
import { Mode } from "$lib/types/editor/mode";
import type { Ticker } from "pixi.js";

export class ViewMode extends BaseMode {
  public name = Mode.View;

  public update(ticker: Ticker): Mode | undefined {
    if (this.mouse.left && (this.world.selectionCount === 0 || !this.moveRangeSensor.isInRange)) {
      return Mode.Select;
    } else if (this.world.selectionCount > 0 && this.moveRangeSensor.isInRange) {
      return Mode.Move;
    }
  }
}
