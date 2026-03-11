import type { EntityStyle } from "../types/EntityStyle";
import type { Point } from "../types/Point";

export function addDisposable(fn: () => any, disposables: any[]) {
    const disposable = fn();
    disposables.push(disposable);
    return disposable;
}


export function getDefaultStyle(style: EntityStyle | undefined): EntityStyle {
    if (!style) {
        style = {};
    }

    if (!style.stroke) {
        style.stroke = {};
    }

    if (!style.fill) {
        style.fill = {};
    }

    return style;
}

export function dist(p1: Point, p2: Point) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}
