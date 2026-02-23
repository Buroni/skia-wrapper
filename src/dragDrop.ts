import { type CanvasNode } from "./types/CanvasNode";
import { InteractionKeys, useInteractionManager } from "./interactionManager";
import { type SkiaContext } from "./types/context/SkiaContext";

export function useDragDrop(skiaContext: SkiaContext): any {
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

        canvasEl.addEventListener('pointerdown', async (e: MouseEvent) => {
            if (hasInteraction()) {
                return;
            }

            hitTest();

            if (dragging) {
                setInteraction();
                dragStartFn?.(e);

                dx = skiaContext.mouse.worldX - dragging.pathData.cx;
                dy = skiaContext.mouse.worldY - dragging.pathData.cy;
            }
        });

        canvasEl.addEventListener('pointermove', (e: MouseEvent) => {
            if (dragging) {
                _isLastPointerMoveDrag = true;

                draggingFn?.(e);

                dragging.pathData.cx = skiaContext.mouse.worldX - dx;
                dragging.pathData.cy = skiaContext.mouse.worldY - dy;
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