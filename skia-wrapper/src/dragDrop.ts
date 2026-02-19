import { type CanvasNode } from "./CanvasNode";
import { InteractionKeys, useInteractionManager } from "./interactionManager.ts";

export function useDragDrop(skiaContext: any) {
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

        canvasEl.addEventListener('pointerdown', async (e) => {
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

        canvasEl.addEventListener('pointermove', e => {
            if (dragging) {
                dragging.pathData.cx = skiaContext.mouse.worldX - dx;
                dragging.pathData.cy = skiaContext.mouse.worldY - dy;
            }
        });

        canvasEl.addEventListener('pointerup', (e) => {
            dragging = null;
            releaseInteraction();
        });
    }
}