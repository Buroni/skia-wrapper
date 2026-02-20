import CanvasKitInit, { type Surface, type CanvasKit } from "canvaskit-wasm";
import wasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url';
import { type Addon, type DisplayOrderAddon, type Interactions, type SkiaContext } from "./types/context/SkiaContext";
import type { CanvasNode } from "./types/CanvasNode";

export async function useSkia(canvasQuerySelector: string): Promise<SkiaContext> {
    const CanvasKit = await getCanvasKit();
    const canvasEl = getCanvasEl();
    const surface = await getSurface();

    const addons: Addon[] = [];
    const displayOrderAddons: DisplayOrderAddon[] = [];
    const interactions: Interactions = {};
    const nodes: CanvasNode[] = [];

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

        displayOrderAddons.forEach(({ addon }) => {
            addon();
        });

        // Clean up
        canvas.restore();
        paint.delete();
        surface.flush();

        surface.requestAnimationFrame(drawFrame);
    }

    function syncAddons(): void {
        const indexMap = new Map(nodes.map((item, i) => [item, i]));

        displayOrderAddons.sort((aObj1, aObj2) => {
            return (indexMap.get(aObj1.entity) ?? Infinity) - (indexMap.get(aObj2.entity) ?? Infinity);
        });
    }

    return {
        canvasEl,
        CanvasKit,
        surface,
        addons,
        displayOrderAddons,
        interactions,
        mouse: {
            worldX: 0,
            worldY: 0
        },
        nodes,
        fonts: {},
        syncAddons
    }
}