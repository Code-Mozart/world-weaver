import type { Change } from "$lib/deltas/change";
import type { EditorWorld } from "$lib/types/editor/world";
import { ChangeHistory } from "./change-history";
import { RemoteDeltaQueue } from "./remote-delta-queue";

export class ChangesManager {
  protected world: EditorWorld;

  protected history: ChangeHistory;
  protected remote: RemoteDeltaQueue;

  constructor(world: EditorWorld) {
    this.world = world;

    this.history = new ChangeHistory();
    this.remote = new RemoteDeltaQueue();
  }

  public setCurrent(change: Change) {
    this.history.setCurrent(change);
    this.remote.setCurrent(change);
  }

  public undo(): boolean {
    const change = this.history.undo(this.world);
    if (change !== null) {
      this.remote.undo(change);
      return true;
    }
    return false;
  }

  public redo(): boolean {
    const change = this.history.redo(this.world);
    if (change !== null) {
      this.remote.redo(change);
      return true;
    }
    return false;
  }
}
