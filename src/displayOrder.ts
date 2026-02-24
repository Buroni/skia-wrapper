import type { CanvasEntity } from "./types/CanvasEntity";
import type { SkiaContext } from "./types/context/SkiaContext";

export function useDisplayOrder(skiaContext: SkiaContext) {
    function toBack(entity: CanvasEntity): void {
        const minDisplayOrder = skiaContext.entities[0].displayOrder;
        entity.displayOrder = minDisplayOrder - 1;

        skiaContext.syncDisplayOrders();
    }

    function toFront(entity: CanvasEntity): void {
        const maxDisplayOrder = skiaContext.entities[skiaContext.entities.length - 1].displayOrder;
        entity.displayOrder = maxDisplayOrder + 1;

        skiaContext.syncDisplayOrders();
    }

    return {
        toBack,
        toFront
    };
}