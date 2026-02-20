export type FontsContext = {
    addFont: (name: string, url: string) => Promise<void>;
};