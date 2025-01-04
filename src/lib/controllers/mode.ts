import type { Ticker } from "pixi.js";
import type { Viewport } from "pixi-viewport";
import type { EditorWorld } from "$lib/controllers/editor-world";
import type { ControlsDrawer } from "$lib/view/controls-drawer";
import type { WorldDrawer } from "$lib/view/world-drawer";
import { Mode as ModeName } from "$lib/types/editor/mode";
import type { Mouse } from "$lib/types/editor/mouse-data";
import type { MoveRangeSensor } from "$lib/controllers/move-range-sensor";

export interface Mode {
  name: ModeName;
  update(ticker: Ticker): ModeName | undefined;
  enter(previousModeName?: ModeName): void;
  exit(nextModeName?: ModeName): void;
}

export interface ModeDependencies {
  world: EditorWorld;
  viewport: Viewport;
  controlsDrawer: ControlsDrawer;
  worldDrawer: WorldDrawer;
  moveRangeSensor: MoveRangeSensor;
  mouse: Mouse;
}

export abstract class BaseMode implements Mode {
  public abstract name: ModeName;

  protected world: EditorWorld;
  protected viewport: Viewport;
  protected controlsDrawer: ControlsDrawer;
  protected worldDrawer: WorldDrawer;
  protected moveRangeSensor: MoveRangeSensor;
  protected mouse: Mouse;

  constructor(dependencies: ModeDependencies) {
    this.world = dependencies.world;
    this.viewport = dependencies.viewport;
    this.controlsDrawer = dependencies.controlsDrawer;
    this.worldDrawer = dependencies.worldDrawer;
    this.moveRangeSensor = dependencies.moveRangeSensor;
    this.mouse = dependencies.mouse;
  }

  public update(ticker: Ticker): ModeName | undefined {
    return;
  }

  public enter(previousModeName?: ModeName) {}
  public exit(nextModeName?: ModeName) {}
}
