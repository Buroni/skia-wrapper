import type { CanvasNode, CanvasNodePathData } from "../CanvasNode";
import type { EntityStyle } from "../EntityStyle";
import type { LabelOptions } from "../LabelOptions";

export type NodeContext = {
    createNode: (pathData: CanvasNodePathData, options: { nodeStyle?: EntityStyle, labelOptions?: LabelOptions }) => CanvasNode;
};