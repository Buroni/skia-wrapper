import type { CanvasNode } from "../CanvasNode";

export type InnerListener = (e: Event, frontItem: CanvasNode | null, hitItems: CanvasNode[]) => void;
export type OuterListener = (e: Event) => void;

export type EventListenersContext = {
    addHitItemListener: (
        event: string,
        items: CanvasNode | CanvasNode[],
        fn: InnerListener
    ) => void;
    removeEventListener: (event: string, listener: InnerListener) => void;
};