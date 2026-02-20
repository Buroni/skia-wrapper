import type { CanvasNode } from "../CanvasNode";

export type EventListenersContext = {
    addEventListener: (
        event: string,
        items: CanvasNode | CanvasNode[],
        fn: (e: Event, item: CanvasNode, pointerIsInsideItem: boolean) => void,
        unionFn?: (e: Event, pointerIsInsideItems: boolean) => void
    ) => string;
    removeEventListener: (listenerId: string) => void;
};