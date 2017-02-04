import chai from 'chai';
import sinon from 'sinon';

import ClockwisePoint from '../ClockwisePoint';
import blockScheme from '../../../scheme/block-scheme';
import { rotateClockwise } from '../../point/helper/point-rotator';

chai.should();

describe('ClockwisePoint >', () => {
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
        let clockwisePoint;
        let originRelPoints;

        beforeEach(() => {
            clockwisePoint = new ClockwisePoint(5, 5, blockScheme.Z.relPoints);
            originRelPoints = clockwisePoint.relPoints;
        });

        describe('회전하려는 위치가 보드의 안이라면 >', () => {
            it('블럭을 90도 회전시킬 수 있다.', () => {
                // given
                const rotatedBy90 = rotateClockwise(originRelPoints);

                // when
                clockwisePoint.rotate(emptyBoard);

                // then
                const { relPoints } = clockwisePoint;
                relPoints.should.be.eql(rotatedBy90);
            });

            it('블럭을 180도 회전시킬 수 있다..', () => {
                // given
                const rotatedBy90 = rotateClockwise(originRelPoints);
                const rotatedBy180 = rotateClockwise(rotatedBy90);

                // when
                clockwisePoint.rotate(emptyBoard);
                clockwisePoint.rotate(emptyBoard);

                // then
                const { relPoints } = clockwisePoint;
                relPoints.should.be.eql(rotatedBy180);
            });

            it('블럭을 270도 회전시킬 수 있다..', () => {
                // given
                const rotatedBy90 = rotateClockwise(originRelPoints);
                const rotatedBy180 = rotateClockwise(rotatedBy90);
                const rotatedBy270 = rotateClockwise(rotatedBy180);

                // when
                clockwisePoint.rotate(emptyBoard);
                clockwisePoint.rotate(emptyBoard);
                clockwisePoint.rotate(emptyBoard);

                // then
                const { relPoints } = clockwisePoint;
                relPoints.should.be.eql(rotatedBy270);
            });

            it('블럭을 360도 회전시킬 수 있다..', () => {
                // given

                // when
                clockwisePoint.rotate(emptyBoard);
                clockwisePoint.rotate(emptyBoard);
                clockwisePoint.rotate(emptyBoard);
                clockwisePoint.rotate(emptyBoard);

                // then
                const { relPoints } = clockwisePoint;
                relPoints.should.be.eql(originRelPoints);
            });
        });

        describe('회전하려는 위치가 보드의 밖이라면 >', () => {
            beforeEach(() => {
                clockwisePoint = new ClockwisePoint(5, 5, blockScheme.Z.relPoints);
                // 최초 회전 시에는 x좌표가 화면 밖으로 나가지 않으므로, 한 번 회전시키고 테스트
                clockwisePoint.rotate(emptyBoard);
                originRelPoints = clockwisePoint.relPoints;
            });

            it('회전하려는 위치가 좌측 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                // given
                clockwisePoint.moveTo({ x: 0, y: 5 });

                // when
                clockwisePoint.rotate(emptyBoard);

                // then
                const { relPoints } = clockwisePoint;
                relPoints.should.be.eql(originRelPoints);
            });

            it('회전하려는 위치가 우측 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                // given
                clockwisePoint.moveTo({ x: emptyBoard[0].length - 1, y: 5 });

                // when
                clockwisePoint.rotate(emptyBoard);

                // then
                const { relPoints } = clockwisePoint;
                relPoints.should.be.eql(originRelPoints);
            });

            it('회전하려는 위치가 하단 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                // given
                clockwisePoint.moveTo({ x: 0, y: emptyBoard.length - 1 });

                // when
                clockwisePoint.rotate(emptyBoard);

                // then
                const { relPoints } = clockwisePoint;
                relPoints.should.be.eql(originRelPoints);
            });
        });

        describe('회전하려는 위치에 이미 블럭이 있다면 >', () => {
            it('회전 요청을 무시해야 한다.', () => {
                // given
                const pointRotatedBy90 = rotateClockwise(originRelPoints);
                const { x, y } = clockwisePoint;
                const blockedBoard = emptyBoard;

                pointRotatedBy90.forEach((relPoint) => {
                    blockedBoard[relPoint.y + y][relPoint.x + x] = true;
                });

                // when
                clockwisePoint.rotate(blockedBoard);

                // then
                const { relPoints } = clockwisePoint;
                relPoints.should.be.eql(originRelPoints);
            });
        });
    });
});
