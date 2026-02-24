import type { CanvasNodePathData } from "./types/CanvasNode";
import type { NodePathsContext } from "./types/context/NodePathsContext";
import type { SkiaContext } from "./types/context/SkiaContext";

export function useNodePaths(skiaContext: SkiaContext): NodePathsContext {
    const { CanvasKit } = skiaContext;

    function circle(cx: number, cy: number, r: number): CanvasNodePathData {
        const path = new CanvasKit.Path();
        path.addCircle(0, 0, r);

        return {
            path,
            translateX: cx,
            translateY: cy
        };
    }

    function rect(x: number, y: number, width: number, height: number): CanvasNodePathData {
        const path = new CanvasKit.Path();
        path.addRect(CanvasKit.XYWHRect(0, 0, width, height));

        return {
            path,
            translateX: x,
            translateY: y
        }
    }

    return {
        circle,
        rect
    };
}
