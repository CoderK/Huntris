import EventEmitter from 'eventemitter3';
import PointFactory from './point/PointFactory';
import blockScheme from '../scheme/block-scheme';

class Block extends EventEmitter {
    static createBlock(typeNumber) {
        const blockCode = Object.keys(blockScheme)[typeNumber];
        const props = Object.assign({}, blockScheme[blockCode]);
        return new Block(props);
    }

    static createRandomBlock() {
        const randomType = parseInt(Math.random() * Object.keys(blockScheme).length, 10);
        return Block.createBlock(randomType);
    }

    constructor(props = {}) {
        super();
        this.props = props;
        this.type = props.type;
        this.color = props.color;
        this.point = PointFactory.createPoint(
            props.rotateType,
            props.point.x,
            props.point.y,
            props.relPoints
        );
    }

    rotate(blockTable) {
        this.point.rotate(blockTable);
        this._publishEvent();
    }

    down(blockTables) {
        const isMoved = this.point.down(blockTables);
        /*
         * NOTE:
         * 실제로 이동이 없어도 changed 이벤트를 발행하는데
         * 무시해도 충분한 결함이라 생각하여 특별한 조치를 하지 않음.
         */
        this._publishEvent();
        return isMoved;
    }

    drop(blockTables) {
        this.point.drop(blockTables);
        this._publishEvent();
    }

    left(blockTables) {
        this.point.left(blockTables);
        this._publishEvent();
    }

    right(blockTables) {
        this.point.right(blockTables);
        this._publishEvent();
    }

    moveTo({ x, y }) {
        this.point.x = x;
        this.point.y = y;
    }

    _publishEvent() {
        this.emit('changed');
    }
}

export default Block;
