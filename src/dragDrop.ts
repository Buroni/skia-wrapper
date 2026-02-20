import { type CanvasNode } from "./types/CanvasNode";
import { InteractionKeys, useInteractionManager } from "./interactionManager";
import { type SkiaContext } from "./types/SkiaContext";

export function useDragDrop(skiaContext: SkiaContext): void {
    const DRAG_DROP_KEY = "DRAG_DROP_KEY";
    const {
        setInteraction,
        releaseInteraction,
        hasInteraction
    } = useInteractionManager(skiaContext, InteractionKeys.DRAG_INTERACTION, DRAG_DROP_KEY);

    let dragging: CanvasNode | null = null;
    let dx = 0;
    let dy = 0;

    setupEventListeners();

    function hitTest(): void {
        for (const node of skiaContext.nodes) {
            if (node.pathData.path.contains(
                skiaContext.mouse.worldX - node.pathData.cx,
                skiaContext.mouse.worldY - node.pathData.cy)
            ) {
                dragging = node;
            }
        }
    }

    function setupEventListeners() {
        const { canvasEl } = skiaContext;

        canvasEl.addEventListener('pointerdown', async () => {
            if (hasInteraction()) {
                return;
            }

            hitTest();

            if (dragging) {
                setInteraction();
                dx = skiaContext.mouse.worldX - dragging.pathData.cx;
                dy = skiaContext.mouse.worldY - dragging.pathData.cy;
            }
        });

        canvasEl.addEventListener('pointermove', () => {
            if (dragging) {
                dragging.pathData.cx = skiaContext.mouse.worldX - dx;
                dragging.pathData.cy = skiaContext.mouse.worldY - dy;
            }
        });

        canvasEl.addEventListener('pointerup', () => {
            dragging = null;
            releaseInteraction();
        });
    }
}