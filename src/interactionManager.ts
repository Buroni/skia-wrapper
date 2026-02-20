import type { InteractionManagerContext } from "./types/context/InteractionManagerContext";
import { type SkiaContext } from "./types/context/SkiaContext";

export function useInteractionManager(skiaContext: SkiaContext, key: string, callerId: string): InteractionManagerContext {
    if (!skiaContext.interactions[key]) {
        skiaContext.interactions[key] = {
            callerId: null
        };
    }

    function setInteraction(): void {
        if (skiaContext.interactions[key].callerId !== null) {
            throw new Error("Interaction already set");
        }

        skiaContext.interactions[key].callerId = callerId;
    }

    function releaseInteraction() {
        const currentCallerId = skiaContext.interactions[key].callerId;
        if (currentCallerId !== null && currentCallerId !== callerId) {
            return;
        }

        skiaContext.interactions[key].callerId = null;
    }

    function hasInteraction() {
        return skiaContext.interactions[key].callerId !== null;
    }

    return {
        setInteraction,
        releaseInteraction,
        hasInteraction
    }
}

export const InteractionKeys = {
    DRAG_INTERACTION: 'DRAG_INTERACTION'
};