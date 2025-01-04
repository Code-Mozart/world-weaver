import type { ColorSource, StrokeStyle } from "pixi.js";

export interface Theme {
  name: string;
  description: string;

  groundTypes: Theme.GroundTypes;
  point: Theme.Point;
  coastline: Theme.Coastline;
  rivers: Theme.Rivers;

  controls: Theme.Controls;
}

export namespace Theme {
  export interface GroundType {
    fillColor: ColorSource;
  }

  export interface GroundTypes {
    land: GroundType;
    water: GroundType;
    lava: GroundType;
    void: GroundType;
  }

  export interface Point {
    radius: number;
    selectedFillColor: ColorSource;
  }

  export interface Coastline {
    outline: StrokeStyle;
  }

  export interface Rivers {
    fillColor: ColorSource;
  }

  export interface Controls {
    cursorRadius: number;
    cursorColor: ColorSource;

    selectionBoxBorderColor: ColorSource;
    selectionBoxBorderWidth: number;
    slectionBoxBorderPattern: number[];
    selectionBoxFillColor: ColorSource;
  }
}
