import CanvasKitInit, { type Surface, type CanvasKit } from "canvaskit-wasm";
import wasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url';
import { type Addon, type DisplayOrderAddon, type Interactions, type SkiaContext } from "./types/context/SkiaContext";
import type { CanvasPathNode } from "./types/CanvasNode";
import type { CanvasEntity } from "./types/CanvasEntity";

export async function useSkia(canvasQuerySelector: string): Promise<SkiaContext> {
    const CanvasKit = await getCanvasKit();
    const canvasEl = getCanvasEl();
    const surface = await getSurface();

    const addons: Addon[] = [];
    const displayOrderAddons: DisplayOrderAddon[] = [];

    const interactions: Interactions = {};
    const nodes: CanvasPathNode[] = [];
    const edges: any[] = [];

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
        const entities: CanvasEntity[] = [...nodes, ...edges];
        entities.sort((e1, e2) => e1.displayOrder - e2.displayOrder);

        const indexMap = new Map(entities.map((item, i) => [item, i]));

        const toBeRemoved = displayOrderAddons
            .map((a, idx) => ({ idx, doRemove: !entities.includes(a.entity) }))
            .filter(a => a.doRemove);
        toBeRemoved.sort((a, b) => b.idx - a.idx);

        for (const a of toBeRemoved) {
            displayOrderAddons.splice(a.idx, 1);
        }

        displayOrderAddons.sort((aObj1, aObj2) => {
            return (indexMap.get(aObj1.entity) ?? Infinity) - (indexMap.get(aObj2.entity) ?? Infinity);
        });
    }

    function clearPreviews(): void {
        const toBeRemoved: number[] = displayOrderAddons
            .map((a, idx) => ({ isPreview: a.isPreview, idx }))
            .filter(a => a.isPreview)
            .map(a => a.idx);

        toBeRemoved.sort((a, b) => b - a);

        for (const idx of toBeRemoved) {
            displayOrderAddons.splice(idx, 1);
        }
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
        edges,
        get entities(): CanvasEntity[] {
            const entities: CanvasEntity[] = [...nodes, ...edges];
            entities.sort((e1, e2) => e1.displayOrder - e2.displayOrder);

            return entities;
        },
        get numberEntities(): number {
            return nodes.length + edges.length;
        },
        fonts: {},
        syncAddons,
        clearPreviews
    }
}