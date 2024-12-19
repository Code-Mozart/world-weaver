import { Colors } from "$lib/drawing/colors";
import type { WorldDrawer } from "$lib/view/world-drawer";
import type { Ticker } from "pixi.js";

export class WorldController {
  protected worldData: any;
  protected worldDrawer: WorldDrawer;

  protected mouse: {
    screen: { x: number; y: number };
    world: { x: number; y: number };
    leftClick: boolean;
    rightClick: boolean;
  };

  constructor(worldData: any, worldDrawer: WorldDrawer) {
    this.worldData = worldData;
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
    this.worldDrawer.viewport.onmousedown = event => {
      if (event.button === 0) {
        this.mouse.leftClick = true;
      } else if (event.button === 2) {
        this.mouse.rightClick = true;
      }
    };

    this.worldDrawer.viewport.onmouseup = event => {
      if (event.button === 0) {
        this.mouse.leftClick = false;
      } else if (event.button === 2) {
        this.mouse.rightClick = false;
      }
    };

    this.worldDrawer.viewport.onmousemove = event => {
      this.mouse.screen.x = event.globalX;
      this.mouse.screen.y = event.globalY;

      this.mouse.world = this.worldDrawer.viewport.toWorld(event.globalX, event.globalY);
    };

    this.worldDrawer.viewport.ontouchmove = event => {
      this.mouse.screen.x = event.globalX;
      this.mouse.screen.y = event.globalY;

      this.mouse.world = this.worldDrawer.viewport.toWorld(event.globalX, event.globalY);
    };
  }
}
