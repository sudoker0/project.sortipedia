import { Action, SortingAlgorithm } from "./base.js";

export class MergeSort extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    private *merge(
        left: number,
        middle: number,
        right: number,
    ): Generator<Action, void, undefined> {
        let i = 0,
            j = 0,
            k = 0;
        let n1 = middle - left + 1;
        let n2 = right - middle;

        let leftData: number[] = [],
            rightData: number[] = [];
        for (i = 0; i < n1; i++) {
            const readLeft = this.readFrom(left + i);
            leftData.push(readLeft.data);
            yield readLeft.action;
        }
        for (j = 0; j < n2; j++) {
            const readRight = this.readFrom(middle + 1 + j);
            rightData.push(readRight.data);
            yield readRight.action;
        }

        i = 0;
        j = 0;
        k = left;
        while (i < n1 && j < n2) {
            if (leftData[i] <= rightData[j]) {
                yield this.writeTo(leftData[i], k).action;
                i++;
            } else {
                yield this.writeTo(rightData[j], k).action;
                j++;
            }
            k++;
        }

        while (i < n1) {
            yield this.writeTo(leftData[i], k).action;
            i++;
            k++;
        }

        while (j < n2) {
            yield this.writeTo(rightData[j], k).action;
            j++;
            k++;
        }
    }

    private *mergeSort(
        l: number,
        r: number,
    ): Generator<Action, void, undefined> {
        if (l < r) {
            const mid = Math.floor(l + (r - l) / 2);
            yield* this.mergeSort(l, mid);
            yield* this.mergeSort(mid + 1, r);
            yield* this.merge(l, mid, r);
        }
    }

    *sort(): Generator<Action, void, undefined> {
        yield* this.mergeSort(0, this.size - 1);
    }
}
