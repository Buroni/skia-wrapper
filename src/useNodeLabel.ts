import type { Paragraph, ParagraphStyle, Path, TextAlign } from "canvaskit-wasm";
import type { CanvasNode } from "./types/CanvasNode";
import type { SkiaContext } from "./types/context/SkiaContext";
import { addDisposable } from "./utils/utils";
import type { LabelOptions } from "./types/LabelOptions";
import type { ParagraphBounds } from "./types/ParagraphBounds";

const DEFAULT_LABEL_OPTIONS = {
    fontSize: 24,
    width: "fit",
    textAlign: "center"
};

export function useNodeLabel(skiaContext: SkiaContext) {
    const { surface, CanvasKit, fonts } = skiaContext;

    const canvas = surface.getCanvas();

    function drawLabel(node: CanvasNode, paragraphStyle: ParagraphStyle, disposables: any[]): void {
        if (!node.labelOptions) {
            throw new Error('labelOptions must be defined on node');
        }

        const fontMgr = fonts[node.labelOptions.fontName];
        const builder = addDisposable(() => CanvasKit.ParagraphBuilder.Make(paragraphStyle, fontMgr), disposables);
        builder.addText(node.labelOptions.text);

        const paragraph = addDisposable(() => builder.build(), disposables);
        const paragraphWidth = node.labelOptions.width === "fit" ? getParagraphFitWidth(node.pathData.path) : node.labelOptions.width;
        paragraph.layout(paragraphWidth);
        const paragraphBounds = getParagraphBounds(paragraph, node.pathData.path);
        canvas.drawParagraph(paragraph, paragraphBounds.x, paragraphBounds.y);
    }

    function getParagraphStyle(labelOptions: LabelOptions) {
        return new CanvasKit.ParagraphStyle({
            textStyle: {
                color: CanvasKit.BLACK,
                fontFamilies: [labelOptions.fontName],
                fontSize: typeof labelOptions.fontSize === 'undefined' ? DEFAULT_LABEL_OPTIONS.fontSize : labelOptions.fontSize,
            },
            textAlign: toSkiaTextAlign(typeof labelOptions.textAlign === 'undefined' ? DEFAULT_LABEL_OPTIONS.textAlign : labelOptions.textAlign),
        });
    }

    function toSkiaTextAlign(textAlign: string): TextAlign {
        switch (textAlign) {
            case "left":
                return CanvasKit.TextAlign.Left;
            case "right":
                return CanvasKit.TextAlign.Right;
            case "center":
                return CanvasKit.TextAlign.Center;
        }

        throw new Error(`Can't map value '${textAlign} to TextAlign'`);
    }

    function getParagraphFitWidth(path: Path): number {
        const bounds = path.getBounds();

        const left = bounds[0];
        const right = bounds[2];
        const width = right - left;

        return width;
    }

    function getParagraphBounds(paragraph: Paragraph, path: Path): ParagraphBounds {
        const bounds = path.getBounds();

        const left = bounds[0];
        const top = bounds[1];
        const right = bounds[2];
        const bottom = bounds[3];
        const width = right - left;
        const height = bottom - top;
        const cx = left + width / 2;
        const cy = top + height / 2;

        const textHeight = paragraph.getHeight();

        return {
            x: cx - width / 2,
            y: cy - textHeight / 2,
            cx,
            cy
        };
    }

    return {
        drawLabel,
        getParagraphStyle
    };
}