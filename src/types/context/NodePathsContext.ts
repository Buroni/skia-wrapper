import type { CanvasNodePathData } from "../CanvasNode";

export type NodePathsContext = {
    circle: (cx: number, cy: number, r: number) => CanvasNodePathData;
    rect: (x: number, y: number, width: number, height: number) => CanvasNodePathData;
};