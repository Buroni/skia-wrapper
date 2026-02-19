import { RequiredCanvasNodeStyle } from "./CanvasNodeStyle";

export type CanvasNodePathData = {
    path: any;
    cx: number;
    cy: number;
    r: number;
}

export type CanvasNode = {
    pathData: CanvasNodePathData;
    style: RequiredCanvasNodeStyle;
    transform?: any;
}