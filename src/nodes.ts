import { type LabelOptions } from "./types/LabelOptions";
import { type CanvasNode, type CanvasNodePathData } from "./types/CanvasNode";
import { type CanvasNodeStyle } from "./types/CanvasNodeStyle";
import { type Path, type Paragraph, type TextAlign, type FontMgr, type ParagraphStyle } from "canvaskit-wasm"
import type { ParagraphBounds } from "./types/ParagraphBounds";
import { type SkiaContext } from "./types/context/SkiaContext";
import { type NodeContext } from "./types/context/NodeContext";
import { useNodePaint } from "./nodePaint";

const DEFAULT_LABEL_OPTIONS = {
    fontSize: 24,
    width: "fit",
    textAlign: "center"
};

export function useNodes(skiaContext: SkiaContext): NodeContext {
    const nodePaintContext = useNodePaint(skiaContext);

    const { surface, CanvasKit, addons } = skiaContext;

    const canvas = surface.getCanvas();

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

    function createNode(pathData: CanvasNodePathData, options: { nodeStyle?: CanvasNodeStyle, labelOptions?: LabelOptions } = {}): CanvasNode {
        const nodeStyle = getDefaultNodeStyle(options.nodeStyle);
        const labelOptions = getDefaultLabelOptions(options.labelOptions);

        const node: CanvasNode = {
            pathData,
            style: nodeStyle,
            labelOptions
        };

        let paragraphStyle: ParagraphStyle | undefined;
        if (node.labelOptions) {
            paragraphStyle = getParagraphStyle(node.labelOptions);
        }

        const drawFrame = makeDrawFrame(node, paragraphStyle);

        addons.push(drawFrame);

        skiaContext.nodes.push(node);

        return node;
    }

    function makeDrawFrame(node: CanvasNode, paragraphStyle?: ParagraphStyle): () => void {
        return () => {
            const disposables: any[] = [];

            canvas.save();
            canvas.translate(node.pathData.cx, node.pathData.cy);

            if (node.style.strokeStyle) {
                const { strokeStyle } = node.style;
                const strokePaint = addDisposable(() => nodePaintContext.setStroke(strokeStyle), disposables);
                canvas.drawPath(node.pathData.path, strokePaint);
            }

            if (node.style.fillStyle) {
                const { fillStyle } = node.style;
                const fillPaint = addDisposable(() => nodePaintContext.setFill(fillStyle), disposables);
                canvas.drawPath(node.pathData.path, fillPaint);
            }

            if (paragraphStyle) {
                drawLabel(node, paragraphStyle, disposables);
            }

            canvas.restore();

            disposables.forEach(disposable => disposable.delete());
        }
    }

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

    function getDefaultNodeStyle(nodeStyle: CanvasNodeStyle | undefined): CanvasNodeStyle {
        if (!nodeStyle) {
            nodeStyle = {};
        }

        if (!nodeStyle.strokeStyle) {
            nodeStyle.strokeStyle = {};
        }

        if (!nodeStyle.fillStyle) {
            nodeStyle.fillStyle = {};
        }

        return nodeStyle;
    }

    function getDefaultLabelOptions(labelOptions: LabelOptions | undefined): LabelOptions | undefined {
        if (!labelOptions) {
            return undefined;
        }

        if (!labelOptions.width) {
            labelOptions.width = "fit";
        }

        if (!labelOptions.fontSize) {
            labelOptions.fontSize = 24;
        }

        return labelOptions;
    }

    function addDisposable(fn: () => any, disposables: any[]) {
        const disposable = fn();
        disposables.push(disposable);
        return disposable;
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
        addFont,
        createNode
    };
}