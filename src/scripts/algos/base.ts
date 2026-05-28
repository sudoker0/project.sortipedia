export type Action = {
    type: "swap" | "write" | "read" | "compare" | "nothing";
    data: number | null;
    idx: number;
    idx2: number | null;
};

export type ActionResult<T> = {
    action: Action;
    data: T;
};

export abstract class SortingAlgorithm {
    // notice: all operations on data must be done through the protected methods below
    private _data: number[];
    private finished = false;
    private activeGenerator: Generator<Action, void, undefined> | null = null;

    constructor(data: readonly number[]) {
        this._data = [...data];
    }

    get data(): readonly number[] {
        return [...this._data];
    }

    get size(): number {
        return this._data.length;
    }

    protected swap(i: number, j: number): ActionResult<void> {
        const temp = this._data[i];
        this._data[i] = this._data[j];
        this._data[j] = temp;
        return {
            action: { type: "swap", data: null, idx: i, idx2: j },
            data: null,
        };
    }

    protected writeTo(number: number, idx: number): ActionResult<void> {
        this._data[idx] = number;
        return {
            action: { type: "write", data: number, idx: idx, idx2: null },
            data: null,
        };
    }

    protected readFrom(idx: number): ActionResult<number> {
        const value = this._data[idx];
        return {
            action: { type: "read", data: value, idx: idx, idx2: null },
            data: value,
        };
    }

    protected compare(i: number, j: number): ActionResult<number> {
        const value = this._data[i] - this._data[j];
        return {
            action: { type: "compare", data: value, idx: i, idx2: j },
            data: value,
        };
    }

    isFinished() {
        return this.finished;
    }

    next(): IteratorResult<Action, void> {
        if (this.finished) {
            return { value: undefined, done: true };
        }
        if (!this.activeGenerator) {
            this.activeGenerator = this.sort();
        }
        const result = this.activeGenerator.next();
        if (result.done) {
            this.finished = true;
            this.activeGenerator = null;
        }
        return result;
    }

    nextBatch(n: number): Action[] {
        const actions: Action[] = [];
        for (let i = 0; i < n; i++) {
            if (this.finished) break;
            const { value, done } = this.next();
            if (done || !value) break;
            actions.push(value);
        }
        return actions;
    }
    protected abstract sort(): Generator<Action, void, undefined>;
}
