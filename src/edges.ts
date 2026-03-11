import type { Path } from "canvaskit-wasm";
import { isCanvasPathNode } from "./types/CanvasNode";
import type { SkiaContext } from "./types/context/SkiaContext";
import type { CanvasEdge } from "./types/CanvasEdge";
import type { EntityStyle } from "./types/EntityStyle";
import { addDisposable, getDefaultStyle } from "./utils/utils";
import { usePaint } from "./paint";
import type { Port } from "./types/Port";
import { getRelativePortLocation } from "./ports";

export function useEdges(skiaContext: SkiaContext) {
    const { surface, CanvasKit } = skiaContext;
    const paintContext = usePaint(skiaContext);

    const canvas = surface.getCanvas();

    function createEdge(sourcePort: Port, targetPort: Port, options: { edgeStyle?: EntityStyle } = {}): CanvasEdge {
        const edgeStyle = getDefaultStyle(options.edgeStyle);
        const path = drawEdgePath(sourcePort, targetPort);

        const edge: CanvasEdge = {
            type: "edge",
            sourcePort,
            targetPort,
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

            drawEdgePath(edge.sourcePort, edge.targetPort, path);

            canvas.save();
            canvas.translate(edge.sourcePort.owner.pathData.translateX, edge.sourcePort.owner.pathData.translateY);

            const strokePaint = addDisposable(() => paintContext.setStroke(stroke), disposables);
            canvas.drawPath(path, strokePaint);

            const fillPaint = addDisposable(() => paintContext.setFill(fill), disposables);
            canvas.drawPath(path, fillPaint);

            canvas.restore();
            disposables.forEach(disposable => disposable.delete());
        };
    }

    function drawEdgePath(sourcePort: Port, targetPort: Port, path?: Path): Path {
        if (path) {
            path.rewind();
        } else {
            path = new CanvasKit.Path();
        }

        const sourceNode = sourcePort.owner;
        const targetNode = targetPort.owner;

        const sourcePortLocation = getRelativePortLocation(sourcePort);
        const targetPortLocation = getRelativePortLocation(targetPort);

        path.moveTo(sourcePortLocation.x, sourcePortLocation.y);

        if (isCanvasPathNode(targetNode)) {
            path.lineTo(
                (targetNode.pathData.translateX - sourceNode.pathData.translateX) + targetPortLocation.x,
                (targetNode.pathData.translateY - sourceNode.pathData.translateY) + targetPortLocation.y
            );
        } else {
            const { mouse } = skiaContext;
            path.lineTo(
                (mouse.worldX - sourceNode.pathData.translateX) + targetPortLocation.x,
                (mouse.worldY - sourceNode.pathData.translateY) + targetPortLocation.y
            );
        }

        return path;
    }

    function createPreviewEdge(sourcePort: Port, options: { edgeStyle?: EntityStyle } = {}): CanvasEdge {
        return createEdge(sourcePort, { location: { x: 0, y: 0 }, owner: { type: "node", displayOrder: 0, pathData: { translateX: 0, translateY: 0 } } }, options);
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