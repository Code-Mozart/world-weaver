import type { Graphics, StrokeInput } from "pixi.js";

export class Drawing {
    protected _defaultStrokeStyle: StrokeInput;
    protected graphics: Graphics;

    constructor(graphics: Graphics) {
        this.graphics = graphics;

        this._defaultStrokeStyle = {};
        this.defaultStrokeStyle = { color: 0x000000, width: 1 };
    }

    set defaultStrokeStyle(strokeStyle: StrokeInput) {
        this._defaultStrokeStyle = strokeStyle;
        this.graphics.setStrokeStyle(strokeStyle);
    }

    /**
     * Adds a filled circle to the drawing.
     *
     * @param {number} x The x-coordinate of the circle.
     * @param {number} y The y-coordinate of the circle.
     * @param {number} radius The radius of the circle.
     * @param {number} color The color of the circle.
     */
    public addFilledCircle(x: number, y: number, radius: number, color: number) {
        this.graphics.circle(x, y, radius);
        this.graphics.fill(color);
    }

    /**
     * Adds a line to the drawing using the default stroke style.
     *
     * @param {number} x1 The x-coordinate of the first point.
     * @param {number} y1 The y-coordinate of the first point.
     * @param {number} x2 The x-coordinate of the second point.
     * @param {number} y2 The y-coordinate of the second point.
     */
    public addLine(x1: number, y1: number, x2: number, y2: number) {
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.stroke();
    }
}
