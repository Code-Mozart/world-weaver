import { BaseMode } from "$lib/controllers/mode";
import { Mode } from "$lib/types/editor/mode";
import type { Ticker } from "pixi.js";

export class SelectMode extends BaseMode {
  public name = Mode.Select;

  public update(ticker: Ticker): Mode | undefined {
    if (!this.mouse.left) {
      return Mode.View;
    }
    this.updateSelectionBox();
  }

  public exit(nextModeName?: Mode): void {
    this.controlsDrawer.setSelectionBox(null);
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
