import { type CanvasNode } from "./types/CanvasNode";

export function useEventListeners(skiaContext: any) {
    const { canvasEl } = skiaContext;

    const listeners = new Map<String, { event: string; listener: (e: any) => void }>();

    function addEventListener(
        event: string,
        items: CanvasNode | CanvasNode[],
        fn: (e: any, item: CanvasNode, pointerIsInsideItem: boolean) => void,
        unionFn?: (e: any, pointerIsInsideItems: boolean) => void
    ): string {
        if (!Array.isArray(items)) {
            items = [items];
        }

        const listener = (e) => {
            const collisionFlags: number[] = [];

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

    function removeEventListener(listenerId: string) {
        const { event, listener } = listeners.get(listenerId);

        if (!listener) {
            throw new Error(`Listener with ID ${listenerId} not found`);
        }

        canvasEl.removeEventListener(event, listener);
        listeners.delete(listenerId);
    }

    function createListenerId(event: string, listener: (e: any) => void): string {
        const listenerId = crypto.randomUUID();
        listeners.set(listenerId, { event, listener });

        return listenerId;
    }

    return {
        addEventListener,
        removeEventListener
    }
}