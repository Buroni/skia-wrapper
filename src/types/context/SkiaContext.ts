import { type Surface, type CanvasKit, type FontMgr } from "canvaskit-wasm";
import { type CanvasNode } from "../CanvasNode";

export type Addon = () => void;

export type DisplayOrderAddon = {
    entity: CanvasNode;
    addon: Addon;
};

export type Interactions = Record<string, { callerId: string | null }>;

export type SkiaContext = {
    canvasEl: HTMLCanvasElement;
    CanvasKit: CanvasKit;
    surface: Surface;
    addons: Addon[];
    displayOrderAddons: DisplayOrderAddon[];
    interactions: Interactions;
    mouse: {
        worldX: number;
        worldY: number
    };
    nodes: CanvasNode[];
    fonts: Record<string, FontMgr>;
    syncAddons: () => void;
}