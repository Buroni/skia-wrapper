import type { CanvasNode, CanvasNodePathData } from "../CanvasNode";
import type { CanvasNodeStyle } from "../CanvasNodeStyle";
import type { LabelOptions } from "../LabelOptions";

export type NodeContext = {
    createNode: (pathData: CanvasNodePathData, options: { nodeStyle?: CanvasNodeStyle, labelOptions?: LabelOptions }) => CanvasNode;
    toBack: (node: CanvasNode) => void;
    toFront: (node: CanvasNode) => void;
};