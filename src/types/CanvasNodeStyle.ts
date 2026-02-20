export type CanvasNodeStrokeStyle = {
    strokeColor?: number[];
    strokeWidth?: number;
};

export type CanvasNodeFillStyle = {
    fillColor?: number[];
};

export type CanvasNodeStyle = {
    strokeStyle?: CanvasNodeStrokeStyle;
    fillStyle?: CanvasNodeFillStyle;
};