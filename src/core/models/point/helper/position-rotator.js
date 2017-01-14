function movePoint(points, deltaX, deltaY) {
    return points.map(point => ({
        x: point.y * deltaX === -0 ? 0 : point.y * deltaX,
        y: point.x * deltaY === -0 ? 0 : point.x * deltaY
    }));
}

function isCrossSideBorder(currentY, rows) {
    return currentY < 0 || currentY > rows - 1;
}

function isCrossUpDownBorder(currentX, cols) {
    return currentX < 0 || currentX > cols - 1;
}

function isOutside(blockTables, x, y) {
    const rows = blockTables.length;
    const cols = blockTables[0].length;
    return isCrossUpDownBorder(x, cols)
        || isCrossSideBorder(y, rows);
}

function hasBlock(blockTables, x, y) {
    return blockTables[y][x];
}

export function hasObstacle(blockTables, x, y, relPt) {
    const relX = relPt.x;
    const relY = relPt.y;
    const realX = x + relX;
    const realY = y + relY;

    return isOutside(blockTables, realX, realY)
        || hasBlock(blockTables, realX, realY);
}

export function rotateClockwise(points) {
    return movePoint(points, -1, 1);
}

export function rotateCounterClockwise(points) {
    return movePoint(points, 1, -1);
}

export default {
    rotateClockwise,
    rotateCounterClockwise,
    hasObstacle
};
