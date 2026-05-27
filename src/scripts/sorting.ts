import { InsertionSort } from "./algos/insertion_sort.js";
import { Action, SortingAlgorithm } from "./algos/base.js";
import { BubbleSort } from "./algos/bubble_sort.js";
import { SelectionSort } from "./algos/selection_sort.js";
import { MergeSort } from "./algos/merge_sort.js";
import { QuickSort } from "./algos/quicksort.js";
import { BogoSort } from "./algos/bogo_sort.js";
import { HeapSort } from "./algos/heap_sort.js";
import { validateAndReturn } from "./ui.js";
import { MiracleSort } from "./algos/miracle_sort.js";
import { Introsort } from "./algos/introsort.js";
import { GnomeSort } from "./algos/gnome_sort.js";

export const config = {
    delay: 0,
    num_elements: 0,
    padding: 8,
};

export let sorter: SortingAlgorithm | undefined = undefined;
export let curArray: number[] = [];
export let startTimestamp: DOMHighResTimeStamp | undefined = undefined;
export let globalAnimationFrame: number = 0;

export function createShuffledList(n: number): number[] {
    const arr = Array.from({ length: n }, (_, i) => i + 1);

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

export function updateAlgorithm(algorithmValue: string) {
    switch (algorithmValue) {
        case "bubble_sort":
            sorter = new BubbleSort(curArray);
            break;
        case "selection_sort":
            sorter = new SelectionSort(curArray);
            break;
        case "insertion_sort":
            sorter = new InsertionSort(curArray);
            break;
        case "gnome_sort":
            sorter = new GnomeSort(curArray);
            break;
        case "merge_sort":
            sorter = new MergeSort(curArray);
            break;
        case "quick_sort":
            sorter = new QuickSort(curArray);
            break;
        case "intro_sort":
            sorter = new Introsort(curArray);
            break;
        case "heap_sort":
            sorter = new HeapSort(curArray);
            break;
        case "bogo_sort":
            sorter = new BogoSort(curArray);
            break;
        case "miracle_sort":
            sorter = new MiracleSort(curArray);
            break;
        default:
            break;
    }
}

export function changeNumElements(
    numElementElm: HTMLInputElement,
    fallback: number,
) {
    config.num_elements = validateAndReturn(numElementElm, fallback);
}

export function changeDelay(
    sortingDelayElm: HTMLInputElement,
    fallback: number,
) {
    config.delay = validateAndReturn(sortingDelayElm, fallback);
}

export function setSorter(newSorter: SortingAlgorithm | undefined) {
    sorter = newSorter;
}

export function setCurArray(newArray: number[]) {
    curArray = newArray;
}

export function setStartTimestamp(timestamp: DOMHighResTimeStamp | undefined) {
    startTimestamp = timestamp;
}

export function setGlobalAnimationFrame(frameId: number) {
    globalAnimationFrame = frameId;
}
