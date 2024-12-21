import { Drawing } from "$lib/drawing/drawing";
import { Viewport } from "pixi-viewport";
import { Application, Graphics, Ticker } from "pixi.js";
import { WorldDrawer } from "./world-drawer";
import { WorldControls } from "$lib/controllers/world-controls";
import { ControlsDrawer } from "./controls-drawer";
import type { World } from "$lib/types/world";

/**
 * This class is the top level view for drawing the world. It manages
 * it's own viewport and delegates the drawing to various drawer classes.
 */
export class WorldView {
  protected _viewport: Viewport;
  protected style: CSSStyleDeclaration;

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

  constructor(application: Application, world: World, style: CSSStyleDeclaration) {
    this._viewport = WorldView.createViewport(application);
    this.style = style;

    this.worldSpaceGraphics = new Graphics();
    this._viewport.addChild(this.worldSpaceGraphics);
    this.worldSpaceDrawing = new Drawing(this.worldSpaceGraphics);

    this.screenSpaceGraphics = new Graphics();
    application.stage.addChild(this.screenSpaceGraphics);
    this.screenSpaceDrawing = new Drawing(this.screenSpaceGraphics);

    this.worldDrawer = new WorldDrawer(this._viewport, this.worldSpaceDrawing, world, style);
    this.controlsDrawer = new ControlsDrawer(this._viewport, this.worldSpaceDrawing, this.screenSpaceDrawing, style);
    this.worldControls = new WorldControls(world, this.controlsDrawer);
  }

  public draw() {
    this.worldSpaceGraphics.clear();
    this.worldDrawer.draw();
  }

  public update(ticker: Ticker) {
    this.worldControls.update(ticker);
  }

  public resize(width: number, height: number) {
    this._viewport.resize(width, height);
  }

  protected static createViewport(application: Application): Viewport {
    const viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000,

      events: application.renderer.events,
    });
    viewport.options.disableOnContextMenu = true;
    application.stage.addChild(viewport);

    viewport
      .drag({ mouseButtons: "right" })
      .pinch()
      .wheel()
      .decelerate()
      .clamp({
        left: -viewport.worldWidth / 2,
        top: -viewport.worldHeight / 2,
        right: (viewport.worldWidth * 3) / 2,
        bottom: (viewport.worldHeight * 3) / 2,
        underflow: "center",
      })
      .clampZoom({
        maxWidth: viewport.worldWidth * 2,
        maxHeight: viewport.worldHeight * 2,
      });
    viewport.moveCenter(0, 0);

    return viewport;
  }
}
