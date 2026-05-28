import {
    playBtn,
    pauseBtn,
    stepBtn,
    resetBtn,
    algorithmSelect,
    numElementElm,
    sortingDelayElm,
    initializeControlButtons,
    initializeControllerBoxes,
    writeStatsToScreen,
    writeInfoToScreen,
    clearStats,
    updateDescription,
    state,
    doneBtn,
} from "./ui.js";
import { drawBlocks, initializeCanvasResize } from "./renderer.js";
import * as sorting from "./sorting.js";

initializeControlButtons();
initializeControllerBoxes();
initializeCanvasResize();

numElementElm.addEventListener("change", () => {
    sorting.changeNumElements(numElementElm, sorting.config.num_elements);
    sorting.setCurArray(sorting.curArray);
});

sortingDelayElm.addEventListener("change", () => {
    sorting.changeDelay(sortingDelayElm, sorting.config.delay);
    sorting.setCurArray(sorting.curArray);
});

algorithmSelect.addEventListener("change", () => {
    sorting.updateAlgorithm(algorithmSelect.value);
    updateDescription(algorithmSelect.value);
    writeInfoToScreen();
});

function finish() {
    doneBtn.click();
    drawBlocks(sorting.sorter.data);
}

function reset() {
    cancelAnimationFrame(sorting.globalAnimationFrame);
    sorting.changeNumElements(numElementElm, sorting.config.num_elements);
    sorting.changeDelay(sortingDelayElm, sorting.config.delay);
    sorting.setCurArray(
        sorting.createShuffledList(sorting.config.num_elements),
    );
    sorting.updateAlgorithm(algorithmSelect.value);
    updateDescription(algorithmSelect.value);
    clearStats();
    writeStatsToScreen();
    writeInfoToScreen();
    drawBlocks(sorting.curArray);
}

function runSort(timestamp: DOMHighResTimeStamp | undefined = undefined) {
    if (sorting.startTimestamp == undefined) {
        sorting.setStartTimestamp(timestamp);
    }
    const elapsed = timestamp! - sorting.startTimestamp!;
    if (timestamp == undefined || elapsed >= sorting.config.delay) {
        sorting.setStartTimestamp(timestamp);
        let batchCount = 10;
        if (timestamp == undefined) batchCount = 1;
        const batchAction = sorting.sorter!.nextBatch(batchCount);
        if (batchAction.length == 0) {
            finish();
            return;
        }
        for (const action of batchAction) {
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
        drawBlocks(sorting.sorter!.data, batchAction);
    }
    if (timestamp != undefined) {
        sorting.setGlobalAnimationFrame(requestAnimationFrame(runSort));
    }
}

playBtn.addEventListener("click", () => {
    sorting.setStartTimestamp(undefined);
    sorting.setGlobalAnimationFrame(requestAnimationFrame(runSort));
});

pauseBtn.addEventListener("click", () => {
    cancelAnimationFrame(sorting.globalAnimationFrame);
});

stepBtn.addEventListener("click", () => {
    runSort();
});

resetBtn.addEventListener("click", reset);

reset();
