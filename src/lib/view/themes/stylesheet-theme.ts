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

  style: CSSStyleDeclaration;

  constructor(style: CSSStyleDeclaration) {
    this.style = style;
    this.initializeObserver();

    this.groundTypes = {
      land: { fillColor: getVariable("--land-fill-color", this.style) },
      water: { fillColor: getVariable("--water-fill-color", this.style) },
      lava: { fillColor: getVariable("--lava-fill-color", this.style) },
      void: { fillColor: getVariable("--void-fill-color", this.style) },
    };
    this.point = {
      radius: parseFloat(getVariable("--point-radius", this.style)),
    };
    this.coastline = {
      outline: {
        color: getVariable("--coastline-outline-color", this.style),
        width: parseFloat(getVariable("--coastline-outline-width", this.style)),
      },
    };
    this.rivers = {
      fillColor: getVariable("--river-fill-color", this.style),
    };
  }

  protected initializeObserver() {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", event => {
      this.update();
    });
  }

  protected update() {
    this.groundTypes = {
      land: { fillColor: getVariable("--land-fill-color", this.style) },
      water: { fillColor: getVariable("--water-fill-color", this.style) },
      lava: { fillColor: getVariable("--lava-fill-color", this.style) },
      void: { fillColor: getVariable("--void-fill-color", this.style) },
    };
    this.point = {
      radius: parseFloat(getVariable("--point-radius", this.style)),
    };
    this.coastline = {
      outline: {
        color: getVariable("--coastline-outline-color", this.style),
        width: parseFloat(getVariable("--coastline-outline-width", this.style)),
      },
    };
    this.rivers = {
      fillColor: getVariable("--river-fill-color", this.style),
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
