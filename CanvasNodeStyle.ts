import { RequiredLabelOptions, LabelOptions } from "./LabelOptions";

export type CanvasNodeStyle = {
    strokeColor?: number[];
    strokeWidth?: number;
    labelOptions: LabelOptions;
}

export type RequiredCanvasNodeStyle = {
    strokeColor: number[];
    strokeWidth: number;
    labelOptions: RequiredLabelOptions;
}