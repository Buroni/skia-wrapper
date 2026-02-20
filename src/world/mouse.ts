import type { MouseContext } from "../types/context/MouseContext";
import { type SkiaContext } from "../types/context/SkiaContext";

export function useMouse(skiaContext: SkiaContext): MouseContext {
    const { canvasEl } = skiaContext;

    let boundingRect: DOMRect;

    refreshCanvasBoundingRect();

    // TODO - resize observer
    window.addEventListener("resize", refreshCanvasBoundingRect);

    function refreshCanvasBoundingRect() {
        boundingRect = canvasEl.getBoundingClientRect()
    }

    function mouseX(e: MouseEvent): number {
        return e.clientX - boundingRect.left;
    }

    function mouseY(e: MouseEvent): number {
        return e.clientY - boundingRect.top;
    }

    return {
        mouseX,
        mouseY
    };
}