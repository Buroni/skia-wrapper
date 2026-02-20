import type { CanvasNode, CanvasNodePathData } from "../CanvasNode";
import type { CanvasNodeStyle } from "../CanvasNodeStyle";

export type NodeContext = {
    addFont: (name: string, url: string) => Promise<void>;
    createNode: (pathData: CanvasNodePathData, nodeStyle: CanvasNodeStyle) => CanvasNode
};