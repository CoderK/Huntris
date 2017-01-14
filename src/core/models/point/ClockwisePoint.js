import AbstractPoint from './AbstractPoint';

class ClockwisePoint extends AbstractPoint {
    rotate(blockTable) {
        const rotatedRelPoints = this.rotateClockwise();
        if (this.shouldBlockRotate(blockTable, this.x, this.y, rotatedRelPoints)) {
            return;
        }

        this.relPoints = rotatedRelPoints;
    }
}

export default ClockwisePoint;
