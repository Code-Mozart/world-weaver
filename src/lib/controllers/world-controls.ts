import type { World } from "$lib/types/world";
import type { ControlsDrawer } from "$lib/view/controls-drawer";
import type { WorldDrawer } from "$lib/view/world-drawer";
import type { Ticker } from "pixi.js";

export class WorldControls {
  protected worldData: World;
  protected controlsDrawer: ControlsDrawer;
  protected worldDrawer: WorldDrawer;

  protected mouse: {
    screen: { x: number; y: number };
    world: { x: number; y: number };
    leftClick: boolean;
    rightClick: boolean;
  };

  constructor(worldData: World, controlsDrawer: ControlsDrawer, worldDrawer: WorldDrawer) {
    this.worldData = worldData;
    this.controlsDrawer = controlsDrawer;
    this.worldDrawer = worldDrawer;

    this.registerCallbacks();

    this.mouse = {
      screen: { x: 0, y: 0 },
      world: { x: 0, y: 0 },
      leftClick: false,
      rightClick: false,
    };
  }

  public update(ticker: Ticker) {}

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
}
