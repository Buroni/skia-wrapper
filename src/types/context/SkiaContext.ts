import { type Surface, type CanvasKit, type FontMgr } from "canvaskit-wasm";
import { type CanvasPathNode } from "../CanvasNode";
import type { CanvasEdge } from "../CanvasEdge";
import type { CanvasEntity } from "../CanvasEntity";

export type Renderer = () => void;

export type DisplayOrderRenderer = {
    entity: CanvasEntity;
    renderer: Renderer;
    isPreview?: boolean;
};

export type Interactions = Record<string, { callerId: string | null }>;

export type SkiaContext = {
    canvasEl: HTMLCanvasElement;
    CanvasKit: CanvasKit;
    surface: Surface;
    renderers: Renderer[];
    interactions: Interactions;
    mouse: {
        worldX: number;
        worldY: number
    };
    addEntity: (entity: CanvasEntity, renderer: () => void) => void;
    getNodes: () => CanvasPathNode[];
    getEdges: () => CanvasEdge[];
    entities: CanvasEntity[];
    fonts: Record<string, FontMgr>;
    syncDisplayOrders: () => void;
}