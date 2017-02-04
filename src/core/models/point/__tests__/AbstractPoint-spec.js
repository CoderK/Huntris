import chai from 'chai';
import sinon from 'sinon';

import AbstractPoint from '../AbstractPoint';
import blockScheme from '../../../scheme/block-scheme';

chai.should();

describe('AbstractPoint >', () => {
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

    describe('블럭 위치 이동 >', () => {
        const originX = 4;
        const originY = 4;
        const ANY_SCHEME = blockScheme.I.relPoints;

        let abstractPoint;

        beforeEach(() => {
            abstractPoint = new AbstractPoint(originX, originY, ANY_SCHEME);
        });

        describe('하강 >', () => {
            it('블럭을 한 칸씩 하단으로 이동시킬 수 있다.', () => {
                // given
                // when
                abstractPoint.down(emptyBoard);
                abstractPoint.down(emptyBoard);
                abstractPoint.down(emptyBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(originX);
                y.should.be.eql(originY + 3);
            });

            it('블럭을 보드의 밑바닥까지 한 칸씩 이동시킬 수 있다.', () => {
                // given
                const boardBottomY = emptyBoard.length - 1;
                abstractPoint.moveTo({ x: originX, y: boardBottomY - 2 });

                // when
                abstractPoint.down(emptyBoard);
                abstractPoint.down(emptyBoard);
                abstractPoint.down(emptyBoard);
                abstractPoint.down(emptyBoard);
                abstractPoint.down(emptyBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(originX);
                y.should.be.eql(boardBottomY);
            });

            it('하단에 이미 블럭이 있다면 이동 요청을 무시해야 한다.', () => {
                // given
                const blockedBoard = emptyBoard;
                blockedBoard[originY + 1][originX] = true;

                // when
                abstractPoint.down(blockedBoard);
                abstractPoint.down(blockedBoard);
                abstractPoint.down(blockedBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(originX);
                y.should.be.eql(originY);
            });

            it('블럭을 보드의 밑바닥까지 떨어뜨릴 수 있다.', () => {
                // given
                const boardBottomY = emptyBoard.length - 1;
                abstractPoint.moveTo({ x: originX, y: boardBottomY - 2 });

                // when
                abstractPoint.drop(emptyBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(originX);
                y.should.be.eql(boardBottomY);
            });

            it('블럭을 하단 장애물 위로 떨어뜨릴 수 있다.', () => {
                // given
                const blockedBoard = emptyBoard;
                blockedBoard[originY + 5][originX] = true;

                // when
                abstractPoint.drop(blockedBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(originX);
                y.should.be.eql(originY + 4);
            });
        });

        describe('블럭을 왼쪽으로 이동시킬 수 있다. >', () => {
            function findLeftEdgePoint(relPoints) {
                return relPoints.reduce((res, point) => {
                    if (res.x > point.x) {
                        return point;
                    }

                    return res;
                });
            }

            it('블럭을 왼쪽으로 한 칸씩 이동시킬 수 있다.', () => {
                // given
                // when
                abstractPoint.left(emptyBoard);
                abstractPoint.left(emptyBoard);
                abstractPoint.left(emptyBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(originX - 3);
                y.should.be.eql(originY);
            });

            it('블럭을 보드의 오른쪽 경계까지만 이동시킬 수 있다.', () => {
                // given
                const leftEdge = findLeftEdgePoint(abstractPoint.relPoints);
                const leftBorder = 0 + Math.abs(leftEdge.x);

                // when
                abstractPoint.left(emptyBoard);
                abstractPoint.left(emptyBoard);
                abstractPoint.left(emptyBoard);
                abstractPoint.left(emptyBoard);
                abstractPoint.left(emptyBoard);
                abstractPoint.left(emptyBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(leftBorder);
                y.should.be.eql(originY);
            });

            it('왼쪽에 이미 블럭이 있다면 이동 요청을 무시해야 한다.', () => {
                // given
                const leftEdge = findLeftEdgePoint(abstractPoint.relPoints);
                const nextOnLeft = originX - Math.abs(leftEdge.x) - 1;
                const blockedBoard = emptyBoard;
                blockedBoard[originY][nextOnLeft] = true;

                // when
                abstractPoint.left(blockedBoard);
                abstractPoint.left(blockedBoard);
                abstractPoint.left(blockedBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(originX);
                y.should.be.eql(originY);
            });
        });

        describe('블럭을 오른쪽으로 이동시킬 수 있다. >', () => {
            function findRightEdgePoint(relPoints) {
                return relPoints.reduce((res, point) => {
                    if (res.x < point.x) {
                        return point;
                    }

                    return res;
                });
            }

            it('블럭을 한 칸씩 오른쪽으로 이동시킬 수 있다.', () => {
                // given
                // when
                abstractPoint.right(emptyBoard);
                abstractPoint.right(emptyBoard);
                abstractPoint.right(emptyBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(originX + 3);
                y.should.be.eql(originY);
            });

            it('블럭을 보드의 오른쪽 경계까지만 이동시킬 수 있다.', () => {
                // given
                const rightEdge = findRightEdgePoint(abstractPoint.relPoints);
                const rightBorder = emptyBoard[0].length - 1 - Math.abs(rightEdge.x);

                // when
                abstractPoint.right(emptyBoard);
                abstractPoint.right(emptyBoard);
                abstractPoint.right(emptyBoard);
                abstractPoint.right(emptyBoard);
                abstractPoint.right(emptyBoard);
                abstractPoint.right(emptyBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(rightBorder);
                y.should.be.eql(originY);
            });

            it('오른쪽에 이미 블럭이 있다면 이동 요청을 무시해야 한다.', () => {
                // given
                const rightEdge = findRightEdgePoint(abstractPoint.relPoints);
                const nextOnRight = originX + Math.abs(rightEdge.x) + 1;
                const blockedBoard = emptyBoard;
                blockedBoard[originY][nextOnRight] = true;

                // when
                abstractPoint.right(blockedBoard);
                abstractPoint.right(blockedBoard);
                abstractPoint.right(blockedBoard);

                // then
                const { x, y } = abstractPoint;
                x.should.be.eql(originX);
                y.should.be.eql(originY);
            });
        });
    });
});
