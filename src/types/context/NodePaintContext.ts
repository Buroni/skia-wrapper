import { type Paint } from "canvaskit-wasm";
import { type EntityFillStyle, type EntityStrokeStyle } from "../EntityStyle"

export type NodePaintContext = {
    setStroke: (stroke: EntityStrokeStyle) => Paint;
    setFill: (fill: EntityFillStyle) => Paint
};