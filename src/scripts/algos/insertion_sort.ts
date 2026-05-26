import { Action, SortingAlgorithm } from "./base.js";

export class InsertionSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    *sort(): Generator<Action, void, undefined> {
        for (let i = 1; i < this.size; i++) {
            let j = i;
            while (j > 0) {
                const compareResult = this.compare(j - 1, j);
                yield compareResult.action;

                if (compareResult.data <= 0) break;

                const result = this.swap(j - 1, j);
                yield result.action;
                j--;
            }
        }
    }
}
