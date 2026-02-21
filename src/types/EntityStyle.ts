export type EntityStrokeStyle = {
    color?: number[];
    width?: number;
};

export type EntityFillStyle = {
    color?: number[];
};

export type EntityStyle = {
    stroke?: EntityStrokeStyle;
    fill?: EntityFillStyle;
};