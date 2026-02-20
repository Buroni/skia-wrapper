import { type LabelOptions } from "./types/LabelOptions";
import { type CanvasNode, type CanvasNodePathData } from "./types/CanvasNode";
import { type CanvasNodeStyle } from "./types/CanvasNodeStyle";
import { type SkiaContext } from "./types/context/SkiaContext";
import { type NodeContext } from "./types/context/NodeContext";
import { useNodePaint } from "./nodePaint";
import { addDisposable } from "./utils";
import { useNodeLabel } from "./useNodeLabel";

export function useNodes(skiaContext: SkiaContext): NodeContext {
    const nodePaintContext = useNodePaint(skiaContext);
    const nodeLabelContext = useNodeLabel(skiaContext);

    const { surface, addons } = skiaContext;

    const canvas = surface.getCanvas();

    function createNode(pathData: CanvasNodePathData, options: { nodeStyle?: CanvasNodeStyle, labelOptions?: LabelOptions } = {}): CanvasNode {
        const nodeStyle = getDefaultNodeStyle(options.nodeStyle);
        const labelOptions = getDefaultLabelOptions(options.labelOptions);

        const node: CanvasNode = {
            pathData,
            style: nodeStyle,
            labelOptions
        };

        let paragraphStyle: ParagraphStyle | undefined;
        if (node.labelOptions) {
            paragraphStyle = nodeLabelContext.getParagraphStyle(node.labelOptions);
        }

        const drawFrame = makeDrawFrame(node, paragraphStyle);

        addons.push(drawFrame);

        skiaContext.nodes.push(node);

        return node;
    }

    function makeDrawFrame(node: CanvasNode, paragraphStyle?: ParagraphStyle): () => void {
        return () => {
            const disposables: any[] = [];

            canvas.save();
            canvas.translate(node.pathData.cx, node.pathData.cy);

            if (node.style.strokeStyle) {
                const { strokeStyle } = node.style;
                const strokePaint = addDisposable(() => nodePaintContext.setStroke(strokeStyle), disposables);
                canvas.drawPath(node.pathData.path, strokePaint);
            }

            if (node.style.fillStyle) {
                const { fillStyle } = node.style;
                const fillPaint = addDisposable(() => nodePaintContext.setFill(fillStyle), disposables);
                canvas.drawPath(node.pathData.path, fillPaint);
            }

            if (paragraphStyle) {
                nodeLabelContext.drawLabel(node, paragraphStyle, disposables);
            }

            canvas.restore();

            disposables.forEach(disposable => disposable.delete());
        }
    }

    function getDefaultNodeStyle(nodeStyle: CanvasNodeStyle | undefined): CanvasNodeStyle {
        if (!nodeStyle) {
            nodeStyle = {};
        }

        if (!nodeStyle.strokeStyle) {
            nodeStyle.strokeStyle = {};
        }

        if (!nodeStyle.fillStyle) {
            nodeStyle.fillStyle = {};
        }

        return nodeStyle;
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