import { type FillInput, type Graphics, type StrokeInput } from "pixi.js";
import { Colors } from "$lib/drawing/colors";
import { type StrokePatternStyle } from "$lib/types/stroke-pattern-style";
import { DashedLinesDrawer } from "./dashed-lines-drawer";

export class Drawing {
    protected _defaultStrokeStyle: StrokePatternStyle;
    protected _defaultFillStyle: FillInput;
    protected graphics: Graphics;

    constructor(graphics: Graphics) {
        this.graphics = graphics;

        this._defaultStrokeStyle = {};
        this.defaultStrokeStyle = { color: Colors.black, width: 1 };

        this._defaultFillStyle = {};
        this.defaultFillStyle = { color: Colors.black };
    }

    get defaultStrokeStyle(): StrokePatternStyle {
        return this._defaultStrokeStyle;
    }

    get defaultFillStyle(): FillInput {
        return this._defaultFillStyle;
    }

    set defaultStrokeStyle(strokeStyle: StrokePatternStyle) {
        this._defaultStrokeStyle = strokeStyle;
        this.graphics.setStrokeStyle(strokeStyle);
    }

    set defaultFillStyle(fillStyle: FillInput) {
        this._defaultFillStyle = fillStyle;
        this.graphics.setFillStyle(fillStyle);
    }

    /**
     * Adds a line to the drawing.
     *
     * @param {number} x1 The x-coordinate of the first point.
     * @param {number} y1 The y-coordinate of the first point.
     * @param {number} x2 The x-coordinate of the second point.
     * @param {number} y2 The y-coordinate of the second point.
     * @param {StrokeInput} strokeStyle (optional) The stroke style of the line. If omitted, the default stroke style is used.
     */
    public addLine(x1: number, y1: number, x2: number, y2: number, strokeStyle?: StrokeInput) {
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.stroke(strokeStyle ?? this.defaultStrokeStyle);
    }

    /**
     * Adds an outlined rectangle to the drawing.
     * 
     * @param {number} x The x-coordinate of the top-left corner of the rectangle.
     * @param {number} y The y-coordinate of the top-left corner of the rectangle.
     * @param {number} width The width of the rectangle.
     * @param {number} height The height of the rectangle.
     * @param {StrokePatternStyle} strokeStyle (optional) The stroke style of the outline. If omitted, the default stroke style is used.
     */
    public addOutlinedRectangle(x: number, y: number, width: number, height: number, strokeStyle?: StrokePatternStyle) {
        if (strokeStyle === undefined) {
            strokeStyle = this.defaultStrokeStyle;
        }

        if (strokeStyle.pattern === undefined) {
            this.addSolidOutlinedRectangle(x, y, width, height, strokeStyle);
        }
        else {
            this.addDashedOutlinedRectangle(x, y, width, height, strokeStyle);
        }
    }

    /**
     * Adds a filled circle to the drawing.
     *
     * @param {number} x The x-coordinate of the circle.
     * @param {number} y The y-coordinate of the circle.
     * @param {number} radius The radius of the circle.
     * @param {number} fillStyle (optional) The fill style of the circle. If omitted, the default fill style is used.
     */
    public addFilledCircle(x: number, y: number, radius: number, fillStyle?: FillInput) {
        this.graphics.circle(x, y, radius);
        this.graphics.fill(fillStyle ?? this.defaultFillStyle);
    }

    protected addSolidOutlinedRectangle(x: number, y: number, width: number, height: number, strokeStyle: StrokePatternStyle) {
        this.graphics.rect(x, y, width, height);
        this.graphics.stroke(strokeStyle);
    }

    protected addDashedOutlinedRectangle(x: number, y: number, width: number, height: number, strokeStyle: StrokePatternStyle) {
        const topLeft = { x, y };
        const topRight = { x: x + width, y };
        const bottomLeft = { x, y: y + height };
        const bottomRight = { x: x + width, y: y + height };

        this.addDashedPolyline([
            topLeft,
            topRight,
            bottomRight,
            bottomLeft,
            topLeft
        ], strokeStyle);
    }

    // PERFORMANCE: Passing the points as lots of 2-element objects is not very efficient
    protected addDashedPolyline(points: { x: number; y: number }[], strokeStyle: StrokePatternStyle) {
        if (strokeStyle.pattern === undefined) {
            throw new Error("Called `addDashedPolyline()` without a pattern, use `addPolyline()` instead.");
        }
        if (points.length < 2) {
            return;
        }

        const dashedLinesDrawer = new DashedLinesDrawer(this.graphics, strokeStyle);
        for (let i = 1; i < points.length; i++) {
            const { x: fromX, y: fromY } = points[i - 1];
            const { x: toX, y: toY } = points[i];

            dashedLinesDrawer.drawLine(fromX, fromY, toX, toY);
        }
    }
}
