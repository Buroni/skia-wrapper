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