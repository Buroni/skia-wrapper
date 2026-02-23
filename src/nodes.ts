import { type LabelOptions } from "./types/LabelOptions";
import { type CanvasNodePathData, type CanvasPathNode } from "./types/CanvasNode";
import { type EntityStyle } from "./types/EntityStyle";
import { type SkiaContext } from "./types/context/SkiaContext";
import { type NodeContext } from "./types/context/NodeContext";
import { usePaint } from "./paint";
import { addDisposable, getDefaultStyle } from "./utils/utils";
import { useNodeLabel } from "./useNodeLabel";
import type { ParagraphStyle } from "canvaskit-wasm";

export function useNodes(skiaContext: SkiaContext): NodeContext {
    const nodePaintContext = usePaint(skiaContext);
    const nodeLabelContext = useNodeLabel(skiaContext);

    const { surface, displayOrderAddons } = skiaContext;

    const canvas = surface.getCanvas();

    function createNode(pathData: CanvasNodePathData, options: { nodeStyle?: EntityStyle, labelOptions?: LabelOptions } = {}): CanvasPathNode {
        const nodeStyle = getDefaultStyle(options.nodeStyle);
        const labelOptions = getDefaultLabelOptions(options.labelOptions);

        const node: CanvasPathNode = {
            type: "node",
            pathData,
            style: nodeStyle,
            labelOptions,
            displayOrder: skiaContext.numberEntities
        };

        let paragraphStyle: ParagraphStyle | undefined;
        if (node.labelOptions) {
            paragraphStyle = nodeLabelContext.getParagraphStyle(node.labelOptions);
        }

        const drawFrame = makeDrawFrame(node, paragraphStyle);

        displayOrderAddons.push({ entity: node, addon: drawFrame });

        skiaContext.nodes.push(node);

        return node;
    }

    function makeDrawFrame(node: CanvasPathNode, paragraphStyle?: ParagraphStyle): () => void {
        return () => {
            const disposables: any[] = [];

            canvas.save();
            canvas.translate(node.pathData.cx, node.pathData.cy);

            const { stroke, fill } = node.style;

            if (!stroke || !fill) {
                throw new Error("Node stroke and fill must be defined");
            }

            const strokePaint = addDisposable(() => nodePaintContext.setStroke(stroke), disposables);
            canvas.drawPath(node.pathData.path, strokePaint);

            const fillPaint = addDisposable(() => nodePaintContext.setFill(fill), disposables);
            canvas.drawPath(node.pathData.path, fillPaint);


            if (paragraphStyle) {
                nodeLabelContext.drawLabel(node, paragraphStyle, disposables);
            }

            canvas.restore();

            disposables.forEach(disposable => disposable.delete());
        }
    }

    function getDefaultLabelOptions(labelOptions: LabelOptions | undefined): LabelOptions | undefined {
        if (!labelOptions) {
            return undefined;
        }

        if (!labelOptions.width) {
            labelOptions.width = "fit";
        }

        if (!labelOptions.fontSize) {
            labelOptions.fontSize = 24;
        }

        return labelOptions;
    }

    return {
        createNode
    };
}