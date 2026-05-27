import { Action, SortingAlgorithm } from "./base.js";

export class MiracleSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    private isSorted(): boolean {
        for (let i = 0; i < this.size - 1; i++) {
            if (this.data[i] > this.data[i + 1]) return false;
        }
        return true;
    }

    *sort(): Generator<Action, void, undefined> {
        while (!this.isSorted()) {
            yield {
                type: "nothing",
                idx: 0,
                idx2: null,
                data: null,
            };
            // wait for a miracle :3
        }
    }
}
