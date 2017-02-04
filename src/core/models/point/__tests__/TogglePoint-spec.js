import chai from 'chai';
import sinon from 'sinon';

import TogglePoint from '../TogglePoint';
import blockScheme from '../../../scheme/block-scheme';
import { rotateClockwise } from '../../point/helper/point-rotator';

chai.should();

describe('TogglePoint >', () => {
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
        let togglePoint;
        let originRelPoints;

        beforeEach(() => {
            togglePoint = new TogglePoint(5, 5, blockScheme.I.relPoints);
            originRelPoints = togglePoint.relPoints;
        });

        describe('회전하려는 위치가 보드의 안 >', () => {
            it('회전을 시키면 90도 이동해야 한다.', () => {
                // given
                // when
                togglePoint.rotate(emptyBoard);

                // then
                const rotatedBy90 = rotateClockwise(originRelPoints);
                const { relPoints } = togglePoint;
                relPoints.should.be.eql(rotatedBy90);
            });

            it('회전을 시킨 블럭을 다시 회전시키면 이전 상태로 되돌려야 한다.', () => {
                // given
                togglePoint.rotate(emptyBoard);

                // when
                togglePoint.rotate(emptyBoard);

                // then
                const { relPoints } = togglePoint;
                relPoints.should.be.eql(originRelPoints);
            });
        });

        describe('회전하려는 위치가 보드의 밖이라면 >', () => {
            beforeEach(() => {
                togglePoint = new TogglePoint(5, 5, blockScheme.I.relPoints);
                // 최초 회전 시에는 x좌표가 화면 밖으로 나가지 않으므로
                togglePoint.rotate(emptyBoard);
                originRelPoints = togglePoint.relPoints;
            });

            it('회전하려는 위치가 좌측 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                // given
                togglePoint.moveTo({ x: 0, y: 5 });

                // when
                togglePoint.rotate(emptyBoard);

                // then
                const { relPoints } = togglePoint;
                relPoints.should.be.eql(originRelPoints);
            });

            it('회전하려는 위치가 우측 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                // given
                togglePoint.moveTo({ x: emptyBoard[0].length - 1, y: 5 });

                // when
                togglePoint.rotate(emptyBoard);

                // then
                const { relPoints } = togglePoint;
                relPoints.should.be.eql(originRelPoints);
            });

            it('회전하려는 위치가 하단 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                // given
                togglePoint.moveTo({ x: 0, y: emptyBoard.length - 1 });

                // when
                togglePoint.rotate(emptyBoard);

                // then
                const { relPoints } = togglePoint;
                relPoints.should.be.eql(originRelPoints);
            });
        });

        describe('회전하려는 위치에 이미 블럭이 있다면 >', () => {
            it('회전 요청을 무시해야 한다.', () => {
                // given
                const pointRotatedBy90 = rotateClockwise(originRelPoints);
                const blockedBoard = emptyBoard;

                pointRotatedBy90.forEach((relPoint) => {
                    blockedBoard[relPoint.y + togglePoint.y][relPoint.x + togglePoint.x] = true;
                });

                // when
                togglePoint.rotate(blockedBoard);

                // then
                const { relPoints } = togglePoint;
                relPoints.should.be.eql(originRelPoints);
            });
        });
    });
});
