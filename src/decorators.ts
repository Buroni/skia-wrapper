import { usePaint } from "./paint";
import { getRelativePortLocation } from "./ports";
import type { SkiaContext } from "./types/context/SkiaContext";
import type { Port } from "./types/Port";
import { addDisposable } from "./utils/utils";

export function useDecorators(skiaContext: SkiaContext) {
    const paintContext = usePaint(skiaContext);
    const { surface, CanvasKit } = skiaContext;

    const canvas = surface.getCanvas();

    function createPortDecorator(port: Port) {
        const renderer = makePortDecoratorRenderer(port);
        skiaContext.portDecoratorRenderers.set(port, renderer);
    }

    function makePortDecoratorRenderer(port: Port): () => void {
        return () => {
            const disposables: any[] = [];
            const node = port.owner;

            const relativePortLocation = getRelativePortLocation(port);

            canvas.save();

            canvas.translate(
                node.pathData.translateX + relativePortLocation.x + (port.decorator?.translateX ?? 0),
                node.pathData.translateY + relativePortLocation.y + (port.decorator?.translateY ?? 0)
            );

            const strokePaint = addDisposable(() => paintContext.setStroke({}), disposables);
            canvas.drawPath(port.decorator.path, strokePaint);

            const fillPaint = addDisposable(() => paintContext.setFill({}), disposables);
            canvas.drawPath(port.decorator.path, fillPaint);

            canvas.restore();

            disposables.forEach(disposable => disposable.delete());
        }
    }

    return {
        createPortDecorator
    };
}