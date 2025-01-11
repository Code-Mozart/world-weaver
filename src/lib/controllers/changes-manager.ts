import { Client } from "$lib/api/client";
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
    const client = new Client(world.cuid);
    this.remote = new RemoteDeltaQueue(client);
  }

  public setCurrent(change: Change) {
    this.history.setCurrent(change);
    this.remote.setCurrent(change);
    this.remote.maybeUpload();
  }

  public undo(): boolean {
    const change = this.history.undo(this.world);
    if (change !== null) {
      this.remote.undo(change);
      this.remote.maybeUpload();
      return true;
    }
    return false;
  }

  public redo(): boolean {
    const change = this.history.redo(this.world);
    if (change !== null) {
      this.remote.redo(change);
      this.remote.maybeUpload();
      return true;
    }
    return false;
  }
}
