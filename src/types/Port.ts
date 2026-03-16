import type { CanvasPathNode } from "./CanvasNode";
import type { Point } from "./Point";
import type { CanvasPathData } from "./CanvasPathData";

export type NoOwnerPort = {
    location: Point;
    decorator?: CanvasPathData;
}

export type Port = NoOwnerPort & {
    owner: CanvasPathNode;
};