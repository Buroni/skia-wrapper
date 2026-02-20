import type { FontsContext } from "./types/context/FontsContext";
import type { SkiaContext } from "./types/context/SkiaContext";

export function useFonts(skiaContext: SkiaContext): FontsContext {
    const { CanvasKit, fonts } = skiaContext;

    async function addFont(name: string, url: string): Promise<void> {
        const response = await fetch(url);
        const arrBuffer = await response.arrayBuffer();
        const fontMgr = CanvasKit.FontMgr.FromData(arrBuffer);

        if (!fontMgr) {
            throw new Error(`Couldn't make font manager with name '${name}' and url '${url}'`)
        }

        fonts[name] = fontMgr;
    }

    return {
        addFont
    };
}