import type { CanvasNodePathData, CanvasPathNode } from "../CanvasNode";
import type { EntityStyle } from "../EntityStyle";
import type { LabelOptions } from "../LabelOptions";
import type { Point } from "../Point";

export type NodeContext = {
    createNode: (pathData: CanvasNodePathData, portLocations: Point[] | Point, options: { nodeStyle?: EntityStyle, labelOptions?: LabelOptions }) => CanvasPathNode;
};