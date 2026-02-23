import type { EntityStyle } from "../types/EntityStyle";

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