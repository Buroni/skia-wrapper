import type { Path } from "canvaskit-wasm";
import type { CanvasEntity, Stylable } from "./CanvasEntity";
import type { EntityStyle } from "./EntityStyle";
import type { Port } from "./Port";

export interface CanvasEdge extends CanvasEntity, Stylable {
    type: "edge";
    sourcePort: Port;
    targetPort: Port;
    style: EntityStyle;
    path: Path;
};

export function isCanvasEdge(entity: CanvasEntity): entity is CanvasEdge {
    return entity.type === "edge";
}