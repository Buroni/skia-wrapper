import { useMouse } from "./mouse.js";

export function useStaticWorld(skiaContext) {
    const mouseContext = useMouse(skiaContext);

    const { canvasEl } = skiaContext;

    setupEventListeners();

    function setupEventListeners() {
        canvasEl.addEventListener('mousemove', (e) => {
            skiaContext.mouse.worldX = mouseContext.mouseX(e);
            skiaContext.mouse.worldY = mouseContext.mouseY(e);
        });
    }
}