export async function useSkia(canvasQuerySelector) {
    const CanvasKit = await getCanvasKit();
    const canvasEl = getCanvasEl();
    const surface = await getSurface();

    const addons = [];
    const interactions = {};

    drawFrame();

    async function getCanvasKit() {
        return await (window as any).CanvasKitInit({
            locateFile: (file) => 'https://unpkg.com/canvaskit-wasm@0.39.1/bin/' + file,
        });
    }

    function getCanvasEl(): HTMLCanvasElement {
        const canvasEl = document.querySelector(canvasQuerySelector);

        if (!canvasEl) {
            throw new Error('Could not find canvas');
        }

        return canvasEl;
    }

    async function getSurface(): Promise<any> {
        const surface = CanvasKit.MakeCanvasSurface('canvas');
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