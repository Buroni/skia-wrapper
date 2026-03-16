import type { CanvasPathNode } from "../CanvasNode";
import type { CanvasPathData } from "../CanvasPathData";
import type { EntityStyle } from "../EntityStyle";
import type { LabelOptions } from "../LabelOptions";
import type { NoOwnerPort } from "../Port";

export type NodeContext = {
    createNode: (pathData: CanvasPathData, ports: NoOwnerPort[] | NoOwnerPort, options: { nodeStyle?: EntityStyle, labelOptions?: LabelOptions }) => CanvasPathNode;
};