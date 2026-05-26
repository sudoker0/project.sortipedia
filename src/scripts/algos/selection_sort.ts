import { Action, SortingAlgorithm } from "./base.js";

export class SelectionSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    *sort(): Generator<Action, void, undefined> {
        for (let i = 0; i <= this.size - 1; i++) {
            let selected = i;
            for (let j = i; j < this.size; j++) {
                const comp_out = this.compare(selected, j);
                yield comp_out.action;

                if (comp_out.data <= 0) continue;
                selected = j;
            }
            const swap_out = this.swap(i, selected);
            yield swap_out.action;
        }
    }
}
