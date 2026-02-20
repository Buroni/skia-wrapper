export type InteractionManagerContext = {
    setInteraction: () => void;
    releaseInteraction: () => void;
    hasInteraction: () => boolean;
};