import { EditorWorld } from "$lib/controllers/editor-world";
import { Mode as ModeName, type SetMode } from "$lib/types/editor/mode";
import type { Mouse } from "$lib/types/editor/mouse-data";
import type { ControlsDrawer } from "$lib/view/controls-drawer";
import type { WorldDrawer } from "$lib/view/world-drawer";
import type { Viewport } from "pixi-viewport";
import type { Ticker } from "pixi.js";
import type { Mode } from "$lib/controllers/mode";
import { ViewMode } from "$lib/controllers/view-mode";
import { SelectMode } from "$lib/controllers/select-mode";
import { MoveMode } from "$lib/controllers/move-mode";
import { MoveRangeSensor } from "./move-range-sensor";

/**
 * This class manages the world controls and is implemented as a state machine.
 */
export class WorldControls {
  protected modes: Map<ModeName, Mode>;
  protected modeName: ModeName;

  protected moveRangeSensor: MoveRangeSensor;
  protected mouse: Mouse;

  protected setMode?: SetMode;

  constructor(
    world: EditorWorld,
    viewport: Viewport,
    controlsDrawer: ControlsDrawer,
    worldDrawer: WorldDrawer,
    onSetMode?: SetMode,
  ) {
    this.mouse = WorldControls.initializeMouse();
    this.moveRangeSensor = new MoveRangeSensor(world, viewport, this.mouse);
    const dependencies = {
      world,
      viewport,
      controlsDrawer,
      worldDrawer,
      moveRangeSensor: this.moveRangeSensor,
      mouse: this.mouse,
    };

    this.modes = new Map([
      [ModeName.View, new ViewMode(dependencies)],
      [ModeName.Select, new SelectMode(dependencies)],
      [ModeName.Move, new MoveMode(dependencies)],
    ]);
    this.modeName = ModeName.View;

    this.setMode = onSetMode;
    this.registerCallbacks(viewport);
  }

  public update(ticker: Ticker) {
    this.moveRangeSensor.invalidate();
    this.updateMouseDrag();

    const currentMode = this.modes.get(this.modeName);
    if (currentMode === undefined) {
      throw new Error(`Mode ${this.modeName} seems to not have been added to the map of modes`);
    }

    const newModeName = currentMode.update(ticker);
    if (newModeName !== undefined) {
      currentMode.exit(newModeName);
      this.modes.get(newModeName)?.enter(this.modeName);
      this.modeName = newModeName;
      this.setMode?.(newModeName);
    }
  }

  protected updateMouseDrag() {
    this.mouse.drag.wasReleasedThisFrame = false;
    if (this.mouse.left) {
      if (this.mouse.drag.start === null) {
        // Start drag
        this.mouse.drag.start = {
          screen: Object.assign({}, this.mouse.screen),
          world: Object.assign({}, this.mouse.world),
        };
      } else {
        // Drag
      }
    } else if (!this.mouse.left && this.mouse.drag.start !== null) {
      // End drag
      this.mouse.drag.start = null;
      this.mouse.drag.wasReleasedThisFrame = true;
    }
  }

  protected registerCallbacks(viewport: Viewport) {
    viewport.onmousedown = event => {
      if (event.button === 0) {
        this.mouse.left = true;
      } else if (event.button === 2) {
        this.mouse.right = true;
      }
    };

    viewport.onmouseup = event => {
      if (event.button === 0) {
        this.mouse.left = false;
      } else if (event.button === 2) {
        this.mouse.right = false;
      }
    };

    viewport.onmousemove = event => {
      this.mouse.screen.x = event.globalX;
      this.mouse.screen.y = event.globalY;

      this.mouse.world = viewport.toWorld(event.globalX, event.globalY);
    };

    viewport.ontouchmove = event => {
      this.mouse.screen.x = event.globalX;
      this.mouse.screen.y = event.globalY;

      this.mouse.world = viewport.toWorld(event.globalX, event.globalY);
    };
  }

  protected static initializeMouse(): Mouse {
    return {
      screen: { x: 0, y: 0 },
      world: { x: 0, y: 0 },
      left: false,
      right: false,
      drag: { start: null, wasReleasedThisFrame: false },
    };
  }
}
