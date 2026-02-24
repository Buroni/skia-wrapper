import { type CanvasPathNode } from "./types/CanvasNode";
import type { EventListenersContext, InnerListener, OuterListener } from "./types/context/EventListenersContext";
import { type SkiaContext } from "./types/context/SkiaContext";
import { TwoKeyMap } from "./utils/TwoKeyMap";

export function useEventListeners(skiaContext: SkiaContext): EventListenersContext {
    const { canvasEl } = skiaContext;

    const listenerMap = new TwoKeyMap<string, InnerListener, OuterListener>();

    function addHitItemListener(
        event: string,
        items: (CanvasPathNode | CanvasPathNode[]) | (() => CanvasPathNode[]),
        fn: InnerListener
    ): void {
        if (!Array.isArray(items) && typeof items !== "function") {
            items = [items];
        }

        const outerListener = (e: Event) => {
            const hitItems: CanvasPathNode[] = [];

            const resolvedItems = typeof items === "function" ? items() : items;

            for (const item of resolvedItems as CanvasPathNode[]) {
                const pointerIsInsideItem = item.pathData.path.contains(
                    skiaContext.mouse.worldX - item.pathData.translateX,
                    skiaContext.mouse.worldY - item.pathData.translateY
                );

                if (pointerIsInsideItem) {
                    hitItems.push(item);
                }
            }

            const frontItem = hitItems.length ? hitItems[hitItems.length - 1] : null;

            fn(e, frontItem, hitItems);
        }

        canvasEl.addEventListener(event, outerListener);

        listenerMap.set(event, fn, outerListener);
    }

    function removeEventListener(event: string, listener: InnerListener): void {
        const outerListener = listenerMap.get(event, listener);

        if (!outerListener) {
            return;
        }

        canvasEl.removeEventListener(event, outerListener);
        listenerMap.delete(event, listener);
    }

    return {
        addHitItemListener,
        removeEventListener
    }
}