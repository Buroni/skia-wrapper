import { type CanvasPathNode } from "./types/CanvasNode";
import { InteractionKeys, useInteractionManager } from "./interactionManager";
import { type SkiaContext } from "./types/context/SkiaContext";

export function useDragDrop(skiaContext: SkiaContext): any {
    const DRAG_DROP_KEY = "DRAG_DROP_KEY";
    const {
        setInteraction,
        releaseInteraction,
        hasInteraction
    } = useInteractionManager(skiaContext, InteractionKeys.DRAG_INTERACTION, DRAG_DROP_KEY);

    let dragging: CanvasPathNode | null = null;
    let dx = 0;
    let dy = 0;

    setupEventListeners();

    let dragStartFn: (e: MouseEvent) => void;
    let draggingFn: (e: MouseEvent) => void;
    let dragEndFn: (e: MouseEvent) => void;

    let _isLastPointerMoveDrag = false;

    function onDragStart(fn: (e: MouseEvent) => void): void {
        dragStartFn = fn;
    }

    function onDragging(fn: (e: MouseEvent) => void): void {
        draggingFn = fn;
    }

    function onDragEnd(fn: (e: MouseEvent) => void): void {
        dragEndFn = fn;
    }

    function isDragging(): boolean {
        return Boolean(dragging);
    }

    function isLastPointerMoveDrag() {
        return _isLastPointerMoveDrag;
    }

    function hitTest(): void {
        for (const node of skiaContext.getNodes()) {
            if (node.pathData.path.contains(
                skiaContext.mouse.worldX - node.pathData.translateX,
                skiaContext.mouse.worldY - node.pathData.translateY)
            ) {
                dragging = node;
            }
        }
    }

    function setupEventListeners() {
        const { canvasEl } = skiaContext;

        canvasEl.addEventListener('pointerdown', async (e: MouseEvent) => {
            if (hasInteraction()) {
                return;
            }

            hitTest();

            if (dragging) {
                setInteraction();
                dragStartFn?.(e);

                dx = skiaContext.mouse.worldX - dragging.pathData.translateX;
                dy = skiaContext.mouse.worldY - dragging.pathData.translateY;
            }
        });

        canvasEl.addEventListener('pointermove', (e: MouseEvent) => {
            if (dragging) {
                _isLastPointerMoveDrag = true;

                draggingFn?.(e);

                dragging.pathData.translateX = skiaContext.mouse.worldX - dx;
                dragging.pathData.translateY = skiaContext.mouse.worldY - dy;
            } else {
                _isLastPointerMoveDrag = false;
            }
        });

        canvasEl.addEventListener('pointerup', (e: MouseEvent) => {
            dragEndFn?.(e);

            dragging = null;
            releaseInteraction();
        });
    }

    return {
        onDragStart,
        onDragging,
        onDragEnd,
        isDragging,
        isLastPointerMoveDrag
    }
}