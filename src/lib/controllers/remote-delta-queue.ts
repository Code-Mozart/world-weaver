import type { Client } from "$lib/api/client";
import type { Change } from "$lib/deltas/change";
import type { Delta } from "$lib/deltas/delta";
import { DoublyLinkedList } from "$lib/types/linked-list";

const MAX_NEW_LOCAL_CHANGES = 3;
const MAX_SECONDS_SINCE_LAST_UPLOAD = 3;

export class RemoteDeltaQueue {
  protected deltas: DoublyLinkedList<Delta>;

  protected newLocalChangesCount;
  protected lastUploadedAt: Date;

  protected client: Client;

  constructor(client: Client) {
    this.deltas = new DoublyLinkedList<Delta>();

    this.newLocalChangesCount = 0;
    this.lastUploadedAt = new Date(0);

    this.client = client;
  }

  public setCurrent(change: Change) {
    this.deltas.push(change.forward);
    this.newLocalChangesCount++;
  }

  public undo(change: Change) {
    if (this.deltas.isEmpty || !this.isUndoingPrevious(change)) {
      this.deltas.push(change.backward);
      this.newLocalChangesCount++;
    } else {
      this.deltas.popTail();
      this.newLocalChangesCount--;
    }
  }

  public redo(change: Change) {
    if (this.deltas.isEmpty || !this.isRedoingPrevious(change)) {
      this.deltas.push(change.forward);
      this.newLocalChangesCount++;
    } else {
      this.deltas.popHead();
      this.newLocalChangesCount--;
    }
  }

  public maybeUpload() {
    if (this.shouldUpload()) {
      this.upload();
    }
  }

  protected isUndoingPrevious(change: Change) {
    return this.deltas.head!.value === change.forward;
  }

  protected isRedoingPrevious(change: Change) {
    return this.deltas.head!.value === change.backward;
  }

  protected shouldUpload(): boolean {
    return (
      this.newLocalChangesCount > MAX_NEW_LOCAL_CHANGES ||
      (Date.now() - this.lastUploadedAt.getTime()) / 1000.0 > MAX_SECONDS_SINCE_LAST_UPLOAD
    );
  }

  protected upload() {
    this.lastUploadedAt = new Date();
    this.newLocalChangesCount = 0;

    this.client.patchWorld([...this.deltas]);

    this.deltas.clear();
  }
}
