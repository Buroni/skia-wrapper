import { type Paint } from "canvaskit-wasm";
import { type CanvasNodeFillStyle, type CanvasNodeStrokeStyle } from "../CanvasNodeStyle"

export type NodePaintContext = {
    setStroke: (stroke: CanvasNodeStrokeStyle) => Paint;
    setFill: (fill: CanvasNodeFillStyle) => Paint
};