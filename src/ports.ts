import { isCanvasPathNode, type CanvasPathNode } from "./types/CanvasNode";
import type { SkiaContext } from "./types/context/SkiaContext";
import type { Point } from "./types/Point";
import type { Port } from "./types/Port";
import { dist } from "./utils/utils";

export const PortLocations: Record<string, Point> = {
    CENTER: { x: 0.5, y: 0.5 },
    CENTER_LEFT: { x: 0, y: 0.5 },
    CENTER_BOTTOM: { x: 0.5, y: 1 },
    CENTER_RIGHT: { x: 1, y: 0.5 },
    CENTER_TOP: { x: 0.5, y: 0 }
};

export function usePorts(skiaContext: SkiaContext) {
    function getClosestPort(node: CanvasPathNode): Port {
        const { worldX, worldY } = skiaContext.mouse;
        const { translateX, translateY } = node.pathData;

        const worldPortLocations: { port: Port; location: Point }[] = [];

        for (const port of node.ports) {
            const relativePortLocation = getRelativePortLocation(port);
            worldPortLocations.push({ port, location: { x: translateX + relativePortLocation.x, y: translateY + relativePortLocation.y } })
        }

        const nearest = worldPortLocations.reduce((min, point) => {
            const distance = dist(point.location, { x: worldX, y: worldY });
            return distance < min.distance ? { port: point.port, distance } : min;
        }, { port: worldPortLocations[0].port, distance: Infinity });

        return nearest.port;
    }

    return {
        getClosestPort
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