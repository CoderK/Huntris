import AbstractPoint from './AbstractPoint';

class ClockwisePoint extends AbstractPoint {
    rotate(blockTable) {
        const nextRelPoints = this.rotateClockwise();
        if (this.shouldCancelRotate(blockTable, nextRelPoints)) {
            return;
        }

        this.relPoints = nextRelPoints;
    }
}

export default ClockwisePoint;
