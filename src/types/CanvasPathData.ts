import type { Path } from "canvaskit-wasm";

export type CanvasPathData = {
    path: Path;
    translateX: number;
    translateY: number;
    type: "circle" | "rect" | "custom";
}