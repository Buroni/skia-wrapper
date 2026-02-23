import { isStylable, type CanvasEntity, type Stylable } from "./types/CanvasEntity";

export function setStrokeWidth(entity: CanvasEntity, width: number): void {
    if (!isStylable(entity)) {
        return;
    }

    if (!entity.style.stroke) {
        throw new Error("Stroke not defined");
    }

    entity.style.stroke.width = width;
}

export function setStrokeColor(entity: CanvasEntity, color: number[]): void {
    if (!isStylable(entity)) {
        return;
    }

    if (!entity.style.stroke) {
        throw new Error("Stroke not defined");
    }

    entity.style.stroke.color = color;
}
