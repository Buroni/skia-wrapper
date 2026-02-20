import type { CanvasNodePathData } from "./types/CanvasNode";
import type { NodePathsContext } from "./types/context/NodePathsContext";
import type { SkiaContext } from "./types/context/SkiaContext";

export function useNodePaths(skiaContext: SkiaContext): NodePathsContext {
    const { CanvasKit } = skiaContext;

    function circle(cx: number, cy: number, r: number): CanvasNodePathData {
        const path = new CanvasKit.Path();

        return {
            path: path.addCircle(0, 0, r),
            cx,
            cy,
            r
        };
    }

    return {
        circle
    };
}
