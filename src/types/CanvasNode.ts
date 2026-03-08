import { type Path } from "canvaskit-wasm";
import { type EntityStyle } from "./EntityStyle";
import type { LabelOptions } from "./LabelOptions";
import type { CanvasEntity, Stylable } from "./CanvasEntity";
import type { Port } from "./Port";

export type CanvasNodePathData = {
    path: Path;
    translateX: number;
    translateY: number;
    type: "circle" | "rect" | "custom";
}

export interface CanvasNode extends CanvasEntity {
    type: "node";
    pathData: { translateX: number; translateY: number };
}

export interface CanvasPathNode extends CanvasEntity, Stylable {
    type: "node";
    pathData: CanvasNodePathData;
    style: EntityStyle;
    ports: Port[];
    labelOptions?: LabelOptions;
}

export interface CanvasPlaceholderNode extends CanvasEntity {
    type: "node";
}

export function isCanvasNode(entity: CanvasEntity): entity is CanvasNode {
    return entity.type === "node";
}

export function isCanvasPathNode(entity: CanvasEntity): entity is CanvasPathNode {
    return isCanvasNode(entity) && Boolean((entity as CanvasPathNode).pathData?.path);
}