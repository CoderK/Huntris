import { rotateClockwise, rotateCounterClockwise } from './helper/point-rotator';
import { hasObstacle } from './helper/point-refree';

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

    shouldCancelRotate(blockTable, relPoints) {
        const { x, y } = this;
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
            this._moveToLeft();
        }
    }

    right(blockTables) {
        if (this._canMoveToRight(blockTables)) {
            this._moveToRight();
        }
    }

    down(blockTables) {
        const canMove = this._canMoveDown(blockTables);
        if (canMove) {
            this._moveDown();
        }
        return canMove;
    }

    drop(blockTables) {
        while (this._canMoveDown(blockTables)) {
            this._moveDown();
        }
    }

    moveTo({ x, y }) {
        this.x = x;
        this.y = y;
    }

    _moveToRight() {
        this.x = this.x + 1;
    }

    _moveToLeft() {
        this.x = this.x - 1;
    }

    _moveDown() {
        this.y = this.y + 1;
    }

    _canMove(predicate) {
        const isNoWay = this.relPoints.some(predicate);
        return isNoWay === false;
    }

    _canMoveDown(blockTables) {
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
