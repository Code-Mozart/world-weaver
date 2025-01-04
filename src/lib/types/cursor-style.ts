export type CursorStyle = "default" | "move";

export interface SetCursorIcon {
  (cursorStyle: CursorStyle): void;
}
