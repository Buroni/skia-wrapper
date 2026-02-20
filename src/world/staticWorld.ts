import { type SkiaContext } from "../types/context/SkiaContext";
import { useMouse } from "./mouse";

export function useStaticWorld(skiaContext: SkiaContext) {
    const mouseContext = useMouse(skiaContext);

    const { canvasEl } = skiaContext;

    setupEventListeners();

    function setupEventListeners() {
        canvasEl.addEventListener('mousemove', (e: MouseEvent) => {
            skiaContext.mouse.worldX = mouseContext.mouseX(e);
            skiaContext.mouse.worldY = mouseContext.mouseY(e);
        });
    }
}