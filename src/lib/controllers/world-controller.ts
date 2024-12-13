import { Colors } from "$lib/drawing/colors";
import type { WorldDrawer } from "$lib/view/world-drawer";
import type { Ticker } from "pixi.js";

export class WorldController {
    protected worldData: any;
    protected worldDrawer: WorldDrawer;

    protected mouse: {
        screen: { x: number; y: number },
        world: { x: number; y: number }
    };

    constructor(worldData: any, worldDrawer: WorldDrawer) {
        this.worldData = worldData;
        this.worldDrawer = worldDrawer;

        this.registerCallbacks();

        this.mouse = {
            screen: { x: 0, y: 0 },
            world: { x: 0, y: 0 }
        };
    }

    public update(ticker: Ticker) {
    }

    protected registerCallbacks() {
        this.worldDrawer.viewport.onmousemove = (event) => {
            this.mouse.screen.x = event.globalX;
            this.mouse.screen.y = event.globalY;

            this.mouse.world = this.worldDrawer.viewport.toWorld(event.globalX, event.globalY);
        }

        this.worldDrawer.onafterdraw = (drawing) => {
            const scale = this.worldDrawer.viewport.scale.x;
            drawing.addFilledCircle(this.mouse.world.x, this.mouse.world.y, scale * 5, Colors.red);
        }
    }
}