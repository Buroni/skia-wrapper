import { type CanvasNodeStrokeStyle } from "./types/CanvasNodeStyle";
import type { NodePaintContext } from "./types/context/NodePaintContext";
import { type SkiaContext } from "./types/context/SkiaContext";
import { type Paint } from "canvaskit-wasm";

const DEFAULT_STROKE_STYLE = {
    strokeColor: [0, 0, 0, 1],
    strokeWidth: 4
};

const DEFAULT_FILL_STYLE = {
    fillColor: [1, 1, 1, 1]
}

export function useNodePaint(skiaContext: SkiaContext): NodePaintContext {
    const { CanvasKit } = skiaContext;

    function setStroke({
        strokeColor = DEFAULT_STROKE_STYLE.strokeColor,
        strokeWidth = DEFAULT_STROKE_STYLE.strokeWidth }: CanvasNodeStrokeStyle
    ): Paint {
        const strokePaint = new CanvasKit.Paint();
        strokePaint.setStyle(CanvasKit.PaintStyle.Stroke);

        strokePaint.setColor(CanvasKit.Color4f(strokeColor[0], strokeColor[1], strokeColor[2], strokeColor[3]));
        strokePaint.setStrokeWidth(strokeWidth);
        strokePaint.setAntiAlias(true);

        return strokePaint;
    }

    function setFill({ fillColor = DEFAULT_FILL_STYLE.fillColor }): Paint {
        const fillPaint = new CanvasKit.Paint();
        fillPaint.setStyle(CanvasKit.PaintStyle.Fill);

        fillPaint.setColor(CanvasKit.Color4f(fillColor[0], fillColor[1], fillColor[2], fillColor[3]));
        fillPaint.setAntiAlias(true);

        return fillPaint;
    }

    return {
        setStroke,
        setFill
    };
}