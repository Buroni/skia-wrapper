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
import { isCanvasPathNode, type CanvasPathNode } from "./src/types/CanvasNode.ts";
import type { CanvasEdge } from "./src/types/CanvasEdge.ts";

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
    const { rect, circle } = useNodePaths(skiaContext);

    let pendingEdge: CanvasEdge | null = null;

    function onMouseMove(e: Event, frontNode: CanvasPathNode | null, hitNodes: CanvasPathNode[]): void {
        skiaContext.canvasEl.style.cursor = hitNodes.length ? "pointer" : "default";

        if (frontNode) {
            setStrokeWidth(frontNode, 6);
        }

        for (const node of skiaContext.getNodes()) {
            if (node === frontNode) {
                continue;
            }
            setStrokeWidth(node, 4);
        }
    }

    function onDblClick(): void {
        nodeContext.createNode(
            circle(skiaContext.mouse.worldX - 25, skiaContext.mouse.worldY - 25, 50, 50),
            { labelOptions: { text: `${skiaContext.getNodes().length}`, fontName: "Roboto", fontSize: 24 } }
        );
    }

    function onMouseUp(e: Event, frontNode: CanvasPathNode | null): void {
        // If clicking outside a node, clear pending edge
        if (!frontNode) {
            if (pendingEdge) {
                edgeContext.deleteEdge(pendingEdge);
                setStrokeColor(pendingEdge.sourcePort.owner, [0, 0, 0, 1]);
                setStrokeColor(pendingEdge.targetPort.owner, [0, 0, 0, 1]);
                pendingEdge = null;
            }
            return;
        }

        if (!isLastPointerMoveDrag()) {
            setStrokeColor(frontNode, [1, 0, 0, 1]);

            if (!pendingEdge) {
                pendingEdge = edgeContext.createPreviewEdge(frontNode);
                toBack(pendingEdge);
            } else {
                pendingEdge.targetPort.owner = frontNode;
            }
        }

        if (pendingEdge?.sourcePort && isCanvasPathNode(pendingEdge?.targetPort.owner)) {
            const edge = edgeContext.createEdge(pendingEdge.sourcePort, pendingEdge.targetPort);

            setStrokeColor(edge.sourcePort.owner, [0, 0, 0, 1]);
            setStrokeColor(edge.targetPort.owner, [0, 0, 0, 1]);
            toBack(edge);
        }
    }

    listenerContext.addHitItemListener(
        "mousemove",
        skiaContext.getNodes,
        onMouseMove
    );

    listenerContext.addHitItemListener(
        "pointerup",
        skiaContext.getNodes,
        onMouseUp
    );

    skiaContext.canvasEl.addEventListener("dblclick", onDblClick);
})();