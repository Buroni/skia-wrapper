import type { CanvasPathNode } from "../CanvasNode";

export type InnerListener = (e: Event, frontItem: CanvasPathNode | null, hitItems: CanvasPathNode[]) => void;
export type OuterListener = (e: Event) => void;

export type EventListenersContext = {
    addHitItemListener: (
        event: string,
        items: CanvasPathNode | CanvasPathNode[],
        fn: InnerListener
    ) => void,
    removeEventListener: (event: string, listener: InnerListener) => void;
};