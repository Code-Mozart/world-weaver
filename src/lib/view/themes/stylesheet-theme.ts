import { resolveColor } from "$lib/util/color-helpers";
import type { Theme } from "$lib/view/themes/theme";

export class StylesheetTheme implements Theme {
  name: string = StylesheetTheme.name;
  description: string =
    "A theme defined by a stylesheet. May be context-aware \
    through CSS selectors (e.g. supporting light and dark mode)";

  point: Theme.Point;
  groundTypes: Theme.GroundTypes;
  coastline: Theme.Coastline;
  rivers: Theme.Rivers;

  controls: Theme.Controls;

  style: CSSStyleDeclaration;

  constructor(style: CSSStyleDeclaration) {
    this.style = style;
    this.initializeObserver();

    this.groundTypes = {
      land: { fillColor: getColorSource("--land-fill-color", this.style) },
      water: { fillColor: getColorSource("--water-fill-color", this.style) },
      lava: { fillColor: getColorSource("--lava-fill-color", this.style) },
      void: { fillColor: getColorSource("--void-fill-color", this.style) },
    };
    this.point = {
      radius: getNumber("--point-radius", this.style),
    };
    this.coastline = {
      outline: {
        color: getColorSource("--coastline-outline-color", this.style),
        width: getNumber("--coastline-outline-width", this.style),
      },
    };
    this.rivers = {
      fillColor: getColorSource("--river-fill-color", this.style),
    };

    this.controls = {
      cursorRadius: getNumber("--cursor-radius", this.style),
      cursorColor: getColorSource("--cursor-color", this.style),

      selectionBoxBorderColor: getColorSource("--selection-box-border-color", this.style),
      selectionBoxBorderWidth: getNumber("--selection-box-border-width", this.style),
      slectionBoxBorderPattern: getNumberArray("--selection-box-border-pattern", this.style),
      selectionBoxFillColor: getColorSource("--selection-box-fill-color", this.style),
    };
  }

  protected initializeObserver() {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
      this.update();
    });
  }

  protected update() {
    this.groundTypes = {
      land: { fillColor: getColorSource("--land-fill-color", this.style) },
      water: { fillColor: getColorSource("--water-fill-color", this.style) },
      lava: { fillColor: getColorSource("--lava-fill-color", this.style) },
      void: { fillColor: getColorSource("--void-fill-color", this.style) },
    };
    this.point = {
      radius: getNumber("--point-radius", this.style),
    };
    this.coastline = {
      outline: {
        color: getColorSource("--coastline-outline-color", this.style),
        width: getNumber("--coastline-outline-width", this.style),
      },
    };
    this.rivers = {
      fillColor: getColorSource("--river-fill-color", this.style),
    };

    this.controls = {
      cursorRadius: getNumber("--cursor-radius", this.style),
      cursorColor: getColorSource("--cursor-color", this.style),

      selectionBoxBorderColor: getColorSource("--selection-box-border-color", this.style),
      selectionBoxBorderWidth: getNumber("--selection-box-border-width", this.style),
      slectionBoxBorderPattern: getNumberArray("--selection-box-border-pattern", this.style),
      selectionBoxFillColor: getColorSource("--selection-box-fill-color", this.style),
    };
  }
}

function getVariable(variableName: string, style: CSSStyleDeclaration): string {
  const value = style.getPropertyValue(variableName);
  if (value === "") {
    throw new Error(`Missing CSS variable: ${variableName}`);
  }
  return value;
}

function getColorSource(variableName: string, style: CSSStyleDeclaration): string {
  const value = getVariable(variableName, style);
  return resolveColor(value);
}

function getNumber(variableName: string, style: CSSStyleDeclaration): number {
  return parseFloat(getVariable(variableName, style));
}

function getNumberArray(variableName: string, style: CSSStyleDeclaration): number[] {
  const rawValue = getVariable(variableName, style);
  const value = JSON.parse(rawValue);
  if (!Array.isArray(value)) {
    throw new Error(`Expected array for CSS variable ${variableName}, but got '${rawValue}'`);
  }
  value.forEach((element, index) => {
    if (typeof element !== "number") {
      throw new Error(`Expected number array for CSS variable ${variableName}, but element ${index} is not a number`);
    }
  });
  return value;
}
