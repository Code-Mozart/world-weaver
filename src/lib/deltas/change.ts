import type { Delta } from "$lib/deltas/delta";
import type { EditorWorld } from "$lib/types/editor/world";

export class Change {
  public forward: Delta;
  public backward: Delta;

  constructor(forward: Delta, backward: Delta) {
    this.forward = forward;
    this.backward = backward;
  }

  undo(world: EditorWorld): boolean {
    return this.backward.apply(world);
  }

  redo(world: EditorWorld): boolean {
    return this.forward.apply(world);
  }
}
