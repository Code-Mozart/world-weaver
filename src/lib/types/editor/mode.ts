export enum Mode {
  View = "view",
  Move = "move",
  Select = "select",
}

export interface SetMode {
  (mode: Mode): void;
}
