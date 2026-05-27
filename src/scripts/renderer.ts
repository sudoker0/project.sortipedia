import { Action } from "./algos/base";

export const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
export const ctx = canvas.getContext("2d");

export const color = {
    read: "#ff0000",
    write: "#00ff00",
    swap: "#0000ff",
    compare: "#00ffff",
};

export function clearCanvas() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

export function drawBlocks(data: number[], actions?: Action[]) {
    if (!ctx) return;
    clearCanvas();
    const blockWidth = canvas.width / data.length;
    const maxHeight = data.reduce((accum, cur) => Math.max(accum, cur), 0);
    const processLater = new Set<number>();
    if (actions) {
        for (const action of actions) {
            processLater.add(action.idx);
            processLater.add(action.idx2);
        }
    }
    for (let i = 0; i < data.length; i++) {
        if (processLater.has(i)) continue;
        const normalizedHeight = data[i] / maxHeight;
        const blockHeight = normalizedHeight * canvas.height;
        ctx.fillStyle = "white";
        ctx.fillRect(
            i * blockWidth,
            canvas.height - blockHeight,
            blockWidth,
            blockHeight,
        );
    }
    if (actions) {
        for (const action of actions) {
            switch (action.type) {
                case "compare":
                    ctx.fillStyle = color.compare;
                    break;
                case "swap":
                    ctx.fillStyle = color.swap;
                    break;
                case "write":
                    ctx.fillStyle = color.write;
                    break;
                case "read":
                    ctx.fillStyle = color.read;
                    break;
            }
            const indexes: number[] = [action.idx];
            if (action.idx2) indexes.push(action.idx2);
            for (const i of indexes) {
                const normalizedHeight = data[i] / maxHeight;
                const blockHeight = normalizedHeight * canvas.height;
                ctx.fillRect(
                    i * blockWidth,
                    canvas.height - blockHeight,
                    blockWidth,
                    blockHeight,
                );
            }
        }
    }
}

export function resizeCanvas() {
    const canvasContainerSize = canvas.parentElement!.getBoundingClientRect();
    canvas.width = canvasContainerSize.width - 8;
    canvas.height = canvasContainerSize.height;
    drawBlocks([]);
}

export function initializeCanvasResize() {
    window.addEventListener("resize", resizeCanvas, false);
    resizeCanvas();
}
