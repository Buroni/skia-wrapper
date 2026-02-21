import { type Path } from "canvaskit-wasm";
import { type EntityStyle } from "./EntityStyle";
import type { LabelOptions } from "./LabelOptions";
import type { CanvasEntity } from "./CanvasEntity";

export type CanvasNodePathData = {
    path: Path;
    cx: number;
    cy: number;
    r: number;
}

export interface CanvasNode extends CanvasEntity {
    type: "node";
    pathData: CanvasNodePathData;
    style: EntityStyle;
    labelOptions?: LabelOptions;
}

export function isCanvasNode(entity: CanvasEntity): entity is CanvasNode {
    return entity.type === "node";
}