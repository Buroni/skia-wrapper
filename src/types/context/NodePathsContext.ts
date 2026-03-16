import type { CanvasPathData } from "../CanvasPathData";

export type NodePathsContext = {
    circle: (r: number, cx?: number, cy?: number) => CanvasPathData
    rect: (width: number, height: number, x?: number, y?: number) => CanvasPathData;
};