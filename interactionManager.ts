export function useInteractionManager(skiaContext, key: string, callerId: string) {
    if (!skiaContext.interactions[key]) {
        skiaContext.interactions[key] = {
            callerId: null
        };
    }

    function setInteraction() {
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