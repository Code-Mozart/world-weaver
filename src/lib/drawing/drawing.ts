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
   * @param {number} x1 The x-coordinate of the first point in the world.
   * @param {number} y1 The y-coordinate of the first point in the world.
   * @param {number} x2 The x-coordinate of the second point in the world.
   * @param {number} y2 The y-coordinate of the second point in the world.
   * @param {StrokeInput} strokeStyle (optional) The stroke style of the line. If omitted, the default stroke style is used.
   */
  public addLine(x1: number, y1: number, x2: number, y2: number, strokeStyle?: StrokeInput) {
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.stroke(strokeStyle ?? this.defaultStrokeStyle);
  }

  /**
   * Adds a filled rectangle to the drawing.
   *
   * @param {number} x The x-coordinate of the top-left corner of the rectangle.
   * @param {number} y The y-coordinate of the top-left corner of the rectangle.
   * @param {number} width The width of the rectangle.
   * @param {number} height The height of the rectangle.
   * @param {FillInput} fillStyle (optional) The fill style of the rectangle. If omitted, the default fill style is used.
   */
  public addFilledRectangle(x: number, y: number, width: number, height: number, fillStyle?: FillInput) {
    this.graphics.rect(x, y, width, height);
    this.graphics.fill(fillStyle ?? this.defaultFillStyle);
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
    } else {
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

  /**
   * Adds a filled circle to the drawing.
   *
   * @param {number} x The x-coordinate of the circle.
   * @param {number} y The y-coordinate of the circle.
   * @param {number} radius The radius of the circle.
   * @param {StrokePatternStyle} strokeStyle (optional) The stroke style of the outline. If omitted, the default stroke style is used.
   */
  public addOutlinedCircle(x: number, y: number, radius: number, strokeStyle?: StrokePatternStyle) {
    if (strokeStyle === undefined) {
      strokeStyle = this.defaultStrokeStyle;
    }

    if (strokeStyle.pattern === undefined) {
      this.addSolidOutlinedCircle(x, y, radius, strokeStyle);
    } else {
      this.addDashedOutlinedCircle(x, y, radius, strokeStyle);
    }
  }

  /**
   * Adds a filled polygon to the drawing.
   *
   * @param {{ x: number; y: number }[]} points The points of the polygon.
   * @param {FillInput} fillStyle (optional) The fill style of the polygon. If omitted, the default fill style is used.
   */
  public addFilledPolygon(points: { x: number; y: number }[], fillStyle?: FillInput) {
    this.graphics.poly(points);
    this.graphics.fill(fillStyle ?? this.defaultFillStyle);
  }

  /**
   * Adds an outlined polygon to the drawing.
   *
   * @param {{ x: number; y: number }[]} points The points of the polygon.
   * @param {StrokePatternStyle} strokeStyle (optional) The stroke style of the outline. If omitted, the default stroke style is used.
   */
  public addOutlinedPolygon(points: { x: number; y: number }[], strokeStyle?: StrokePatternStyle) {
    if (strokeStyle === undefined) {
      strokeStyle = this.defaultStrokeStyle;
    }

    if (strokeStyle.pattern === undefined) {
      this.addSolidOutlinedPolygon(points, strokeStyle);
    } else {
      this.addDashedPolyline([...points, points[0]], strokeStyle);
    }
  }

  protected addSolidOutlinedRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    strokeStyle: StrokePatternStyle,
  ) {
    this.graphics.rect(x, y, width, height);
    this.graphics.stroke(strokeStyle);
  }

  protected addDashedOutlinedRectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    strokeStyle: StrokePatternStyle,
  ) {
    const topLeft = { x, y };
    const topRight = { x: x + width, y };
    const bottomLeft = { x, y: y + height };
    const bottomRight = { x: x + width, y: y + height };

    this.addDashedPolyline([topLeft, topRight, bottomRight, bottomLeft, topLeft], strokeStyle);
  }

  protected addSolidOutlinedCircle(x: number, y: number, radius: number, strokeStyle: StrokePatternStyle) {
    this.graphics.circle(x, y, radius);
    this.graphics.stroke(strokeStyle);
  }

  protected addDashedOutlinedCircle(
    x: number,
    y: number,
    radius: number,
    strokeStyle: StrokePatternStyle,
    numberOfSegments: number = 32,
  ) {
    const points = Array.from({ length: numberOfSegments }, (_, i) => {
      const angle = (i / numberOfSegments) * Math.PI * 2;
      return { x: x + radius * Math.cos(angle), y: y + radius * Math.sin(angle) };
    });

    this.addDashedPolyline(points, strokeStyle);
  }

  protected addSolidOutlinedPolygon(points: { x: number; y: number }[], strokeStyle: StrokePatternStyle) {
    this.graphics.poly(points);
    this.graphics.stroke(strokeStyle);
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
