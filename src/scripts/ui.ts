import { Data, data as Description } from "../data/description.js";

export const info = {
    description: "",
    timeComplexity_best: "",
    timeComplexity_worst: "",
    timeComplexity_average: "",
    spaceComplexity: "",
    stable: "",
    inPlace: "",
    readMore: {},
};

export const state = {
    arrayRead: 0,
    arrayWrite: 0,
    arrayComparison: 0,
};

export const playBtn = document.querySelector("#play") as HTMLButtonElement;
export const pauseBtn = document.querySelector("#pause") as HTMLButtonElement;
export const stopBtn = document.querySelector("#stop") as HTMLButtonElement;
export const stepBtn = document.querySelector("#step") as HTMLButtonElement;
export const resetBtn = document.querySelector("#reset") as HTMLButtonElement;
export const algorithmSelect = document.querySelector(
    "#algorithm",
) as HTMLSelectElement;
export const numElementElm = document.querySelector(
    "#num-elements",
) as HTMLInputElement;
export const sortingDelayElm = document.querySelector(
    "#sorting-delay",
) as HTMLInputElement;

export function initializeControlButtons() {
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
}

export function initializeControllerBoxes() {
    document.querySelectorAll(".controller").forEach((elm) => {
        elm.addEventListener("click", () => {
            const controlBox = document.querySelector(
                `[data-controlled=${elm.getAttribute("data-control")}]`,
            ) as HTMLElement;
            controlBox.classList.toggle("hide");
        });
    });
}

export function validateAndReturn(elm: HTMLInputElement, fallback: number) {
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

export function writeStatsToScreen() {
    for (const [key, value] of Object.entries(state)) {
        const statElm = document.querySelector(
            `span.stats[data-stat="${key}"]`,
        ) as HTMLSpanElement;
        statElm.textContent = value.toString();
    }
}

export function writeInfoToScreen() {
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

export function clearStats() {
    for (const key of Object.keys(state)) {
        if (typeof state[key] === "number") {
            state[key] = 0;
        } else if (typeof state[key] === "string") {
            state[key] = "";
        }
    }
}

export function updateDescription(algorithmValue: string) {
    let key: keyof Data;
    if (algorithmValue in Description) {
        key = algorithmValue as keyof Data;
    } else {
        return;
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
