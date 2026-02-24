import CanvasKitInit, { type Surface, type CanvasKit } from "canvaskit-wasm";
import wasmUrl from 'canvaskit-wasm/bin/canvaskit.wasm?url';
import { type Addon, type Interactions, type SkiaContext } from "./types/context/SkiaContext";
import { entityIsEdge, entityIsNode, type CanvasEntity } from "./types/CanvasEntity";

export async function useSkia(canvasQuerySelector: string): Promise<SkiaContext> {
    const CanvasKit = await getCanvasKit();
    const canvasEl = getCanvasEl();
    const surface = await getSurface();

    const addons: Addon[] = [];
    const displayOrderAddons = new WeakMap<CanvasEntity, () => void>();

    const interactions: Interactions = {};
    const entities: CanvasEntity[] = [];

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

        // displayOrderAddons.forEach(({ addon }) => {
        //     addon();
        // });

        entities.forEach(entity => {
            const addon = displayOrderAddons.get(entity);

            if (!addon) {
                throw new Error("Couldn't render entity");
            }

            addon();
        })

        // Clean up
        canvas.restore();
        paint.delete();
        surface.flush();

        surface.requestAnimationFrame(drawFrame);
    }

    function syncAddons(): void {
        entities.sort((e1, e2) => e1.displayOrder - e2.displayOrder);
    }

    function getNodes() {
        return entities.filter(entity => entityIsNode(entity));
    }

    function getEdges() {
        return entities.filter(entity => entityIsEdge(entity));
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
        get numberEntities(): number {
            return entities.length;
        },
        getNodes,
        getEdges,
        entities,
        fonts: {},
        syncAddons,
        displayOrderAddons
    }
}