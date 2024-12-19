import { VectorMath } from "$lib/math/vector-math";
import { validateStrokePatternStyle, type StrokePatternStyle } from "$lib/types/stroke-pattern-style";
import type { Graphics } from "pixi.js";

export class DashedLinesDrawer {
  private static readonly PATTERN_IS_NULL_MESSAGE =
    "Can not construct a DashedLineDrawer without a pattern (i.e. a stroke style with pattern being undefined).";

  public graphics: Graphics;
  public style: StrokePatternStyle;

  protected patternIndex: number;
  protected isStroke: boolean;

  // This is positive for strokes and negative for gaps.
  // When it reaches 0, we set it to the next pattern element.
  protected remainingPatternLength: number;

  constructor(graphics: Graphics, style: StrokePatternStyle) {
    this.graphics = graphics;
    this.style = style;

    if (style.pattern === undefined) {
      throw new Error(DashedLinesDrawer.PATTERN_IS_NULL_MESSAGE);
    }
    validateStrokePatternStyle(style.pattern);

    this.patternIndex = 0;
    this.isStroke = this.patternIndex % 2 === 0;
    this.remainingPatternLength = style.pattern[0];
  }

  public drawLine(fromX: number, fromY: number, toX: number, toY: number) {
    const dx = toX - fromX;
    const dy = toY - fromY;

    const magnitude = VectorMath.magnitude(dx, dy);
    const normalizedX = dx / magnitude;
    const normalizedY = dy / magnitude;

    let remainingLineLength = magnitude;
    let penX = fromX;
    let penY = fromY;
    // loop until we reach the end of the line to draw, start a new iteration when we reach the end of the pattern
    while (remainingLineLength > 0) {
      const wasStroke = this.isStroke;
      let length;
      if (this.remainingPatternLength <= remainingLineLength) {
        length = this.remainingPatternLength;
        this.updateRemainingPatternLength();
      } else {
        length = remainingLineLength;
        this.remainingPatternLength -= length;
      }

      const endX = penX + length * normalizedX;
      const endY = penY + length * normalizedY;

      if (wasStroke) {
        this.graphics.moveTo(penX, penY);
        this.graphics.lineTo(endX, endY);
        this.graphics.stroke(this.style);
      }

      penX = endX;
      penY = endY;
      remainingLineLength -= length;
    }
  }

  protected updateRemainingPatternLength() {
    if (this.style.pattern === undefined) {
      throw new Error(DashedLinesDrawer.PATTERN_IS_NULL_MESSAGE);
    }

    this.patternIndex = (this.patternIndex + 1) % this.style.pattern.length;
    this.isStroke = this.patternIndex % 2 === 0;
    this.remainingPatternLength = this.style.pattern[this.patternIndex];
  }
}
