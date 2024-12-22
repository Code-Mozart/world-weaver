import type { ColorSource, StrokeStyle } from "pixi.js";

export interface Theme {
  name: string;
  description: string;

  groundTypes: Theme.GroundTypes;
  coastline: Theme.Coastline;
  rivers: Theme.Rivers;
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

  export interface Coastline {
    outline: StrokeStyle;
  }

  export interface Rivers {
    fillColor: ColorSource;
  }
}
