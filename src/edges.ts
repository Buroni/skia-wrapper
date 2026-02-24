import type { Path } from "canvaskit-wasm";
import { isCanvasPathNode, type CanvasNode, type CanvasPathNode } from "./types/CanvasNode";
import type { SkiaContext } from "./types/context/SkiaContext";
import type { CanvasEdge } from "./types/CanvasEdge";
import type { EntityStyle } from "./types/EntityStyle";
import { addDisposable, getDefaultStyle } from "./utils/utils";
import { usePaint } from "./paint";

export function useEdges(skiaContext: SkiaContext) {
    const { surface, CanvasKit } = skiaContext;
    const paintContext = usePaint(skiaContext);

    const canvas = surface.getCanvas();

    function createEdge(sourceNode: CanvasPathNode, targetNode: CanvasNode, options: { edgeStyle?: EntityStyle, isPreview?: boolean } = {}): CanvasEdge {
        const edgeStyle = getDefaultStyle(options.edgeStyle);
        const path = drawEdgePath(sourceNode, targetNode);

        const edge: CanvasEdge = {
            type: "edge",
            sourceNode,
            targetNode,
            displayOrder: skiaContext.entities.length,
            style: edgeStyle,
            path
        };

        const renderer = makeRenderer(edge);
        skiaContext.addEntity(edge, renderer);

        return edge;
    }

    function makeRenderer(edge: CanvasEdge): () => void {
        return () => {
            const disposables: any[] = [];

            const { stroke, fill } = edge.style;
            const { path } = edge;

            if (!stroke || !fill) {
                throw new Error("Edge stroke and fill must be defined");
            }

            drawEdgePath(edge.sourceNode, edge.targetNode, path);

            canvas.save();
            canvas.translate(edge.sourceNode.pathData.translateX, edge.sourceNode.pathData.translateY);

            const strokePaint = addDisposable(() => paintContext.setStroke(stroke), disposables);
            canvas.drawPath(path, strokePaint);

            const fillPaint = addDisposable(() => paintContext.setFill(fill), disposables);
            canvas.drawPath(path, fillPaint);

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
            path.lineTo(targetNode.pathData.translateX - sourceNode.pathData.translateX, targetNode.pathData.translateY - sourceNode.pathData.translateY);
        } else {
            const { mouse } = skiaContext;
            path.lineTo(mouse.worldX - sourceNode.pathData.translateX, mouse.worldY - sourceNode.pathData.translateY);
        }

        return path;
    }

    function createPreviewEdge(sourceNode: CanvasPathNode, options: { edgeStyle?: EntityStyle, isPreview?: boolean } = {}): CanvasEdge {
        options = { ...options, isPreview: true };
        return createEdge(sourceNode, { type: "node", displayOrder: 0 }, options);
    }

    function deleteEdge(edge: CanvasEdge): void {
        const idx = skiaContext.entities.findIndex(e => e === edge);
        skiaContext.entities.splice(idx, 1);
    }

    return {
        createEdge,
        createPreviewEdge,
        deleteEdge
    };
}