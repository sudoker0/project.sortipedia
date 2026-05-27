import { Action, SortingAlgorithm } from "./base.js";

export class Introsort extends SortingAlgorithm {
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

    private *heapSort(
        l: number,
        r: number,
    ): Generator<Action, void, undefined> {
        let length = r - l + 1;
        for (let i = l + Math.floor(length / 2) - 1; i >= l; i--) {
            yield* this.heapify(length, i);
        }

        for (let i = this.size - 1; i >= 0; i--) {
            let swap = this.swap(l, i + l);
            yield swap.action;

            yield* this.heapify(i, l);
        }
    }

    private *insertionSort(l: number, r: number) {
        for (let i = l + 1; i <= r; i++) {
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

    private *introSort(
        l: number,
        r: number,
        depth: number,
    ): Generator<Action, void, undefined> {
        const n = r - l + 1;
        if (n < 16) {
            yield* this.insertionSort(l, r);
            return;
        }
        if (depth === 0) {
            yield* this.heapSort(l, r);
            return;
        }
        const p = yield* this.partition(l, r);
        yield* this.introSort(l, p - 1, depth - 1);
        yield* this.introSort(p + 1, r, depth - 1);
    }

    *sort(): Generator<Action, void, undefined> {
        yield* this.introSort(
            0,
            this.size - 1,
            2 * Math.floor(Math.log2(this.size)),
        );
    }
}
