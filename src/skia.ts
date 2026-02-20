import CanvasKitInit, { type Surface, type CanvasKit } from "canvaskit-wasm";
import wasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url';
import { type Addon, type Interactions, type SkiaContext } from "./types/SkiaContext";

export async function useSkia(canvasQuerySelector: string): Promise<SkiaContext> {
    const CanvasKit = await getCanvasKit();
    const canvasEl = getCanvasEl();
    const surface = await getSurface();

    const addons: Addon[] = [];
    const interactions: Interactions = {};

    drawFrame();

    async function getCanvasKit(): Promise<CanvasKit> {
        return await CanvasKitInit({
            locateFile: () => wasmUrl
        });
    }

    function getCanvasEl(): HTMLCanvasElement {
        const canvasEl = document.querySelector<HTMLCanvasElement>(canvasQuerySelector);

        if (!canvasEl) {
            throw new Error('Could not find canvas');
        }

        return canvasEl;
    }

    async function getSurface(): Promise<Surface> {
        const surface = CanvasKit.MakeWebGLCanvasSurface('canvas');
        if (!surface) {
            throw new Error('Could not make surface');
        }

        return surface;
    }

    function drawFrame(): void {
        const canvas = surface.getCanvas();

        // Clear
        const paint = new CanvasKit.Paint();
        paint.setColor(CanvasKit.WHITE);
        paint.setStyle(CanvasKit.PaintStyle.Fill);
        canvas.clear(CanvasKit.WHITE);

        addons.forEach(addon => {
            addon();
        });

        // Clean up
        canvas.restore();
        paint.delete();
        surface.flush();

        surface.requestAnimationFrame(drawFrame);
    }

    return {
        canvasEl,
        CanvasKit,
        surface,
        addons,
        interactions,
        mouse: {
            worldX: 0,
            worldY: 0
        },
        nodes: []
    }
}