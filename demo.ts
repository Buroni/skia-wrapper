import { useSkia } from "./src/skia.ts";
import { usePanZoomWorld } from "./src/world/panZoomWorld.ts";
import { useNodes } from "./src/nodes.ts";
import { useEdges } from "./src/edges.ts";
import { useEventListeners } from "./src/eventListeners.ts";
import { useDragDrop } from "./src/dragDrop.ts";
import { useNodePaths } from "./src/nodePaths.ts";
import { useFonts } from "./src/fonts.ts";
import { useDisplayOrder } from "./src/displayOrder";
import { setStrokeWidth, setStrokeColor } from "./src/style";
import type { CanvasPathNode } from "./src/types/CanvasNode.ts";

(async () => {
    const skiaContext = await useSkia("#canvas");
    const nodeContext = useNodes(skiaContext);
    const edgeContext = useEdges(skiaContext);
    const listenerContext = useEventListeners(skiaContext);
    const { toBack } = useDisplayOrder(skiaContext);

    const fontsContext = await useFonts(skiaContext);
    await fontsContext.addFont("Roboto", "https://cdn.skia.org/misc/Roboto-Regular.ttf");

    usePanZoomWorld(skiaContext);
    const { isLastPointerMoveDrag } = useDragDrop(skiaContext);
    const { circle } = useNodePaths(skiaContext);

    listenerContext.addHitItemListener(
        "mousemove",
        skiaContext.nodes,
        (e, frontNode, hitNodes) => {
            skiaContext.canvasEl.style.cursor = hitNodes.length ? "pointer" : "default";

            if (frontNode) {
                setStrokeWidth(frontNode, 6);
            }

            for (const node of skiaContext.nodes) {
                if (node === frontNode) {
                    continue;
                }
                setStrokeWidth(node, 4);
            }
        }
    );


    const pendingEdge: { sourceNode: CanvasPathNode | null, targetNode: CanvasPathNode | null } = { sourceNode: null, targetNode: null };

    listenerContext.addHitItemListener(
        "pointerup",
        skiaContext.nodes,
        (e, frontNode) => {
            if (!frontNode) {
                skiaContext.clearPreviews();
                if (pendingEdge.sourceNode) {
                    setStrokeColor(pendingEdge.sourceNode, [0, 0, 0, 1]);
                    pendingEdge.sourceNode = null;
                }
                if (pendingEdge.targetNode) {
                    setStrokeColor(pendingEdge.targetNode, [0, 0, 0, 1]);
                    pendingEdge.targetNode = null;
                }
                return;
            }

            if (!pendingEdge.sourceNode && !isLastPointerMoveDrag()) {
                setStrokeColor(frontNode, [1, 0, 0, 1]);
                pendingEdge.sourceNode = frontNode;
                const previewEdge = edgeContext.createPreviewEdge(pendingEdge.sourceNode, { edgeStyle: { stroke: { color: [0, 0, 0, 0.5] } } });
                toBack(previewEdge);
            } else if (!pendingEdge.targetNode && !isLastPointerMoveDrag()) {
                setStrokeColor(frontNode, [1, 0, 0, 1]);
                pendingEdge.targetNode = frontNode;
            }

            if (pendingEdge.sourceNode && pendingEdge.targetNode) {
                skiaContext.clearPreviews();

                const edge = edgeContext.createEdge(pendingEdge.sourceNode, pendingEdge.targetNode);

                setStrokeColor(edge.sourceNode, [0, 0, 0, 1]);
                setStrokeColor(edge.targetNode, [0, 0, 0, 1]);
                toBack(edge);

                pendingEdge.sourceNode = null;
                pendingEdge.targetNode = null;
            }
        }
    );

    skiaContext.canvasEl.addEventListener("dblclick", () => {
        nodeContext.createNode(
            circle(skiaContext.mouse.worldX, skiaContext.mouse.worldY, 50),
            { labelOptions: { text: `${skiaContext.nodes.length}`, fontName: "Roboto", fontSize: 24 } }
        );
    });
})();