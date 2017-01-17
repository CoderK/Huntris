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

export default {
    hasObstacle
};
