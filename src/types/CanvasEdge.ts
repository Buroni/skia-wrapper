import type { Path } from "canvaskit-wasm";
import type { CanvasEntity } from "./CanvasEntity";
import type { CanvasNode, CanvasPathNode } from "./CanvasNode";
import type { EntityStyle } from "./EntityStyle";

export interface CanvasEdge extends CanvasEntity {
    type: "edge";
    sourceNode: CanvasPathNode;
    targetNode: CanvasNode;
    style: EntityStyle;
    path: Path;
};

export function isCanvasEdge(entity: CanvasEntity): entity is CanvasEdge {
    return entity.type === "edge";
}