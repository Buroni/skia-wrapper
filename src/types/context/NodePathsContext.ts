import type { CanvasNodePathData } from "../CanvasNode";

export type NodePathsContext = {
    circle: (cx: number, cy: number, r: number) => CanvasNodePathData
};