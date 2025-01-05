import { Drawing } from "$lib/drawing/drawing";
import { Viewport } from "pixi-viewport";
import type { Theme } from "$lib/view/themes/theme";
import type { Rectangle } from "$lib/types/math/rectangle";
import type { GetHTMLElement } from "$lib/types/get-html-element";
import type { CursorStyle } from "$lib/types/cursor-style";

/**
 * This class is responsible for drawing the world.
 */
export class ControlsDrawer {
  protected _viewport: Viewport;
  protected worldSpaceDrawing: Drawing;
  protected screenSpaceDrawing: Drawing;
  protected theme: Theme;

  protected getHTMLElement: GetHTMLElement;

  protected cursorPosition: { x: number; y: number; visible: boolean };
  protected selectionBox: Rectangle | null;

  get viewport() {
    return this._viewport;
  }

  constructor(
    viewport: Viewport,
    worldSpaceDrawing: Drawing,
    screenSpaceDrawing: Drawing,
    theme: Theme,
    onGetHTMLElement: GetHTMLElement,
  ) {
    this._viewport = viewport;
    this.worldSpaceDrawing = worldSpaceDrawing;
    this.screenSpaceDrawing = screenSpaceDrawing;
    this.theme = theme;

    this.getHTMLElement = onGetHTMLElement;

    this.cursorPosition = { x: 0, y: 0, visible: false };
    this.selectionBox = null;
  }

  public draw() {
    if (this.cursorPosition.visible) {
      console.log(`Drawing cursor at ${this.cursorPosition.x}, ${this.cursorPosition.y}`);

      this.screenSpaceDrawing.addFilledCircle(
        this.cursorPosition.x,
        this.cursorPosition.y,
        this.theme.controls.cursorRadius,
        this.theme.controls.cursorColor,
      );

      this.cursorPosition.visible = false;
    }

    if (this.selectionBox !== null) {
      this.screenSpaceDrawing.addOutlinedRectangle(
        this.selectionBox.x,
        this.selectionBox.y,
        this.selectionBox.width,
        this.selectionBox.height,
        {
          color: this.theme.controls.selectionBoxBorderColor,
          width: this.theme.controls.selectionBoxBorderWidth,
          pattern: this.theme.controls.slectionBoxBorderPattern,
        },
      );

      this.screenSpaceDrawing.addFilledRectangle(
        this.selectionBox.x,
        this.selectionBox.y,
        this.selectionBox.width,
        this.selectionBox.height,
        this.theme.controls.selectionBoxFillColor,
      );
    }
  }

  public drawCursorPosition(screenX: number, screenY: number) {
    this.cursorPosition.visible = true;
    this.cursorPosition.x = screenX;
    this.cursorPosition.y = screenY;
  }

  public setSelectionBox(rectangle: Rectangle | null) {
    this.selectionBox = rectangle;
  }

  public setCursorIcon(cursorStyle: CursorStyle) {
    this.getHTMLElement().style.cursor = cursorStyle;
  }
}
