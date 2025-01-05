export class DoublyLinkedList<T> {
  protected head: DoublyLinkedList.Node<T> | null;
  protected tail: DoublyLinkedList.Node<T> | null;

  constructor() {
    this.head = null;
    this.tail = null;
  }

  public push(value: T): DoublyLinkedList.Node<T> {
    if (this.head === null) {
      this.head = new DoublyLinkedList.Node(value);
      this.tail = this.head;
      return this.head;
    } else {
      return this.tail!.insertAfter(value);
    }
  }

  public removeAfter(node: DoublyLinkedList.Node<T>) {
    // assert that node is in this list
    if (!this.hasNode(node)) {
      throw new Error("Node does not exist in this list");
    }

    if (node.next !== null) {
      node.next.remove();
      node.next = null;
    }
    this.tail = node;
  }

  public [Symbol.iterator](): Iterator<T> {
    let current = this.head;
    return {
      next: () => {
        if (current === null) {
          return { value: undefined, done: true };
        }
        const value = current.value;
        current = current.next;
        return { value, done: false };
      },
    };
  }

  protected hasNode(node: DoublyLinkedList.Node<T>): boolean {
    return this.find(n => n === node) !== null;
  }

  protected find(predicate: (value: DoublyLinkedList.Node<T>) => boolean): DoublyLinkedList.Node<T> | null {
    for (let current = this.head; current !== null; current = current.next) {
      if (predicate(current)) {
        return current;
      }
    }
    return null;
  }
}

export namespace DoublyLinkedList {
  export class Node<T> {
    value: T;
    next: Node<T> | null;
    previous: Node<T> | null;

    constructor(value: T) {
      this.value = value;
      this.next = null;
      this.previous = null;
    }

    public allAfter(): DoublyLinkedList<T> {
      const list = new DoublyLinkedList<T>();
      let current = this.next;
      while (current !== null) {
        list.push(current.value);
        current = current.next;
      }
      return list;
    }

    public insertAfter(value: T): DoublyLinkedList.Node<T> {
      const next = this.next;
      const newNode = new DoublyLinkedList.Node(value);
      this.next = newNode;
      newNode.previous = this;
      newNode.next = next;
      if (next !== null) {
        next.previous = newNode;
      }
      return newNode;
    }

    public remove() {
      const previous = this.previous;
      const next = this.next;
      if (previous !== null) {
        previous.next = next;
      }
      if (next !== null) {
        next.previous = previous;
      }
      this.previous = null;
      this.next = null;
    }
  }
}
