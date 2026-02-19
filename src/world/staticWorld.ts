import { useMouse } from "./mouse";

export function useStaticWorld(skiaContext: any) {
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