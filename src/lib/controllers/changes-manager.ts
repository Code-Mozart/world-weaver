import type { Change } from "$lib/deltas/change";
import type { EditorWorld } from "$lib/types/editor/world";
import { DoublyLinkedList } from "$lib/types/linked-list";

export class ChangesManager {
  protected world: EditorWorld;

  protected changes: DoublyLinkedList<Change>;
  protected current: DoublyLinkedList.Node<Change> | null;
  protected isCurrentApplied: boolean;
  protected remote: DoublyLinkedList.Node<Change> | null;

  constructor(world: EditorWorld) {
    this.world = world;

    this.changes = new DoublyLinkedList<Change>();
    this.current = null;
    this.isCurrentApplied = false;
    this.remote = null;
  }

  public setMostRecent(change: Change) {
    if (this.current !== null) {
      if (!this.isCurrentApplied && this.previous !== null) {
        this.current = this.previous;
      }
      this.changes.removeAfter(this.current);
    }
    this.current = this.changes.push(change);
    this.isCurrentApplied = true;
  }

  public undo(): boolean {
    if (this.current === null) {
      return false;
    }

    if (!this.isCurrentApplied) {
      if (this.previous === null) {
        console.log("No previous change to undo");
        return false;
      }
      this.current = this.previous;
    }

    return this.undoCurrent();
  }

  public redo(): boolean {
    if (this.current === null) {
      return false;
    }

    if (this.isCurrentApplied) {
      if (this.next === null) {
        console.log("No next change to redo");
        return false;
      }
      this.current = this.next;
    }

    return this.redoCurrent();
  }

  protected undoCurrent() {
    const change = this.current!.value;

    // temp
    console.log(`Undoing change, change and change list are`, change, this.changes);

    if (change.undo(this.world)) {
      this.isCurrentApplied = false;
      return true;
    }
    return false;
  }

  protected redoCurrent() {
    const change = this.current!.value;

    // temp
    console.log(`Redoing change, change and change list are`, change, this.changes);

    if (change.redo(this.world)) {
      this.isCurrentApplied = true;
      return true;
    }
    return false;
  }

  protected get previous(): DoublyLinkedList.Node<Change> | null {
    return this.current?.previous ?? null;
  }

  protected get next(): DoublyLinkedList.Node<Change> | null {
    return this.current?.next ?? null;
  }
}
