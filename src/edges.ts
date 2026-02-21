import type { Paint } from "canvaskit-wasm";
import type { CanvasNode } from "./types/CanvasNode";
import type { SkiaContext } from "./types/context/SkiaContext";
import type { CanvasEdge } from "./types/CanvasEdge";

export function useEdges(skiaContext: SkiaContext) {
    const { surface, CanvasKit, displayOrderAddons, addons } = skiaContext;

    const canvas = surface.getCanvas();

    function createEdge(sourceNode: CanvasNode, targetNode: CanvasNode): CanvasEdge {
        const edge: any = {
            sourceNode,
            targetNode,
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
        path.lineTo(targetNode.pathData.cx - sourceNode.pathData.cx, targetNode.pathData.cy - sourceNode.pathData.cy);
        canvas.drawPath(path, paint);

        canvas.restore();
        path.delete();
    }

    function createPreviewEdge(sourceNode: CanvasNode) {
        const drawFrame = () => {
            const paint = new CanvasKit.Paint();
            paint.setStyle(CanvasKit.PaintStyle.Stroke);
            paint.setColor(CanvasKit.Color4f(0, 0, 0, 1));
            paint.setStrokeWidth(2);
            paint.setAntiAlias(true);

            canvas.drawLine(sourceNode.pathData.cx, sourceNode.pathData.cy, skiaContext.mouse.worldX, skiaContext.mouse.worldY, paint);
        };

        addons.push(drawFrame);
    }

    return {
        createEdge,
        createPreviewEdge
    };
}