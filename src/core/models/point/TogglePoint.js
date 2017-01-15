import {
    COUNTER_CLOCKWISE,
    CLOCKWISE
} from '../../../consts/rotate-type';
import AbstractRelPoint from './AbstractPoint';

class ToggleRelPoint extends AbstractRelPoint {
    constructor(x, y, relPoints) {
        super(x, y, relPoints);
        this.direction = COUNTER_CLOCKWISE;
    }

    rotate(blockTable) {
        const nextRelPoints = this._rotateRelPoints();

        if (this.shouldCancelRotate(blockTable, nextRelPoints)) {
            return;
        }

        this.relPoints = nextRelPoints;
        this._toggleDirect();
    }

    _rotateRelPoints() {
        if (this.direction === COUNTER_CLOCKWISE) {
            return this.rotateClockwise();
        }

        return this.rotateCounterClockwise();
    }

    _toggleDirect() {
        if (this.direction === CLOCKWISE) {
            this.direction = COUNTER_CLOCKWISE;
        } else {
            this.direction = CLOCKWISE;
        }
    }
}

export default ToggleRelPoint;
