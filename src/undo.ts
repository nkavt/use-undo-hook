import { forceClone } from "./helper";

class Undo<T = any> {
  undos: T[] = [];
  redos: T[] = [];

  change(val: T) {
    this.redos = [];
    this.undos.push(forceClone(val));
  }

  canUndo(): boolean {
    return this.undos.length > 1;
  }

  canRedo(): boolean {
    return this.redos.length > 0;
  }

  undo(): boolean {
    if (!this.canUndo()) return false;

    this.redos.push(this.undos.pop()!);
    return true;
  }

  redo(): boolean {
    if (!this.canRedo()) return false;

    this.undos.push(this.redos.pop()!);
    return true;
  }

  lastUndo(): T {
    return this.undos[this.undos.length - 1];
  }

  lastRedo(): T {
    return this.redos[this.redos.length - 1];
  }
}

export default Undo;
