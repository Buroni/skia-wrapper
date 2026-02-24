import type { CanvasEdge } from "./CanvasEdge";
import type { CanvasPathNode } from "./CanvasNode";
import type { EntityStyle } from "./EntityStyle";

export type CanvasEntity = {
    type: "node" | "edge";
    displayOrder: number;
}

export type Stylable = {
    style: EntityStyle;
}

export function isStylable(entity: any): entity is Stylable {
    return Boolean((entity as Stylable).style);
}

export function entityIsNode(entity: any): entity is CanvasPathNode {
    return entity.type === "node";
}

export function entityIsEdge(entity: any): entity is CanvasEdge {
    return entity.type === "edge";
}