import { type Surface, type CanvasKit, type FontMgr } from "canvaskit-wasm";
import { type CanvasNode } from "../CanvasNode";

export type Addon = () => void;
export type Interactions = Record<string, { callerId: string | null }>;

export type SkiaContext = {
    canvasEl: HTMLCanvasElement,
    CanvasKit: CanvasKit,
    surface: Surface,
    addons: Addon[],
    interactions: Interactions,
    mouse: {
        worldX: number,
        worldY: number
    },
    nodes: CanvasNode[],
    fonts: Record<string, FontMgr>
}