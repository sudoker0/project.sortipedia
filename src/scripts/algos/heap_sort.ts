import { Action, SortingAlgorithm } from "./base.js";

export class HeapSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    private *heapify(
        size: number,
        i: number,
    ): Generator<Action, void, undefined> {
        let largest = i,
            left = 2 * i + 1,
            right = 2 * i + 2;

        if (left < size) {
            let comp = this.compare(left, largest);
            if (comp.data > 0) {
                largest = left;
            }
            yield comp.action;
        }

        if (right < size) {
            let comp = this.compare(right, largest);
            if (comp.data > 0) {
                largest = right;
            }
            yield comp.action;
        }

        if (largest != i) {
            let swap = this.swap(largest, i);
            yield swap.action;
            yield* this.heapify(size, largest);
        }
    }

    *sort(): Generator<Action, void, undefined> {
        for (let i = Math.floor(this.size / 2) - 1; i >= 0; i--) {
            yield* this.heapify(this.size, i);
        }

        for (let i = this.size - 1; i >= 0; i--) {
            let swap = this.swap(0, i);
            yield swap.action;

            yield* this.heapify(i, 0);
        }
    }
}
