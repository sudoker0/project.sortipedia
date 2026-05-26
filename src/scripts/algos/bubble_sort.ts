import { Action, SortingAlgorithm } from "./base.js";

export class BubbleSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    *sort(): Generator<Action, void, undefined> {
        for (let i = this.size - 1; i >= 0; i--) {
            for (let j = 0; j < i; j++) {
                const comp_out = this.compare(j, j + 1);
                yield comp_out.action;

                if (comp_out.data <= 0) continue;
                const swap_out = this.swap(j, j + 1);
                yield swap_out.action;
            }
        }
    }
}
