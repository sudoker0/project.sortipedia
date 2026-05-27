import { Action, SortingAlgorithm } from "./base.js";

export class GnomeSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    *sort(): Generator<Action, void, undefined> {
        let pos = 1;
        while (pos < this.size) {
            const comp = this.compare(pos, Math.max(pos - 1, 0));
            yield comp.action;
            if (pos == 0 || comp.data >= 0) {
                pos++;
            } else {
                const swap = this.swap(pos, pos - 1);
                yield swap.action;
                pos--;
            }
        }
    }
}
