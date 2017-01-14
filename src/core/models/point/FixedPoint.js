import AbstractPoint from './AbstractPoint';

class FixedPoint extends AbstractPoint {
    rotate() {
        return this.relPoints;
    }
}

export default FixedPoint;
