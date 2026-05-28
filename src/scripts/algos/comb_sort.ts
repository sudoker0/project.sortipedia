import { Action, SortingAlgorithm } from "./base.js";

export class CombSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    *sort(): Generator<Action, void, undefined> {
        let gap = this.size;
        let shrink = 1.3;
        let sorted = false;

        while (!sorted) {
            gap = Math.floor(gap / shrink);
            if (gap <= 1) {
                gap = 1;
                sorted = true;
            } else if (gap == 9 || gap == 10) {
                gap = 11;
            }

            let i = 0;
            while (i + gap < this.size) {
                const comp = this.compare(i, i + gap);
                yield comp.action;
                if (comp.data > 0) {
                    const swap = this.swap(i, i + gap);
                    yield swap.action;
                    sorted = false;
                }
                i++;
            }
        }
    }
}
