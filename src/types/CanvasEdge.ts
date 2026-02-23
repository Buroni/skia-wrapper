import type { CanvasEntity } from "./CanvasEntity";
import type { CanvasNode, CanvasPathNode } from "./CanvasNode";

export interface CanvasEdge extends CanvasEntity {
    type: "edge";
    sourceNode: CanvasPathNode;
    targetNode: CanvasNode;
};

export function isCanvasEdge(entity: CanvasEntity): entity is CanvasEdge {
    return entity.type === "edge";
}