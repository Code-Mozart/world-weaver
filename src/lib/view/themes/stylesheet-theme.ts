import type { Theme } from "$lib/view/themes/theme";

export class StylesheetTheme implements Theme {
  name: string = StylesheetTheme.name;
  description: string =
    "A theme defined by a stylesheet. May be context-aware \
    through CSS selectors (e.g. supporting light and dark mode)";

  groundTypes: Theme.GroundTypes;
  coastline: Theme.Coastline;
  rivers: Theme.Rivers;

  constructor(style: CSSStyleDeclaration) {
    this.groundTypes = {
      land: { fillColor: getVariable("--land-fill-color", style) },
      water: { fillColor: getVariable("--water-fill-color", style) },
      lava: { fillColor: getVariable("--lava-fill-color", style) },
      void: { fillColor: getVariable("--void-fill-color", style) },
    };
    this.coastline = {
      outline: {
        color: getVariable("--coastline-outline-color", style),
        width: parseFloat(getVariable("--coastline-outline-width", style)),
      },
    };
    this.rivers = {
      fillColor: getVariable("--river-fill-color", style),
    };
  }
}

function getVariable(variableName: string, style: CSSStyleDeclaration): string {
  return style.getPropertyValue(variableName);
}
