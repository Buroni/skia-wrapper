export type LabelWidth = number | 'fit';

export type LabelOptions = {
    text: string;
    fontName: string;
    fontSize?: number;
    width?: LabelWidth;
    textAlign?: 'center' | 'left' | 'right';
};

export interface RequiredLabelOptions extends Omit<LabelOptions, "width" | "textAlign"> {
    width: LabelWidth;
    textAlign: 'center' | 'left' | 'right';
}