export type CanvasNodeStrokeStyle = {
    color?: number[];
    width?: number;
};

export type CanvasNodeFillStyle = {
    color?: number[];
};

export type CanvasNodeStyle = {
    stroke?: CanvasNodeStrokeStyle;
    fill?: CanvasNodeFillStyle;
};