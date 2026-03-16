import type { CanvasPathData } from "./types/CanvasPathData";
import type { NodePathsContext } from "./types/context/NodePathsContext";
import type { SkiaContext } from "./types/context/SkiaContext";

export function useNodePaths(skiaContext: SkiaContext): NodePathsContext {
    const { CanvasKit } = skiaContext;

    function circle(r: number, cx = 0, cy = 0): CanvasPathData {
        const path = new CanvasKit.Path();
        path.addCircle(0, 0, r);

        return {
            path,
            translateX: cx,
            translateY: cy,
            type: "circle"
        };
    }

    function rect(width: number, height: number, x = 0, y = 0): CanvasPathData {
        const path = new CanvasKit.Path();
        path.addRect(CanvasKit.XYWHRect(0, 0, width, height));

        return {
            path,
            translateX: x,
            translateY: y,
            type: "rect"
        }
    }

    return {
        circle,
        rect
    };
}
