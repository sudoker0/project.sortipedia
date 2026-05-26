import { Action, SortingAlgorithm } from "./base.js";

export class QuickSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    private *partition(
        low: number,
        high: number,
    ): Generator<Action, number, undefined> {
        const p = this.readFrom(high);
        yield p.action;
        let i = low - 1;
        for (let j = low; j <= high - 1; j++) {
            const c = this.compare(j, high);
            yield c.action;
            if (c.data <= 0) {
                i++;
                yield this.swap(i, j).action;
            }
        }
        yield this.swap(i + 1, high).action;
        return i + 1;
    }

    private *quickSort(
        low: number,
        high: number,
    ): Generator<Action, void, undefined> {
        if (low < high) {
            const pivot = yield* this.partition(low, high);
            yield* this.quickSort(low, pivot - 1);
            yield* this.quickSort(pivot + 1, high);
        }
    }

    *sort(): Generator<Action, void, undefined> {
        yield* this.quickSort(0, this.size - 1);
    }
}
