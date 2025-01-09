import type { Change } from "$lib/deltas/change";
import type { EditorWorld } from "$lib/types/editor/world";
import { DoublyLinkedList } from "$lib/types/linked-list";

export class ChangeHistory {
  protected changes: DoublyLinkedList<Change>;
  protected current: DoublyLinkedList.Node<Change> | null;
  protected isCurrentApplied: boolean;

  constructor() {
    this.changes = new DoublyLinkedList<Change>();
    this.current = null;
    this.isCurrentApplied = false;
  }

  public setCurrent(change: Change) {
    this.pruneUndoneChanges();
    this.push(change);
  }

  public undo(world: EditorWorld): Change | null {
    if (this.current === null) {
      return null;
    }

    if (!this.isCurrentApplied) {
      if (this.previous === null) {
        return null;
      }
      this.current = this.previous;
    }

    return this.undoCurrent(world);
  }

  public redo(world: EditorWorld): Change | null {
    if (this.current === null) {
      return null;
    }

    if (this.isCurrentApplied) {
      if (this.next === null) {
        return null;
      }
      this.current = this.next;
    }

    return this.redoCurrent(world);
  }

  protected pruneUndoneChanges() {
    if (this.current !== null) {
      if (!this.isCurrentApplied) {
        const previous = this.previous;
        this.changes.remove(this.current);
        this.current = previous;
      }

      if (this.current === null) {
        this.changes.clear();
      } else {
        this.changes.removeAfter(this.current);
      }
    }
  }

  protected push(change: Change) {
    this.current = this.changes.push(change);
    this.isCurrentApplied = true;
  }

  protected undoCurrent(world: EditorWorld) {
    const change = this.current!.value;
    if (change.undo(world)) {
      this.isCurrentApplied = false;
      return change;
    }
    return null;
  }

  protected redoCurrent(world: EditorWorld) {
    const change = this.current!.value;
    if (change.redo(world)) {
      this.isCurrentApplied = true;
      return change;
    }
    return null;
  }

  protected get previous() {
    return this.current?.previous ?? null;
  }

  protected get next() {
    return this.current?.next ?? null;
  }
}
