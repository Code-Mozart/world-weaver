import { Drawing } from "$lib/drawing/drawing";
import { Viewport } from "pixi-viewport";
import { Application, Graphics } from "pixi.js";
import { WorldDrawer } from "./world-drawer";

/**
 * This class is the top level view for drawing the world. It manages
 * it's own viewport and delegates the drawing to various drawer classes.
 */
export class WorldView {
    protected _viewport: Viewport;
    protected style: CSSStyleDeclaration;

    protected worldSpaceGraphics: Graphics;
    protected worldSpaceDrawing: Drawing;

    protected worldDrawer: WorldDrawer;

    get viewport() {
        return this._viewport;
    }

    constructor(application: Application, worldData: any, style: CSSStyleDeclaration) {
        this._viewport = WorldView.createViewport(application);
        this.style = style;

        this.worldSpaceGraphics = new Graphics();
        this._viewport.addChild(this.worldSpaceGraphics);
        this.worldSpaceDrawing = new Drawing(this.worldSpaceGraphics);

        this.worldDrawer = new WorldDrawer(this._viewport, this.worldSpaceDrawing, worldData, style);
    }

    public draw() {
        this.worldSpaceGraphics.clear();
        this.worldDrawer.draw();
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
