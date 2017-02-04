import chai from 'chai';
import sinon from 'sinon';

import FixedPoint from '../FixedPoint';
import blockScheme from '../../../scheme/block-scheme';

chai.should();

describe('FixedPoint >', () => {
    let sandboxSinon;
    let emptyBoard;

    beforeEach(() => {
        sandboxSinon = sinon.sandbox.create();
        emptyBoard = [
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false],
            [false, false, false, false, false, false, false, false, false, false]
        ];
    });

    afterEach(() => {
        sandboxSinon.restore();
    });

    describe('회전 처리 >', () => {
        let fixedPoint;
        let originRelPoints;

        beforeEach(() => {
            fixedPoint = new FixedPoint(5, 5, blockScheme.O.relPoints);
            originRelPoints = fixedPoint.relPoints;
        });

        it('여러 번 회전을 시켜도 현재 위치를 유지해야 한다.', () => {
            // given
            // when
            fixedPoint.rotate(emptyBoard);
            fixedPoint.rotate(emptyBoard);
            fixedPoint.rotate(emptyBoard);

            // given
            const { relPoints } = fixedPoint;
            relPoints.should.be.eql(originRelPoints);
        });
    });
});
