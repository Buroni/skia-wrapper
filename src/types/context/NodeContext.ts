import type { CanvasNodePathData, CanvasPathNode } from "../CanvasNode";
import type { EntityStyle } from "../EntityStyle";
import type { LabelOptions } from "../LabelOptions";

export type NodeContext = {
    createNode: (pathData: CanvasNodePathData, options: { nodeStyle?: EntityStyle, labelOptions?: LabelOptions }) => CanvasPathNode;
};