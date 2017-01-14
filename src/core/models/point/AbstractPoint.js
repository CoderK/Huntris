import {
    hasObstacle,
    rotateClockwise,
    rotateCounterClockwise
} from './helper/position-rotator';

class AbstractPoint {
    constructor(x, y, relPoints) {
        this.x = x;
        this.y = y;
        this.relPoints = relPoints;
    }

    /**
     * @abstract
     */
    rotate(blockTable) {
        /* eslint no-unused-vars: 0 */
    }

    shouldBlockRotate(blockTable, x, y, relPoints) {
        return relPoints.some(
            relPt => hasObstacle(blockTable, x, y, relPt)
        );
    }

    rotateClockwise() {
        return rotateClockwise(this.relPoints);
    }

    rotateCounterClockwise() {
        return rotateCounterClockwise(this.relPoints);
    }

    left(blockTables) {
        if (this._canMoveToLeft(blockTables)) {
            this.x = this.x - 1;
        }
    }

    right(blockTables) {
        if (this._canMoveToRight(blockTables)) {
            this.x = this.x + 1;
        }
    }

    down(blockTables) {
        const canMove = this._canMoveToDown(blockTables);
        if (canMove) {
            this.y = this.y + 1;
        }
        return canMove;
    }

    _canMove(predicate) {
        const isNoWay = this.relPoints.some(predicate);
        return isNoWay === false;
    }

    _canMoveToDown(blockTables) {
        const { x, y } = this;
        return this._canMove(
            relPt => hasObstacle(blockTables, x, y + 1, relPt)
        );
    }

    _canMoveToLeft(blockTables) {
        const { x, y } = this;
        return this._canMove(
            relPt => hasObstacle(blockTables, x - 1, y, relPt)
        );
    }

    _canMoveToRight(blockTables) {
        const { x, y } = this;
        return this._canMove(
            relPt => hasObstacle(blockTables, x + 1, y, relPt)
        );
    }
}

export default AbstractPoint;
