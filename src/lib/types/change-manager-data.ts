import type { Change } from "$lib/deltas/change";
import type { DoublyLinkedList } from "./linked-list";

export interface ChangeManagerData {
  list: DoublyLinkedList<Change>;
  current: DoublyLinkedList.Node<Change> | null;
  isCurrentApplied: boolean;
}
