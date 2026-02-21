import { type EntityStrokeStyle } from "./types/EntityStyle";
import type { NodePaintContext } from "./types/context/NodePaintContext";
import { type SkiaContext } from "./types/context/SkiaContext";
import { type Paint } from "canvaskit-wasm";

const DEFAULT_STROKE_STYLE = {
    color: [0, 0, 0, 1],
    width: 4
};

const DEFAULT_FILL_STYLE = {
    color: [1, 1, 1, 1]
}

export function useNodePaint(skiaContext: SkiaContext): NodePaintContext {
    const { CanvasKit } = skiaContext;

    function setStroke({
        color = DEFAULT_STROKE_STYLE.color,
        width = DEFAULT_STROKE_STYLE.width }: EntityStrokeStyle
    ): Paint {
        const strokePaint = new CanvasKit.Paint();
        strokePaint.setStyle(CanvasKit.PaintStyle.Stroke);

        strokePaint.setColor(CanvasKit.Color4f(color[0], color[1], color[2], color[3]));
        strokePaint.setStrokeWidth(width);
        strokePaint.setAntiAlias(true);

        return strokePaint;
    }

    function setFill({ color = DEFAULT_FILL_STYLE.color }): Paint {
        const fillPaint = new CanvasKit.Paint();
        fillPaint.setStyle(CanvasKit.PaintStyle.Fill);

        fillPaint.setColor(CanvasKit.Color4f(color[0], color[1], color[2], color[3]));
        fillPaint.setAntiAlias(true);

        return fillPaint;
    }

    return {
        setStroke,
        setFill
    };
}