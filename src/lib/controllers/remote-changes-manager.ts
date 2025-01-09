import type { Change } from "$lib/deltas/change";
import type { Delta } from "$lib/deltas/delta";
import type { ChangeManagerData } from "$lib/types/change-manager-data";
import type { DoublyLinkedList } from "$lib/types/linked-list";

const MAX_NEW_LOCAL_CHANGES = 3;
const MAX_SECONDS_SINCE_LAST_UPLOAD = 3;

export class RemoteChangesManager {
  protected changes: ChangeManagerData;
  protected remote: DoublyLinkedList.Node<Change> | null;
  protected remotePosition: RemotePosition;
  protected prunedChangesDeltas: Delta[];
  protected lastUploadedAt: Date;

  constructor(changes: ChangeManagerData) {
    this.changes = changes;
    this.remote = null;
    this.remotePosition = RemotePosition.AtCurrent;
    this.prunedChangesDeltas = [];
    this.lastUploadedAt = new Date(0);
  }

  public beforeMovingCurrentBack() {
    if (this.remote === this.changes.current) {
      this.remotePosition = RemotePosition.Ahead;
    }
  }

  public beforeMovingCurrentForward() {
    if (this.remote === this.changes.current) {
      this.remotePosition = RemotePosition.Behind;
    }
  }

  public afterMovingCurrent() {
    if (this.remote === this.changes.current) {
      this.remotePosition = RemotePosition.AtCurrent;
    }
  }

  public afterMovingCurrentForward() {
    this.remotePosition = RemotePosition.Behind;
  }

  public beforePruning() {
    console.assert(this.changes.current !== null, "current should never be null on pruning");

    switch (this.remotePosition) {
      case RemotePosition.Behind:
        /*
           ...
           applied [remote]
           ...
           applied [current]
             /     \
        pruned     new [new current]
        ...        ...
  
        */
        // => do nothing
        break;
      case RemotePosition.AtCurrent:
        if (!this.changes.isCurrentApplied) {
          /*

          step 1 (this is the state at the beginning of the function)
                      ...
                      applied [new remote]
                      /                \
          undone [current, remote]     new [new current]
          ...                          ...        

          step 2
                ...
                applied [current, new remote]
                      /                \
              undone [remote]     new [new current]
              ...                          ...

          step 3
                      ...
                      applied [remote]
                        /           \
                    pruned     new [current]
                    ...        ...

          */
          console.assert(this.remote === this.changes.current, "remote should be at current");
          // if remote === current && current !== null then that means remote !== null

          this.prunedChangesDeltas = [this.changes.current!.value.backward];
          this.remote = this.changes.current!.previous;
        }
        break;
      case RemotePosition.Ahead:
        /*
           ...
           applied [current, new remote]
             /              \
        pruned              new [new current]
        ...                 ...
        pruned [remote]
        pruned
        ...
  
        */
        console.assert(this.remote !== null, "remote should never be null because it is ahead of current");

        const from = this.remote!;
        const to = this.changes.current!.next;
        this.prunedChangesDeltas = this.changes.list.getPrevious(from, to!).map(change => change.backward);
        this.remote = this.changes.current;
        break;
    }
  }

  public maybeUpload() {
    // temp: only for debug
    printChangesList(this.changes, this.remote, this.remotePosition);

    const { deltas, newRemote, newRemotePosition } = this.getDeltas();

    // temp: only for debug
    console.log("Deltas:", deltas);
    console.log("Deltas for pruned changes:", this.prunedChangesDeltas);

    if (this.shouldUpload(deltas.length + this.prunedChangesDeltas.length)) {
      this.upload(deltas);
      this.remote = newRemote;
      this.remotePosition = newRemotePosition;
      this.prunedChangesDeltas = [];

      // temp: only for debug
      printChangesList(this.changes, this.remote, this.remotePosition, "Changes list after upload");
    }
  }

  protected shouldUpload(newLocalChangesCount: number): boolean {
    return (
      newLocalChangesCount > MAX_NEW_LOCAL_CHANGES ||
      (Date.now() - this.lastUploadedAt.getTime()) / 1000.0 > MAX_SECONDS_SINCE_LAST_UPLOAD
    );
  }

  protected getDeltas(): {
    deltas: Delta[];
    newRemote: DoublyLinkedList.Node<Change> | null;
    newRemotePosition: RemotePosition;
  } {
    if (this.remotePosition === RemotePosition.Behind) {
      return this.getDeltasAhead();
    } else if (this.remotePosition === RemotePosition.Ahead) {
      return this.getDeltasBehind();
    } else if (this.remotePosition === RemotePosition.AtCurrent && !this.changes.isCurrentApplied) {
      return this.getDeltasAtCurrent();
    } else {
      return this.getDeltasResult();
    }
  }

  protected getDeltasAhead() {
    const from = this.remote?.next ?? this.changes.list.head;
    if (from === this.changes.current && !this.changes.isCurrentApplied) {
      // ...
      // applied  [remote, new remote]
      // undone   [current]
      // ...
      return this.getDeltasResult({ deltas: [] });
    } else {
      // ...
      // applied          [remote]
      // ...
      // applied          [new remote]
      // applied/undone   [current]
      // ...
      const to = this.changes.isCurrentApplied ? this.changes.current : this.changes.current!.previous;
      const deltas = from === null ? [] : this.changes.list.getNext(from, to!).map(change => change.forward);
      return { deltas, newRemote: to, newRemotePosition: RemotePosition.AtCurrent };
    }
  }

  protected getDeltasBehind() {
    let to, newRemotePosition;
    if (this.changes.isCurrentApplied) {
      // ...
      // applied    [current, new remote]
      // undone
      // ...
      // undone     [remote]
      // ...
      to = this.changes.current!.next;
      newRemotePosition = RemotePosition.AtCurrent;
    } else {
      // ...
      // applied    [new remote]
      // undone     [current]
      // undone
      // ...
      // undone     [remote]
      // ...
      to = this.changes.current;
      newRemotePosition = RemotePosition.Behind;
    }
    const from = this.remote?.previous ?? this.changes.list.tail;
    const deltas = from === null ? [] : this.changes.list.getPrevious(from, to!).map(change => change.backward);
    return { deltas, newRemote: to?.previous ?? null, newRemotePosition };
  }

  protected getDeltasAtCurrent() {
    // ...
    // applied  [new remote]
    // undone   [current, remote]
    // ...
    const delta = this.remote!.value.backward;
    return {
      deltas: [delta],
      newRemote: this.changes.current?.previous ?? null,
      newRemotePosition: RemotePosition.Behind,
    };
  }

  protected getDeltasResult(overrides?: {
    deltas?: Delta[];
    newRemote?: DoublyLinkedList.Node<Change> | null;
    newRemotePosition?: RemotePosition;
  }) {
    return { deltas: [], newRemote: this.remote, newRemotePosition: this.remotePosition, ...overrides };
  }

  protected upload(deltas: Delta[]) {
    this.lastUploadedAt = new Date();
    console.log("Uploading deltas:", deltas);
  }
}

enum RemotePosition {
  Behind = -1,
  AtCurrent = 0,
  Ahead = 1,
}

function printChangesList(
  data: ChangeManagerData,
  remote: DoublyLinkedList.Node<Change> | null,
  remotePosition: RemotePosition,
  title: string = "Changes list",
) {
  const lines = [];
  if (remote === null) {
    lines.push("null".padEnd(17, " ") + "remote");
  }

  if (data.current === null) {
    lines.push("null".padEnd(17, " ") + "current remote");
  } else {
    function addNode(node: DoublyLinkedList.Node<Change> | null) {
      const isCurrent = node === data.current;
      let line = (node ? "'" + node.value.backward.CUID.slice(0, 4) + "'" : "null").padEnd(7, " ");
      line += (isAfterCurrent || (isCurrent && !data.isCurrentApplied) ? "undone" : "applied").padEnd(10, " ");
      if (isCurrent) {
        isAfterCurrent = true;
        line += "current ";
      }
      if (node === remote) {
        line += "remote";
      }
      lines.push(line);
    }

    let node = data.list.head;
    let isAfterCurrent = false;
    while (node !== data.list.tail) {
      addNode(node);
      node = node?.next ?? null;
    }
    addNode(node);
  }

  console.log(`${title}:\n`, lines.join("\n "));
  console.log("remotePosition:", remotePosition);
}
