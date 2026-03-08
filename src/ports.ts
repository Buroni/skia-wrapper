import { isCanvasPathNode, type CanvasPathNode } from "./types/CanvasNode";
import type { SkiaContext } from "./types/context/SkiaContext";
import type { Point } from "./types/Point";
import type { Port } from "./types/Port";

export function usePorts(skiaContext: SkiaContext) {
    function createCentralPort(owner: CanvasPathNode): Port {
        return {
            location: { x: 0.5, y: 0.5 },
            owner
        };
    }

    return {
        createCentralPort
    };
}

/**
 * Given a port, converts its location ratio to relative coordinates.
 * For example, [0.5, 0.5] becomes [50, 50] for a 100x100 node.
 */
export function getRelativePortLocation(port: Port): Point {
    const node = port.owner;
    const bounds = isCanvasPathNode(node) ? node.pathData.path.getBounds() : [0, 0, 0, 0];

    const adjustedPortLocation = getAdjustedPortLocation(port);

    const width = bounds[2] - bounds[0];
    const height = bounds[3] - bounds[1];

    return {
        x: width * adjustedPortLocation.x,
        y: height * adjustedPortLocation.y
    };
}

function getAdjustedPortLocation(port: Port) {
    const node = port.owner;
    if (!isCanvasPathNode(node)) {
        return port.location;
    }

    let portOffset: Point;
    switch (node.pathData.type) {
        case "circle":
            portOffset = { x: -0.5, y: -0.5 };
            break;
        default:
            portOffset = { x: 0, y: 0 };
    }

    return {
        x: port.location.x + portOffset.x,
        y: port.location.y + portOffset.y
    };
}