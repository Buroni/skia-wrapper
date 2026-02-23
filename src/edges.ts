import type { Canvas, Path } from "canvaskit-wasm";
import { isCanvasPathNode, type CanvasNode, type CanvasPathNode } from "./types/CanvasNode";
import type { SkiaContext } from "./types/context/SkiaContext";
import type { CanvasEdge } from "./types/CanvasEdge";
import type { EntityStyle } from "./types/EntityStyle";
import { addDisposable, getDefaultStyle } from "./utils/utils";
import { usePaint } from "./paint";

export function useEdges(skiaContext: SkiaContext) {
    const { surface, CanvasKit, displayOrderAddons } = skiaContext;
    const paintContext = usePaint(skiaContext);

    const canvas = surface.getCanvas();

    function createEdge(sourceNode: CanvasPathNode, targetNode: CanvasNode, options: { edgeStyle?: EntityStyle, isPreview?: boolean } = {}): CanvasEdge {
        const edgeStyle = getDefaultStyle(options.edgeStyle);
        const path = drawEdgePath(sourceNode, targetNode);

        const edge: CanvasEdge = {
            type: "edge",
            sourceNode,
            targetNode,
            displayOrder: skiaContext.numberEntities,
            style: edgeStyle,
            path
        };

        const drawFrame = makeDrawFrame(edge);

        displayOrderAddons.push({ entity: edge, addon: drawFrame, isPreview: options?.isPreview });
        skiaContext.edges.push(edge);

        return edge;
    }

    function makeDrawFrame(edge: CanvasEdge): () => void {
        return () => {
            const disposables: any[] = [];

            const { stroke, fill } = edge.style;
            const { path } = edge;

            if (!stroke || !fill) {
                throw new Error("Edge stroke and fill must be defined");
            }

            canvas.save();
            canvas.translate(edge.sourceNode.pathData.cx, edge.sourceNode.pathData.cy);

            const strokePaint = addDisposable(() => paintContext.setStroke(stroke), disposables);
            canvas.drawPath(path, strokePaint);

            const fillPaint = addDisposable(() => paintContext.setFill(fill), disposables);
            canvas.drawPath(path, fillPaint);

            drawEdgePath(edge.sourceNode, edge.targetNode, path);

            canvas.restore();
            disposables.forEach(disposable => disposable.delete());
        };
    }

    function drawEdgePath(sourceNode: CanvasPathNode, targetNode: CanvasNode, path?: Path): Path {
        if (path) {
            path.rewind();
        } else {
            path = new CanvasKit.Path();
        }

        path.moveTo(0, 0);

        if (isCanvasPathNode(targetNode)) {
            path.lineTo(targetNode.pathData.cx - sourceNode.pathData.cx, targetNode.pathData.cy - sourceNode.pathData.cy);
        } else {
            const { mouse } = skiaContext;
            path.lineTo(mouse.worldX - sourceNode.pathData.cx, mouse.worldY - sourceNode.pathData.cy);
        }

        return path;
    }

    function createPreviewEdge(sourceNode: CanvasPathNode, options: { edgeStyle?: EntityStyle, isPreview?: boolean } = {}): CanvasEdge {
        options = { ...options, isPreview: true };
        return createEdge(sourceNode, { type: "node", displayOrder: 0 }, options);
    }

    return {
        createEdge,
        createPreviewEdge
    };
}