import { type CanvasNode } from "./types/CanvasNode";
import type { EventListenersContext } from "./types/context/EventListenersContext";
import { type SkiaContext } from "./types/context/SkiaContext";

export function useEventListeners(skiaContext: SkiaContext): EventListenersContext {
    const { canvasEl } = skiaContext;

    const listeners = new Map<String, { event: string; listener: (e: Event) => void }>();

    function addEventListener(
        event: string,
        items: CanvasNode | CanvasNode[],
        fn: (e: Event, item: CanvasNode, pointerIsInsideItem: boolean) => void,
        unionFn?: (e: Event, pointerIsInsideItems: boolean) => void
    ): string {
        if (!Array.isArray(items)) {
            items = [items];
        }

        const listener = (e: Event) => {
            const collisionFlags: boolean[] = [];

            for (const item of items) {
                const pointerIsInsideItem = item.pathData.path.contains(
                    skiaContext.mouse.worldX - item.pathData.cx,
                    skiaContext.mouse.worldY - item.pathData.cy
                );
                collisionFlags.push(pointerIsInsideItem);

                fn(e, item, pointerIsInsideItem);
            }

            if (unionFn) {
                const pointerIsInsideItems = collisionFlags.some(Boolean);
                unionFn(e, pointerIsInsideItems);
            }
        }
        canvasEl.addEventListener(event, listener);

        return createListenerId(event, listener);
    }

    function removeEventListener(listenerId: string): void {
        const listenerEntry = listeners.get(listenerId);

        if (!listenerEntry) {
            throw new Error(`No listener with key '${listenerId}'`);
        }

        const { event, listener } = listenerEntry;

        canvasEl.removeEventListener(event, listener);
        listeners.delete(listenerId);
    }

    function createListenerId(event: string, listener: (e: Event) => void): string {
        const listenerId = crypto.randomUUID();
        listeners.set(listenerId, { event, listener });

        return listenerId;
    }

    return {
        addEventListener,
        removeEventListener
    }
}