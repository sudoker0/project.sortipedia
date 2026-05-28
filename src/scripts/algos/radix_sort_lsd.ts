import { Action, SortingAlgorithm } from "./base.js";

export class RadixSortLSD extends SortingAlgorithm {
    constructor(data: number[]) {
        super(data);
    }

    private *countSort(exp: number): Generator<Action, void, undefined> {
        let output = new Array(this.size);
        let count = new Array(10).fill(0, 0);

        for (let i = 0; i < this.size; i++) {
            const read = this.readFrom(i);
            yield read.action;
            const digit = Math.floor(read.data / exp) % 10;
            count[digit]++;
        }

        for (let i = 1; i < 10; i++) {
            count[i] += count[i - 1];
        }

        for (let i = this.size - 1; i >= 0; i--) {
            const read = this.readFrom(i);
            yield read.action;
            const digit = Math.floor(read.data / exp) % 10;
            output[count[digit] - 1] = read.data;
            count[digit]--;
        }

        for (let i = 0; i < this.size; i++) {
            const write = this.writeTo(output[i], i);
            yield write.action;
        }
    }

    *sort(): Generator<Action, void, undefined> {
        const maxNum = this.data.reduce((a, b) => Math.max(a, b));
        for (let exp = 1; Math.floor(maxNum / exp) > 0; exp *= 10) {
            yield* this.countSort(exp);
            console.log(this.data);
        }
    }
}
