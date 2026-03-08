import type { CanvasNode } from "./CanvasNode";
import type { Point } from "./Point";

export type Port = {
    location: Point;
    owner: CanvasNode;
};