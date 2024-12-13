import { Colors } from "$lib/drawing/colors";
import { Drawing } from "$lib/drawing/drawing";
import { Viewport } from "pixi-viewport";
import { Application, Graphics } from "pixi.js";

export class WorldDrawer {
    protected _viewport: Viewport;
    protected graphics: Graphics;
    protected worldData: any;
    protected style: CSSStyleDeclaration;

    protected onAfterDrawCallbacks: ((drawing: Drawing) => void)[] = [];

    get viewport() {
        return this._viewport;
    }

    set onafterdraw(callback: (drawing: Drawing) => void) {
        this.onAfterDrawCallbacks.push(callback);
    }

    constructor(application: Application, worldData: any, style: CSSStyleDeclaration) {
        this._viewport = WorldDrawer.createViewport(application);
        this.worldData = worldData;
        this.style = style;

        this.graphics = new Graphics();
        this._viewport.addChild(this.graphics);
    }

    public draw() {
        this.graphics.clear();
        const drawing = new Drawing(this.graphics);

        const primaryColor = this.style.getPropertyValue("--primary-color");

        const nodesMap: Map<number, { x: number; y: number }> = this.worldData.nodesMap;
        const polygons: { Nodes: { nodeId: number; nextNodeId: number }[] }[] = this.worldData.polygons;

        drawing.addOutlinedRectangle(0, 0, 1000, 1000, {
            pattern: [20, 20],
            color: Colors.gray,
            width: 5,
        });

        nodesMap.forEach((node: { x: number; y: number }) => {
            drawing.addFilledCircle(node.x, node.y, 5, primaryColor);
        });

        drawing.defaultStrokeStyle = { color: primaryColor, width: 2 };
        polygons.forEach((polygon: { Nodes: { nodeId: number; nextNodeId: number }[] }) => {
            polygon.Nodes.forEach((polygonNode) => {
                if (polygonNode.nextNodeId === null) {
                    return;
                }

                const node = nodesMap.get(polygonNode.nodeId);
                const nextNode = nodesMap.get(polygonNode.nextNodeId);

                if (node === undefined || nextNode === undefined) {
                    return;
                }

                drawing.addLine(node.x, node.y, nextNode.x, nextNode.y);
            });
        });

        this.onAfterDrawCallbacks.forEach((callback) => {
            callback(drawing);
        });
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
