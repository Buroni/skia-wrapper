import { type Path } from "canvaskit-wasm";
import { type EntityStyle } from "./EntityStyle";
import type { LabelOptions } from "./LabelOptions";

export type CanvasNodePathData = {
    path: Path;
    cx: number;
    cy: number;
    r: number;
}

export type CanvasNode = {
    pathData: CanvasNodePathData;
    style: EntityStyle;
    labelOptions?: LabelOptions;
}