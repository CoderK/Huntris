import { FIXED, CLOCKWISE } from '../../../consts/rotate-type';
import FixedPoint from './FixedPoint';
import ClockwisePoint from './ClockwisePoint';
import TogglePoint from './TogglePoint';

class PointFactory {
    static createPoint(rotateType, x, y, relPoints) {
        if (rotateType === FIXED) {
            return new FixedPoint(x, y, relPoints);
        } else if (rotateType === CLOCKWISE) {
            return new ClockwisePoint(x, y, relPoints);
        }

        return new TogglePoint(x, y, relPoints);
    }
}

export default PointFactory;
