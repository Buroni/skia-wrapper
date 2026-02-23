import { type Paint } from "canvaskit-wasm";
import { type EntityFillStyle, type EntityStrokeStyle } from "../EntityStyle"

export type PaintContext = {
    setStroke: (stroke: EntityStrokeStyle) => Paint;
    setFill: (fill: EntityFillStyle) => Paint
};