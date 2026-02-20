import type { CanvasNode, CanvasNodePathData } from "../CanvasNode";
import type { CanvasNodeStyle } from "../CanvasNodeStyle";
import type { LabelOptions } from "../LabelOptions";

export type NodeContext = {
    addFont: (name: string, url: string) => Promise<void>;
    createNode: (pathData: CanvasNodePathData, options: { nodeStyle?: CanvasNodeStyle, labelOptions?: LabelOptions }) => CanvasNode
};