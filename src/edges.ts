import type { Paint } from "canvaskit-wasm";
import { isCanvasPathNode, type CanvasNode, type CanvasPathNode } from "./types/CanvasNode";
import type { SkiaContext } from "./types/context/SkiaContext";
import type { CanvasEdge } from "./types/CanvasEdge";

export function useEdges(skiaContext: SkiaContext) {
    const { surface, CanvasKit, displayOrderAddons } = skiaContext;

    const canvas = surface.getCanvas();

    function createEdge(sourceNode: CanvasPathNode, targetNode: CanvasNode): CanvasEdge {
        const edge: CanvasEdge = {
            type: "edge",
            sourceNode,
            targetNode,
            displayOrder: skiaContext.numberEntities
        };

        const drawFrame = () => {
            const paint = new CanvasKit.Paint();
            paint.setStyle(CanvasKit.PaintStyle.Stroke);
            paint.setColor(CanvasKit.Color4f(0, 0, 0, 1));
            paint.setStrokeWidth(2);
            paint.setAntiAlias(true);

            drawEdgePath(edge, paint);
        };

        displayOrderAddons.push({ entity: edge, addon: drawFrame });
        skiaContext.edges.push(edge);

        return edge;
    }

    function drawEdgePath(edge: CanvasEdge, paint: Paint): void {
        const { sourceNode, targetNode } = edge;

        canvas.save();
        canvas.translate(edge.sourceNode.pathData.cx, edge.sourceNode.pathData.cy);

        const path = new CanvasKit.Path();
        path.moveTo(0, 0);

        if (isCanvasPathNode(targetNode)) {
            path.lineTo(targetNode.pathData.cx - sourceNode.pathData.cx, targetNode.pathData.cy - sourceNode.pathData.cy);
        } else {
            const { mouse } = skiaContext;
            path.lineTo(mouse.worldX - sourceNode.pathData.cx, mouse.worldY - sourceNode.pathData.cy);
        }

        canvas.drawPath(path, paint);

        canvas.restore();
        path.delete();
    }

    function createPreviewEdge(sourceNode: CanvasPathNode): CanvasEdge {
        const edge: CanvasEdge = {
            type: "edge",
            sourceNode,
            targetNode: { type: "node", displayOrder: 0 },
            displayOrder: skiaContext.numberEntities
        }

        const drawFrame = () => {
            const paint = new CanvasKit.Paint();
            paint.setStyle(CanvasKit.PaintStyle.Stroke);
            paint.setColor(CanvasKit.Color4f(0, 0, 0, 1));
            paint.setStrokeWidth(2);
            paint.setAntiAlias(true);

            drawEdgePath(edge, paint);
        };

        displayOrderAddons.push({ entity: edge, addon: drawFrame, isPreview: true });
        skiaContext.edges.push(edge);

        return edge;
    }

    return {
        createEdge,
        createPreviewEdge
    };
}