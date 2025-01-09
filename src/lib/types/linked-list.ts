type Node<T> = DoublyLinkedList.Node<T>;

export class DoublyLinkedList<T> {
  protected _head: Node<T> | null;
  protected _tail: Node<T> | null;

  constructor() {
    this._head = null;
    this._tail = null;
  }

  public push(value: T): Node<T> {
    if (this._head === null) {
      this._head = new DoublyLinkedList.Node(value);
      this._tail = this._head;
      return this._head;
    } else {
      return this.insertAfter(this._tail!, value);
    }
  }

  public remove(node: Node<T>) {
    console.assert(this.hasNode(node), "Node does not exist in this list");

    if (node === this._head) {
      this.popHead();
    } else if (node === this._tail) {
      this.popTail();
    } else {
      node.remove();
    }
  }

  public popHead() {
    if (this._head === null) {
      return;
    }

    const newHead = this._head.next;
    if (newHead === null) {
      this._head = null;
      this._tail = null;
      return;
    }

    newHead.previous = null;
    this._head = newHead;
  }

  public popTail() {
    if (this._tail === null) {
      return;
    }

    const newTail = this._tail.previous;
    if (newTail === null) {
      this._head = null;
      this._tail = null;
      return;
    }

    newTail.next = null;
    this._tail = newTail;
  }

  public insertAfter(node: Node<T>, value: T): Node<T> {
    console.assert(this.hasNode(node), "Node does not exist in this list");

    if (node !== this._tail) {
      return node.insertAfter(value);
    } else {
      const newNode = new DoublyLinkedList.Node(value);
      node.next = newNode;
      newNode.previous = node;
      this._tail = newNode;
      return newNode;
    }
  }

  public removeAfter(node: Node<T>) {
    console.assert(this.hasNode(node), "Node does not exist in this list");

    if (node.next !== null) {
      this.remove(node.next);
      node.next = null;
    }
    this._tail = node;
  }

  /**
   * Gets all values between `from` and `to` (inclusive) iterating towards the end of the list.
   * @param to - inclusive, defaults to the end
   */
  public getNext(from: Node<T>, to?: Node<T>) {
    if (this.tail === null) {
      throw new Error("List is empty");
    }

    console.assert(this.hasNode(from), "Node does not exist in this list");

    return this.getValuesBetween(from, to ?? this.tail, node => node.next);
  }

  /**
   * Gets all values between `from` and `to` (inclusive) iterating towards the start of the list.
   * @param to - inclusive, defaults to the start
   */
  public getPrevious(from: Node<T>, to?: Node<T>) {
    if (this.head === null) {
      throw new Error("List is empty");
    }

    console.assert(this.hasNode(from), "Node does not exist in this list");

    return this.getValuesBetween(from, to ?? this.head, node => node.previous);
  }

  public [Symbol.iterator](): Iterator<T> {
    let current = this._head;
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

  public get head() {
    return this._head;
  }

  public get tail() {
    return this._tail;
  }

  protected getValuesBetween(from: Node<T>, to: Node<T>, getFollowing: (node: Node<T>) => Node<T> | null) {
    if (from === to) {
      return [from.value];
    }

    const values = [];

    let node: Node<T> | null = from;
    do {
      if (node === null) {
        throw new Error(`Node from and to do not form a linked list because they are not connected`);
      }
      values.push(node.value);
      node = getFollowing(node);
    } while (node !== to);
    values.push(to.value);
    return values;
  }

  protected hasNode(node: Node<T>): boolean {
    return this.find(n => n === node) !== null;
  }

  protected find(predicate: (value: Node<T>) => boolean): Node<T> | null {
    for (let current = this._head; current !== null; current = current.next) {
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
      if (this.next === null) {
        throw new Error("Tail must be inserted on the linked list itself!");
      }

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
      if (this.previous === null) {
        throw new Error("Head must be removed on the linked list itself!");
      }
      if (this.next === null) {
        throw new Error("Tail must be removed on the linked list itself!");
      }

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
