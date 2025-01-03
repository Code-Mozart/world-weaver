import { Drawing } from "$lib/drawing/drawing";
import { Viewport } from "pixi-viewport";
import { Application, Graphics, Ticker } from "pixi.js";
import { WorldDrawer } from "$lib/view/world-drawer";
import { WorldControls } from "$lib/controllers/world-controls";
import { ControlsDrawer } from "$lib/view/controls-drawer";
import type { World } from "$lib/types/world";
import type { Theme } from "$lib/view/themes/theme";

/**
 * This class is the top level view for drawing the world. It manages
 * it's own viewport and delegates the drawing to various drawer classes.
 */
export class WorldView {
  protected _viewport: Viewport;
  protected theme: Theme;

  protected worldSpaceGraphics: Graphics;
  protected worldSpaceDrawing: Drawing;

  protected screenSpaceGraphics: Graphics;
  protected screenSpaceDrawing: Drawing;

  protected worldDrawer: WorldDrawer;
  protected controlsDrawer: ControlsDrawer;
  protected worldControls: WorldControls;

  get viewport() {
    return this._viewport;
  }

  constructor(application: Application, world: World, theme: Theme) {
    this._viewport = this.createViewport(application);
    this.theme = theme;

    this.worldSpaceGraphics = new Graphics();
    this._viewport.addChild(this.worldSpaceGraphics);
    this.worldSpaceDrawing = new Drawing(this.worldSpaceGraphics);

    this.screenSpaceGraphics = new Graphics();
    application.stage.addChild(this.screenSpaceGraphics);
    this.screenSpaceDrawing = new Drawing(this.screenSpaceGraphics);

    this.worldDrawer = new WorldDrawer(this._viewport, this.worldSpaceDrawing, world, theme);
    this.controlsDrawer = new ControlsDrawer(this._viewport, this.worldSpaceDrawing, this.screenSpaceDrawing, theme);
    this.worldControls = new WorldControls(world, this.controlsDrawer, this.worldDrawer);
  }

  public draw() {
    this.screenSpaceGraphics.clear();
    this.worldSpaceGraphics.clear();

    this.worldDrawer.draw();
    this.controlsDrawer.draw();
  }

  public update(ticker: Ticker) {
    this.updateViewportBounds();
    this.worldControls.update(ticker);
  }

  public resize(width: number, height: number) {
    this._viewport.resize(width, height);
  }

  public setNavigationControls(value: "mouse" | "gesture") {
    switch (value) {
      case "mouse":
        this.setMouseViewportControls();
        break;
      case "gesture":
        this.setGestureViewportControls();
        break;
      default:
        throw new Error(`Unknown viewport controls: ${value}`);
    }
  }

  protected updateViewportBounds() {
    const viewport = this.viewport;

    const maxOffsetFactor = 0.8 / viewport.scaled;

    viewport.clamp({
      left: -maxOffsetFactor * viewport.worldWidth,
      top: -maxOffsetFactor * viewport.worldHeight,
      right: (maxOffsetFactor + 1) * viewport.worldWidth,
      bottom: (maxOffsetFactor + 1) * viewport.worldHeight,
      underflow: "center",
    });
  }

  protected createViewport(application: Application): Viewport {
    this._viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000,

      passiveWheel: false,
      events: application.renderer.events,
    });
    this._viewport.options.disableOnContextMenu = true;
    application.stage.addChild(this._viewport);

    this.setGestureViewportControls();
    this._viewport.clampZoom({
      minWidth: 10,
      minHeight: 10,

      maxWidth: this._viewport.worldWidth * 2,
      maxHeight: this._viewport.worldHeight * 2,
    });
    this._viewport.moveCenter(0, 0);

    return this._viewport;
  }

  protected setMouseViewportControls() {
    this._viewport.drag({ mouseButtons: "right" }).wheel({ trackpadPinch: false, wheelZoom: true }).decelerate();
  }

  protected setGestureViewportControls() {
    this._viewport.drag({ pressDrag: false }).pinch().wheel({ trackpadPinch: true, wheelZoom: false }).decelerate();
  }
}
