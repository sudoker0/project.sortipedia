import { InsertionSort } from "./algos/insertion_sort.js";
import { Action, SortingAlgorithm } from "./algos/base.js";
import { BubbleSort } from "./algos/bubble_sort.js";
import { SelectionSort } from "./algos/selection_sort.js";
import { MergeSort } from "./algos/merge_sort.js";
import { QuickSort } from "./algos/quicksort.js";
import { BogoSort } from "./algos/bogo_sort.js";

import { data as Description } from "../data/description.js";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const playBtn = document.querySelector("#play") as HTMLButtonElement;
const pauseBtn = document.querySelector("#pause") as HTMLButtonElement;
const stopBtn = document.querySelector("#stop") as HTMLButtonElement;
const stepBtn = document.querySelector("#step") as HTMLButtonElement;
const resetBtn = document.querySelector("#reset") as HTMLButtonElement;

document.querySelectorAll(".control").forEach((elm: HTMLButtonElement) => {
    elm.addEventListener("click", () => {
        document
            .querySelectorAll(".control")
            .forEach((elm2: HTMLButtonElement) => {
                elm2.disabled = elm2
                    .getAttribute("data-disabledBy")
                    .split(",")
                    .includes(elm.id);
            });
    });
});
let sorter: SortingAlgorithm | undefined = undefined;

const config = {
    delay: 0,
    num_elements: 0,
    padding: 8,
};

const color = {
    read: "#ff0000",
    write: "#00ff00",
    swap: "#0000ff",
    compare: "#00ffff",
};

const state = {
    arrayRead: 0,
    arrayWrite: 0,
    arrayComparison: 0,
};
const info = {
    description: "",
    timeComplexity_best: "",
    timeComplexity_worst: "",
    timeComplexity_average: "",
    spaceComplexity: "",
    stable: "",
    inPlace: "",
    readMore: {},
};

let curArray = [];
let startTimestamp: DOMHighResTimeStamp | undefined;
let globalAnimationFrame: number = 0;

const algorithmSelect = document.querySelector(
    "#algorithm",
) as HTMLSelectElement;

const numElementElm = document.querySelector(
    "#num-elements",
) as HTMLInputElement;

const sortingDelayElm = document.querySelector(
    "#sorting-delay",
) as HTMLInputElement;

const resizeCanvas = () => {
    const canvasContainerSize = canvas.parentElement.getBoundingClientRect();
    canvas.width = canvasContainerSize.width - config.padding;
    canvas.height = canvasContainerSize.height;
    drawBlocks(curArray);
};
window.addEventListener("resize", resizeCanvas, false);
resizeCanvas();

document.querySelectorAll(".controller").forEach((elm) => {
    elm.addEventListener("click", () => {
        const controlBox = document.querySelector(
            `[data-controlled=${elm.getAttribute("data-control")}]`,
        ) as HTMLElement;
        controlBox.classList.toggle("hide");
    });
});

function validateAndReturn(elm: HTMLInputElement, fallback: number) {
    const value = parseInt(elm.value, 10);
    if (
        isNaN(value) ||
        (elm.min != "" && value < parseInt(elm.min)) ||
        (elm.max != "" && value > parseInt(elm.max))
    ) {
        elm.value = fallback.toString();
    } else {
        return value;
    }
}

function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBlocks(data: number[], action: Action | void) {
    if (!ctx) return;
    clearCanvas();
    const blockWidth = canvas.width / data.length;
    const maxHeight = data.reduce((accum, cur) => Math.max(accum, cur), 0);
    for (let i = 0; i < data.length; i++) {
        const normalizedHeight = data[i] / maxHeight;
        const blockHeight = normalizedHeight * canvas.height;
        ctx.fillStyle = "white";
        if (action) {
            switch (action.type) {
                case "compare":
                    if (action.idx == i || action.idx2 == i)
                        ctx.fillStyle = color.compare;
                    break;
                case "swap":
                    if (action.idx == i || action.idx2 == i)
                        ctx.fillStyle = color.swap;
                    break;
                case "write":
                    if (action.idx == i) ctx.fillStyle = color.write;
                    break;
                case "read":
                    if (action.idx == i) ctx.fillStyle = color.read;
                    break;
            }
        }
        ctx.fillRect(
            i * blockWidth,
            canvas.height - blockHeight,
            blockWidth,
            blockHeight,
        );
    }
}

function createShuffledList(n: number): number[] {
    const arr = Array.from({ length: n + 1 }, (_, i) => i + 1);

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

function updateDescription() {
    let key: keyof typeof Description;
    switch (algorithmSelect.value) {
        case "bubble":
            key = "bubble_sort";
            break;
        case "selection":
            key = "selection_sort";
            break;
        case "insertion":
            key = "insertion_sort";
            break;
        case "merge":
            key = "merge_sort";
            break;
        case "quick":
            key = "quick_sort";
            break;
        case "bogo":
            key = "bogo_sort";
            break;
        default:
            break;
    }
    info.timeComplexity_worst = Description[key].time_complexity.worst;
    info.timeComplexity_best = Description[key].time_complexity.best;
    info.timeComplexity_average = Description[key].time_complexity.average;
    info.spaceComplexity = Description[key].space_complexity;
    info.stable = Description[key].stable ? "Yes" : "No";
    info.inPlace = Description[key].in_place ? "Yes" : "No";
    info.description = Description[key].description;
    info.readMore = Description[key].read_more;
}

function updateAlgorithm() {
    switch (algorithmSelect.value) {
        case "bubble":
            sorter = new BubbleSort(curArray);
            break;
        case "selection":
            sorter = new SelectionSort(curArray);
            break;
        case "insertion":
            sorter = new InsertionSort(curArray);
            break;
        case "merge":
            sorter = new MergeSort(curArray);
            break;
        case "quick":
            sorter = new QuickSort(curArray);
            break;
        case "bogo":
            sorter = new BogoSort(curArray);
            break;
        default:
            break;
    }
}

function changeNumElements() {
    config.num_elements = validateAndReturn(numElementElm, config.num_elements);
}

function changeDelay() {
    config.delay = validateAndReturn(sortingDelayElm, config.delay);
}

function finish() {
    pauseBtn.click();
}

function writeStatsToScreen() {
    for (const [key, value] of Object.entries(state)) {
        const statElm = document.querySelector(
            `span.stats[data-stat="${key}"]`,
        ) as HTMLSpanElement;
        statElm.textContent = value.toString();
    }
}

function writeInfoToScreen() {
    for (const [key, value] of Object.entries(info)) {
        const infoElm = document.querySelector(
            `span.stats[data-info="${key}"]`,
        ) as HTMLSpanElement;
        if (!infoElm) continue;
        infoElm.textContent = value.toString();
    }
    const readMoreUl = document.querySelector(
        `ul#readMore`,
    ) as HTMLUListElement;
    while (readMoreUl.firstChild) {
        readMoreUl.removeChild(readMoreUl.firstChild);
    }
    for (const [k, v] of Object.entries(info.readMore)) {
        const elm = document.createElement("li");
        const aTag = document.createElement("a");
        aTag.textContent = k;
        aTag.href = v.toString();
        elm.appendChild(aTag);
        readMoreUl.appendChild(elm);
    }
}

function clearStats() {
    for (const key of Object.keys(state)) {
        if (typeof state[key] === "number") {
            state[key] = 0;
        } else if (typeof state[key] === "string") {
            state[key] = "";
        }
    }
}

function reset() {
    cancelAnimationFrame(globalAnimationFrame);
    changeNumElements();
    changeDelay();
    curArray = createShuffledList(config.num_elements);
    updateAlgorithm();
    updateDescription();
    clearStats();
    writeStatsToScreen();
    writeInfoToScreen();
    drawBlocks(curArray);
}

algorithmSelect.addEventListener("change", () => {
    updateAlgorithm();
    updateDescription();
    writeInfoToScreen();
});
numElementElm.addEventListener("change", changeNumElements);
sortingDelayElm.addEventListener("change", changeDelay);

function runSort(timestamp: DOMHighResTimeStamp | undefined = undefined) {
    if (startTimestamp == undefined) {
        startTimestamp = timestamp;
    }
    const elapsed = timestamp - startTimestamp;
    if (elapsed >= config.delay || timestamp == undefined) {
        startTimestamp = timestamp;
        const { value: action, done } = sorter.next();
        if (done) {
            finish();
            return;
        }
        if (action) {
            switch (action.type) {
                case "swap":
                    state.arrayRead += 2;
                    state.arrayWrite += 2;
                    break;
                case "write":
                    state.arrayWrite++;
                    break;
                case "read":
                    state.arrayRead++;
                    break;
                case "compare":
                    state.arrayComparison++;
                    break;
            }
        }
        writeStatsToScreen();
        drawBlocks(sorter.readData, action);
    }
    if (timestamp != undefined) {
        globalAnimationFrame = requestAnimationFrame(runSort);
    }
}

playBtn.addEventListener("click", () => {
    globalAnimationFrame = requestAnimationFrame(runSort);
});
pauseBtn.addEventListener("click", () => {
    cancelAnimationFrame(globalAnimationFrame);
});
stepBtn.addEventListener("click", () => {
    runSort();
});
resetBtn.addEventListener("click", reset);

(() => {
    reset();
})();
