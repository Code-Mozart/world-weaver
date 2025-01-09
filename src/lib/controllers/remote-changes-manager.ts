import type { Change } from "$lib/deltas/change";
import type { Delta } from "$lib/deltas/delta";
import type { ChangeManagerData } from "$lib/types/change-manager-data";
import type { DoublyLinkedList } from "$lib/types/linked-list";

const MAX_NEW_LOCAL_CHANGES = 0;
const MAX_SECONDS_SINCE_LAST_UPLOAD = 300;

export class RemoteChangesManager {
  protected changes: ChangeManagerData;
  protected remote: DoublyLinkedList.Node<Change> | null;
  protected remotePosition: RemotePosition;
  protected lastUploadedAt: Date;

  constructor(changes: ChangeManagerData) {
    this.changes = changes;
    this.remote = null;
    this.remotePosition = RemotePosition.AtCurrent;
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

  public maybeUpload() {
    // temp: only for debug
    printChangesList(this.changes, this.remote, this.remotePosition);

    const { deltas, newRemote, newRemotePosition } = this.getDeltas();

    // temp: only for debug
    console.log("Deltas:", deltas);

    if (this.shouldUpload(deltas.length)) {
      this.upload(deltas);
      this.remote = newRemote;
      this.remotePosition = newRemotePosition;

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
      // applied  remote, newRemote
      // undone   current
      // ...
      return this.getDeltasResult({ deltas: [] });
    } else {
      // ...
      // applied          remote
      // ...
      // applied          newRemote
      // applied/undone   current
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
      // applied    current, newRemote
      // undone
      // ...
      // undone     remote
      // ...
      to = this.changes.current!.next;
      newRemotePosition = RemotePosition.AtCurrent;
    } else {
      // ...
      // applied    newRemote
      // undone     current
      // undone
      // ...
      // undone     remote
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
    // applied  newRemote
    // undone   current, remote
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
