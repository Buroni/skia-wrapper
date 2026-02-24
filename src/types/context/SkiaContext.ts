import { type Surface, type CanvasKit, type FontMgr } from "canvaskit-wasm";
import { type CanvasPathNode } from "../CanvasNode";
import type { CanvasEdge } from "../CanvasEdge";
import type { CanvasEntity } from "../CanvasEntity";

export type Addon = () => void;

export type DisplayOrderAddon = {
    entity: CanvasEntity;
    addon: Addon;
    isPreview?: boolean;
};

export type Interactions = Record<string, { callerId: string | null }>;

export type SkiaContext = {
    canvasEl: HTMLCanvasElement;
    CanvasKit: CanvasKit;
    surface: Surface;
    addons: Addon[];
    displayOrderAddons: WeakMap<CanvasEntity, () => void>;
    interactions: Interactions;
    mouse: {
        worldX: number;
        worldY: number
    };
    getNodes: () => CanvasPathNode[];
    getEdges: () => CanvasEdge[];
    entities: CanvasEntity[];
    numberEntities: number;
    fonts: Record<string, FontMgr>;
    syncAddons: () => void;
}