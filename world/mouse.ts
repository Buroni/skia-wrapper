export function useMouse(skiaContext) {
    const { canvasEl } = skiaContext;

    let boundingRect: DOMRect;

    refreshCanvasBoundingRect();

    // TODO - resize observer
    window.addEventListener("resize", refreshCanvasBoundingRect);

    function refreshCanvasBoundingRect() {
        boundingRect = canvasEl.getBoundingClientRect()
    }

    function mouseX(e) {
        return e.clientX - boundingRect.left;
    }

    function mouseY(e) {
        return e.clientY - boundingRect.top;
    }

    return {
        mouseX,
        mouseY
    }
}