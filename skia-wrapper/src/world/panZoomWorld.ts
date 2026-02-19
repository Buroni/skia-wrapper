import { InteractionKeys, useInteractionManager } from "../interactionManager.js";
import { useMouse } from "./mouse.js";

export function usePanZoomWorld(skiaContext) {
    const mouseContext = useMouse(skiaContext);

    const { canvasEl, surface, addons } = skiaContext;

    const PAN_ZOOM_KEY = "PAN_ZOOM_KEY";
    const {
        setInteraction,
        releaseInteraction,
        hasInteraction
    } = useInteractionManager(skiaContext, InteractionKeys.DRAG_INTERACTION, PAN_ZOOM_KEY);

    // Transform state
    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;

    // Pan state
    let isPanning = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    setupEventListeners();

    addons.push(drawFrame);

    function drawFrame() {
        const canvas = surface.getCanvas();

        canvas.save();
        canvas.translate(translateX, translateY);
        canvas.scale(scale, scale);
    }

    function setupEventListeners() {
        // Zoom with mouse wheel
        canvasEl.addEventListener('wheel', (e) => {
            e.preventDefault();

            const mouseX = mouseContext.mouseX(e);
            const mouseY = mouseContext.mouseY(e);

            // Calculate zoom
            const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
            const newScale = Math.max(0.5, Math.min(10, scale * zoomFactor));

            // Calculate world position before zoom
            const worldX = (mouseX - translateX) / scale;
            const worldY = (mouseY - translateY) / scale;

            skiaContext.mouse.worldX = worldX;
            skiaContext.mouse.worldY = worldY;

            // Update scale
            scale = newScale;

            // Adjust translation to keep point under cursor
            translateX = mouseX - worldX * scale;
            translateY = mouseY - worldY * scale;
        });

        // Pan with mouse drag
        canvasEl.addEventListener('mousedown', async (e) => {
            if (!hasInteraction()) {
                setInteraction();
                isPanning = true;
                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }
        });

        canvasEl.addEventListener('mousemove', (e) => {
            if (isPanning) {
                const dx = e.clientX - lastMouseX;
                const dy = e.clientY - lastMouseY;

                translateX += dx;
                translateY += dy;

                lastMouseX = e.clientX;
                lastMouseY = e.clientY;
            }

            // ...
            const mouseX = mouseContext.mouseX(e);
            const mouseY = mouseContext.mouseY(e);
            const worldX = (mouseX - translateX) / scale;
            const worldY = (mouseY - translateY) / scale;
            skiaContext.mouse.worldX = worldX;
            skiaContext.mouse.worldY = worldY;
        });

        canvasEl.addEventListener('mouseup', () => {
            releaseInteraction();
            isPanning = false;
        });

        canvasEl.addEventListener('mouseleave', () => {
            releaseInteraction();
            isPanning = false;
        });
    }
}