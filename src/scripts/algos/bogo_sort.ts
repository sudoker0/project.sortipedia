import { Action, SortingAlgorithm } from "./base.js";

export class BogoSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    *sort(): Generator<Action, void, undefined> {
        while (!this.isSorted()) {
            for (let i = this.size - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                yield this.swap(i, j).action;
            }
        }
    }

    private isSorted(): boolean {
        for (let i = 0; i < this.size - 1; i++) {
            if (this.data[i] > this.data[i + 1]) return false;
        }
        return true;
    }
}
