function movePoint(points, deltaX, deltaY) {
    return points.map(point => ({
        x: point.y * deltaX === -0 ? 0 : point.y * deltaX,
        y: point.x * deltaY === -0 ? 0 : point.x * deltaY
    }));
}

export function rotateClockwise(points) {
    return movePoint(points, -1, 1);
}

export function rotateCounterClockwise(points) {
    return movePoint(points, 1, -1);
}

export default {
    rotateClockwise,
    rotateCounterClockwise
};
