import { type LabelOptions } from "./types/LabelOptions";
import { type CanvasPathData } from "./types/CanvasPathData";
import { type EntityStyle } from "./types/EntityStyle";
import { type SkiaContext } from "./types/context/SkiaContext";
import { type NodeContext } from "./types/context/NodeContext";
import { usePaint } from "./paint";
import { addDisposable, getDefaultStyle } from "./utils/utils";
import { useNodeLabel } from "./nodeLabel";
import type { ParagraphStyle } from "canvaskit-wasm";
import { usePorts } from "./ports";
import type { CanvasPathNode } from "./types/CanvasNode";
import type { NoOwnerPort, Port } from "./types/Port";

export function useNodes(skiaContext: SkiaContext): NodeContext {
    const paintContext = usePaint(skiaContext);
    const portsContext = usePorts(skiaContext);
    const nodeLabelContext = useNodeLabel(skiaContext);

    const { surface } = skiaContext;

    const canvas = surface.getCanvas();

    function createNode(pathData: CanvasPathData, ports: NoOwnerPort[] | NoOwnerPort, options: { nodeStyle?: EntityStyle, labelOptions?: LabelOptions } = {}): CanvasPathNode {
        const nodeStyle = getDefaultStyle(options.nodeStyle);
        const labelOptions = getDefaultLabelOptions(options.labelOptions);

        const node: CanvasPathNode = {
            type: "node",
            pathData,
            style: nodeStyle,
            labelOptions,
            ports: [],
            displayOrder: skiaContext.entities.length
        };

        // Assign ports
        if (!Array.isArray(ports)) {
            ports = [ports];
        }

        ports.forEach(port => {
            const portWithOwner: Port = { ...port, owner: node };
            portsContext.createPort(portWithOwner);
        });

        // Set paragraph style
        let paragraphStyle: ParagraphStyle | undefined;
        if (node.labelOptions) {
            paragraphStyle = nodeLabelContext.getParagraphStyle(node.labelOptions);
        }

        // Set renderer
        const renderer = makeRenderer(node, paragraphStyle);
        skiaContext.addEntity(node, renderer);

        return node;
    }

    function makeRenderer(node: CanvasPathNode, paragraphStyle?: ParagraphStyle): () => void {
        return () => {
            const disposables: any[] = [];

            canvas.save();
            canvas.translate(node.pathData.translateX, node.pathData.translateY);

            const { stroke, fill } = node.style;

            if (!stroke || !fill) {
                throw new Error("Node stroke and fill must be defined");
            }

            const strokePaint = addDisposable(() => paintContext.setStroke(stroke), disposables);
            canvas.drawPath(node.pathData.path, strokePaint);

            const fillPaint = addDisposable(() => paintContext.setFill(fill), disposables);
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