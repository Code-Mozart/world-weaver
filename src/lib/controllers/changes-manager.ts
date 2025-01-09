import type { Change } from "$lib/deltas/change";
import type { ChangeManagerData } from "$lib/types/change-manager-data";
import type { EditorWorld } from "$lib/types/editor/world";
import { DoublyLinkedList } from "$lib/types/linked-list";
import { RemoteChangesManager } from "./remote-changes-manager";

export class ChangesManager {
  protected world: EditorWorld;
  protected remote: RemoteChangesManager;
  protected changes: ChangeManagerData;

  constructor(world: EditorWorld) {
    this.world = world;
    this.changes = {
      list: new DoublyLinkedList<Change>(),
      current: null,
      isCurrentApplied: false,
    };
    this.remote = new RemoteChangesManager(this.changes);
  }

  public setCurrent(change: Change) {
    // 1. remove all changes that have been applied,
    // but were undone again before this change
    this.removeUndoneChanges();

    // 2. push the new change
    this.push(change);

    // 3. notify the remote manager that current was moved
    this.remote.afterMovingCurrentForward();

    // 4. call the remote manager to maybe upload the deltas
    this.remote.maybeUpload();
  }

  public undo(): boolean {
    if (this.current === null) {
      return false;
    }

    if (!this.isCurrentApplied) {
      if (this.previous === null) {
        return false;
      }
      this.remote.beforeMovingCurrentBack();
      this.current = this.previous;
      this.remote.afterMovingCurrent();
    }

    return this.undoCurrent();
  }

  public redo(): boolean {
    if (this.current === null) {
      return false;
    }

    if (this.isCurrentApplied) {
      if (this.next === null) {
        return false;
      }
      this.remote.beforeMovingCurrentForward();
      this.current = this.next;
      this.remote.afterMovingCurrent();
    }

    return this.redoCurrent();
  }

  protected removeUndoneChanges() {
    if (this.current !== null) {
      // TODO: if the remote is ahead, save all changes up to the current,
      //       so that they can be safely undone on the remote

      if (!this.isCurrentApplied) {
        this.changes.list.remove(this.current);
        this.current = this.previous;
      }

      if (this.current !== null) {
        this.changes.list.removeAfter(this.current);
      }
    }
  }

  protected push(change: Change) {
    this.current = this.changes.list.push(change);
    this.isCurrentApplied = true;
  }

  protected undoCurrent() {
    const change = this.current!.value;
    if (change.undo(this.world)) {
      this.isCurrentApplied = false;
      this.remote.maybeUpload();
      return true;
    }
    return false;
  }

  protected redoCurrent() {
    const change = this.current!.value;
    if (change.redo(this.world)) {
      this.isCurrentApplied = true;
      this.remote.maybeUpload();
      return true;
    }
    return false;
  }

  protected get current() {
    return this.changes.current;
  }

  protected set current(node: DoublyLinkedList.Node<Change> | null) {
    this.changes.current = node;
  }

  protected get isCurrentApplied() {
    return this.changes.isCurrentApplied;
  }

  protected set isCurrentApplied(value: boolean) {
    this.changes.isCurrentApplied = value;
  }

  protected get previous() {
    return this.current?.previous ?? null;
  }

  protected get next() {
    return this.current?.next ?? null;
  }
}
