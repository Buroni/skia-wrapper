import { type SkiaContext } from "../types/SkiaContext";

// TODO - type MouseContext
export function useMouse(skiaContext: SkiaContext) {
    const { canvasEl } = skiaContext;

    let boundingRect: DOMRect;

    refreshCanvasBoundingRect();

    // TODO - resize observer
    window.addEventListener("resize", refreshCanvasBoundingRect);

    function refreshCanvasBoundingRect() {
        boundingRect = canvasEl.getBoundingClientRect()
    }

    function mouseX(e: MouseEvent) {
        return e.clientX - boundingRect.left;
    }

    function mouseY(e: MouseEvent) {
        return e.clientY - boundingRect.top;
    }

    return {
        mouseX,
        mouseY
    }
}