import { type Path } from "canvaskit-wasm";
import { type RequiredCanvasNodeStyle } from "./CanvasNodeStyle";

export type CanvasNodePathData = {
    path: Path;
    cx: number;
    cy: number;
    r: number;
}

export type CanvasNode = {
    pathData: CanvasNodePathData;
    style: RequiredCanvasNodeStyle;
}