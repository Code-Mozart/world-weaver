import { Colors } from "$lib/drawing/colors";
import { Drawing } from "$lib/drawing/drawing";
import { Viewport } from "pixi-viewport";

/**
 * This class is responsible for drawing the world.
 */
export class WorldDrawer {
  protected _viewport: Viewport;
  protected drawing: Drawing;
  protected worldData: any;
  protected style: CSSStyleDeclaration;

  get viewport() {
    return this._viewport;
  }

  constructor(viewport: Viewport, drawing: Drawing, worldData: any, style: CSSStyleDeclaration) {
    this._viewport = viewport;
    this.drawing = drawing;
    this.worldData = worldData;
    this.style = style;
  }

  public draw() {
    const primaryColor = this.style.getPropertyValue("--primary-color");

    const nodesMap: Map<number, { x: number; y: number }> = this.worldData.nodesMap;
    const polygons: { Nodes: { nodeId: number; nextNodeId: number }[] }[] = this.worldData.polygons;

    this.drawing.addOutlinedRectangle(0, 0, 1000, 1000, {
      pattern: [20, 20],
      color: Colors.gray,
      width: 5,
    });

    nodesMap.forEach((node: { x: number; y: number }) => {
      this.drawing.addFilledCircle(node.x, node.y, 5, primaryColor);
    });

    this.drawing.defaultStrokeStyle = { color: primaryColor, width: 2 };
    polygons.forEach((polygon: { Nodes: { nodeId: number; nextNodeId: number }[] }) => {
      polygon.Nodes.forEach(polygonNode => {
        if (polygonNode.nextNodeId === null) {
          return;
        }

        const node = nodesMap.get(polygonNode.nodeId);
        const nextNode = nodesMap.get(polygonNode.nextNodeId);

        if (node === undefined || nextNode === undefined) {
          return;
        }

        this.drawing.addLine(node.x, node.y, nextNode.x, nextNode.y);
      });
    });
  }
}
