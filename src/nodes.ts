import { type RequiredLabelOptions } from "./types/LabelOptions";
import { type CanvasNode, type CanvasNodePathData } from "./types/CanvasNode";
import { type CanvasNodeStyle, type RequiredCanvasNodeStyle } from "./types/CanvasNodeStyle";
import { type Path, type Paragraph, type TextAlign, type FontMgr } from "canvaskit-wasm"
import type { ParagraphBounds } from "./types/ParagraphBounds";
import { type SkiaContext } from "./types/context/SkiaContext";
import { type NodeContext } from "./types/context/NodeContext";

export function useNodes(skiaContext: SkiaContext): NodeContext {
    const { surface, CanvasKit, addons } = skiaContext;
    const fonts: Record<string, FontMgr> = {};

    async function addFont(name: string, url: string): Promise<void> {
        const response = await fetch(url);
        const arrBuffer = await response.arrayBuffer();
        const fontMgr = CanvasKit.FontMgr.FromData(arrBuffer);

        if (!fontMgr) {
            throw new Error(`Couldn't make font manager with name '${name}' and url '${url}'`)
        }

        fonts[name] = fontMgr;
    }

    function createNode(pathData: CanvasNodePathData, nodeStyle: CanvasNodeStyle): CanvasNode {
        const requiredNodeStyle: RequiredCanvasNodeStyle = {
            strokeColor: [0, 0, 0, 1],
            strokeWidth: 4,
            ...nodeStyle,
            labelOptions: {
                width: "fit",
                textAlign: "center",
                ...nodeStyle.labelOptions
            }
        }

        const node: CanvasNode = {
            pathData,
            style: requiredNodeStyle
        }

        const paragraphStyle = getParagraphStyle(node.style.labelOptions);

        const drawFrame = () => {
            const disposables: any[] = [];
            const canvas = surface.getCanvas();
            const strokePaint = addDisposable(() => new CanvasKit.Paint(), disposables);

            // Paint
            const { strokeColor, strokeWidth } = node.style;
            strokePaint.setColor(CanvasKit.Color4f(strokeColor[0], strokeColor[1], strokeColor[2], strokeColor[3]));
            strokePaint.setStyle(CanvasKit.PaintStyle.Stroke);
            strokePaint.setStrokeWidth(strokeWidth);
            strokePaint.setAntiAlias(true);

            canvas.save();
            canvas.translate(node.pathData.cx, node.pathData.cy);
            canvas.drawPath(node.pathData.path, strokePaint);

            const fontMgr = fonts[node.style.labelOptions.fontName];

            const builder = addDisposable(() => CanvasKit.ParagraphBuilder.Make(paragraphStyle, fontMgr), disposables);
            builder.addText(node.style.labelOptions.text);

            const paragraph = addDisposable(() => builder.build(), disposables);
            const paragraphWidth = node.style.labelOptions.width === "fit" ? getParagraphFitWidth(node.pathData.path) : node.style.labelOptions.width;
            paragraph.layout(paragraphWidth);
            const paragraphBounds = getParagraphBounds(paragraph, node.pathData.path);
            canvas.drawParagraph(paragraph, paragraphBounds.x, paragraphBounds.y);

            canvas.restore();

            disposables.forEach(disposable => disposable.delete());
        };

        addons.push(drawFrame);

        skiaContext.nodes.push(node);

        return node;
    }

    function addDisposable(fn: () => any, disposables: any[]) {
        const disposable = fn();
        disposables.push(disposable);
        return disposable;
    }

    function getParagraphStyle(labelOptions: RequiredLabelOptions) {
        return new CanvasKit.ParagraphStyle({
            textStyle: {
                color: CanvasKit.BLACK,
                fontFamilies: [labelOptions.fontName],
                fontSize: labelOptions.fontSize,
            },
            textAlign: toSkiaTextAlign(labelOptions.textAlign),
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
        addFont,
        createNode
    };
}