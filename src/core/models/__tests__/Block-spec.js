import chai from 'chai';
import sinon from 'sinon';

import blockScheme from '../../scheme/block-scheme';
import Block from '../Block';
import { I, L, S, O, J, Z, T } from '../../../consts/block-type';
import { rotateClockwise } from '../point/helper/point-rotator';

chai.should();

/**
 * 블럭을 왼쪽으로 한 칸 옮길 수 있다.
 * 블럭을 우측으로 한 칸 옮길 수 있다.
 * 블럭을 특정 좌표로 옮길 수 있다.
 */
describe('Block', () => {
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

    describe('블럭 생성 >', () => {
        it('원하는 타입의 블럭을 만들 수 있다.', () => {
            Block.createBlock(I).props.should.be.eql(blockScheme.I);
            Block.createBlock(L).props.should.be.eql(blockScheme.L);
            Block.createBlock(S).props.should.be.eql(blockScheme.S);
            Block.createBlock(O).props.should.be.eql(blockScheme.O);
            Block.createBlock(J).props.should.be.eql(blockScheme.J);
            Block.createBlock(Z).props.should.be.eql(blockScheme.Z);
            Block.createBlock(T).props.should.be.eql(blockScheme.T);
        });

        it('임의의 블럭을 만들 수 있다.', () => {
            // given
            const randomNumber = 0.1;
            sandboxSinon.stub(Math, 'random', () => randomNumber);

            // when
            const randomBlock = Block.createRandomBlock();

            // given
            randomBlock.props.should.be.eql(blockScheme.I);
        });
    });

    describe('블럭 회전 >', () => {
        describe('토글 블럭 >', () => {
            let toggleBlock;
            let originRelPoints;

            beforeEach(() => {
                toggleBlock = Block.createBlock(I);
                toggleBlock.moveTo({ x: 5, y: 5 });

                originRelPoints = toggleBlock.point.relPoints;
            });

            describe('회전하려는 위치가 보드의 안 >', () => {
                it('회전을 시키면 90도 이동해야 한다.', () => {
                    // given
                    // when
                    toggleBlock.rotate(emptyBoard);

                    // given
                    const rotatedBy90 = rotateClockwise(originRelPoints);
                    const { relPoints } = toggleBlock.point;
                    relPoints.should.be.eql(rotatedBy90);
                });

                it('회전을 시킨 블럭을 다시 회전시키면 이전 상태로 되돌려야 한다.', () => {
                    // given
                    toggleBlock.rotate(emptyBoard);

                    // when
                    toggleBlock.rotate(emptyBoard);

                    // given
                    const { relPoints } = toggleBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });
            });

            describe('회전하려는 위치가 보드의 밖이라면 >', () => {
                beforeEach(() => {
                    toggleBlock = Block.createBlock(I);
                    toggleBlock.moveTo({ x: 5, y: 5 });
                    // 최초 회전 시에는 x좌표가 화면 밖으로 나가지 않으므로
                    toggleBlock.rotate(emptyBoard);

                    originRelPoints = toggleBlock.point.relPoints;
                });

                it('회전하려는 위치가 좌측 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                    // given
                    toggleBlock.moveTo({ x: 0, y: 5 });

                    // when
                    toggleBlock.rotate(emptyBoard);

                    // given
                    const { relPoints } = toggleBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });

                it('회전하려는 위치가 우측 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                    // given
                    toggleBlock.moveTo({ x: emptyBoard[0].length - 1, y: 5 });

                    // when
                    toggleBlock.rotate(emptyBoard);

                    // given
                    const { relPoints } = toggleBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });

                it('회전하려는 위치가 하단 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                    // given
                    toggleBlock.moveTo({ x: 0, y: emptyBoard.length - 1 });

                    // when
                    toggleBlock.rotate(emptyBoard);

                    // given
                    const { relPoints } = toggleBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });
            });

            describe('회전하려는 위치에 이미 블럭이 있다면 >', () => {
                it('회전 요청을 무시해야 한다.', () => {
                    // given
                    const pointRotatedBy90 = rotateClockwise(originRelPoints);
                    const point = toggleBlock.point;
                    const blockedBoard = emptyBoard;

                    pointRotatedBy90.forEach((relPoint) => {
                        blockedBoard[relPoint.y + point.y][relPoint.x + point.x] = true;
                    });

                    // when
                    toggleBlock.rotate(blockedBoard);

                    // given
                    const { relPoints } = toggleBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });
            });
        });

        describe('시계 방향 블럭 >', () => {
            let clockwiseBlock;
            let originRelPoints;

            beforeEach(() => {
                clockwiseBlock = Block.createBlock(Z);
                clockwiseBlock.moveTo({ x: 5, y: 5 });

                originRelPoints = clockwiseBlock.point.relPoints;
            });

            describe('회전하려는 위치가 보드의 안이라면 >', () => {
                it('한 번 회전을 하면 90도를 이동해야 한다.', () => {
                    // given
                    // when
                    clockwiseBlock.rotate(emptyBoard);

                    // given
                    const rotatedBy90 = rotateClockwise(originRelPoints);
                    const { relPoints } = clockwiseBlock.point;
                    relPoints.should.be.eql(rotatedBy90);
                });

                it('한 번 회전한 블럭이 다시 한 번 회전하면 이전 상태로 되돌아가야 한다.', () => {
                    // given
                    clockwiseBlock.rotate(emptyBoard);

                    // when
                    clockwiseBlock.rotate(emptyBoard);

                    // given
                    const { relPoints } = clockwiseBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });
            });

            describe('회전하려는 위치가 보드의 밖이라면 >', () => {
                beforeEach(() => {
                    clockwiseBlock = Block.createBlock(I);
                    clockwiseBlock.moveTo({ x: 5, y: 5 });
                    // 최초 회전 시에는 x좌표가 화면 밖으로 나가지 않으므로, 한 번 회전시키고 테스트
                    clockwiseBlock.rotate(emptyBoard);

                    originRelPoints = clockwiseBlock.point.relPoints;
                });

                it('회전하려는 위치가 좌측 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                    // given
                    clockwiseBlock.moveTo({ x: 0, y: 5 });

                    // when
                    clockwiseBlock.rotate(emptyBoard);

                    // given
                    const { relPoints } = clockwiseBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });

                it('회전하려는 위치가 우측 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                    // given
                    clockwiseBlock.moveTo({ x: emptyBoard[0].length - 1, y: 5 });

                    // when
                    clockwiseBlock.rotate(emptyBoard);

                    // given
                    const { relPoints } = clockwiseBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });

                it('회전하려는 위치가 하단 경계 밖이라면 회전 요청을 무시해야 한다.', () => {
                    // given
                    clockwiseBlock.moveTo({ x: 0, y: emptyBoard.length - 1 });

                    // when
                    clockwiseBlock.rotate(emptyBoard);

                    // given
                    const { relPoints } = clockwiseBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });
            });

            describe('회전하려는 위치에 이미 블럭이 있다면 >', () => {
                it('회전 요청을 무시해야 한다.', () => {
                    // given
                    const pointRotatedBy90 = rotateClockwise(originRelPoints);
                    const point = clockwiseBlock.point;
                    const blockedBoard = emptyBoard;

                    pointRotatedBy90.forEach((relPoint) => {
                        blockedBoard[relPoint.y + point.y][relPoint.x + point.x] = true;
                    });

                    // when
                    clockwiseBlock.rotate(blockedBoard);

                    // given
                    const { relPoints } = clockwiseBlock.point;
                    relPoints.should.be.eql(originRelPoints);
                });
            });
        });

        describe('고정 블럭 >', () => {
            let fixedBlock;
            let originRelPoints;

            beforeEach(() => {
                fixedBlock = Block.createBlock(O);
                originRelPoints = fixedBlock.point.relPoints;

                fixedBlock.moveTo({ x: 5, y: 5 });
            });

            it('여러 번 회전을 시켜도 현재 위치를 유지해야 한다.', () => {
                // given
                // when
                fixedBlock.rotate(emptyBoard);
                fixedBlock.rotate(emptyBoard);
                fixedBlock.rotate(emptyBoard);

                // given
                const { relPoints } = fixedBlock.point;
                relPoints.should.be.eql(originRelPoints);
            });
        });
    });

    describe('블럭 위치 이동 >', () => {
        const ANY = 0;
        const originX = 4;
        const originY = 4;

        let block;

        beforeEach(() => {
            block = Block.createBlock(ANY);
            block.moveTo({ x: originX, y: originY });
        });

        describe('블럭을 하단으로 이동시킬 수 있다. >', () => {
            it('블럭을 한 칸씩 하단으로 이동시킬 수 있다.', () => {
                // given
                // when
                block.down(emptyBoard);
                block.down(emptyBoard);
                block.down(emptyBoard);

                // then
                const { x, y } = block.point;
                x.should.be.eql(originX);
                y.should.be.eql(originY + 3);
            });

            it('블럭을 보드의 밑바닥까지 한 칸씩 이동시킬 수 있다.', () => {
                // given
                const boardBottomY = emptyBoard.length - 1;
                block.moveTo({ x: originX, y: boardBottomY - 2 });

                // when
                block.down(emptyBoard);
                block.down(emptyBoard);
                block.down(emptyBoard);
                block.down(emptyBoard);
                block.down(emptyBoard);

                // then
                const { x, y } = block.point;
                x.should.be.eql(originX);
                y.should.be.eql(boardBottomY);
            });

            it('하단에 이미 블럭이 있다면 이동 요청을 무시해야 한다.', () => {
                // given
                const blockedBoard = emptyBoard;
                blockedBoard[originY + 1][originX] = true;

                // when
                block.down(blockedBoard);
                block.down(blockedBoard);
                block.down(blockedBoard);

                // then
                const { x, y } = block.point;
                x.should.be.eql(originX);
                y.should.be.eql(originY);
            });

            it('블럭을 보드의 밑바닥까지 떨어뜨릴 수 있다.', () => {
                // given
                const boardBottomY = emptyBoard.length - 1;
                block.moveTo({ x: originX, y: boardBottomY - 2 });

                // when
                block.drop(emptyBoard);

                // then
                const { x, y } = block.point;
                x.should.be.eql(originX);
                y.should.be.eql(boardBottomY);
            });

            it('블럭을 하단 장애물 위로 떨어뜨릴 수 있다.', () => {
                // given
                const blockedBoard = emptyBoard;
                blockedBoard[originY + 5][originX] = true;

                // when
                block.drop(blockedBoard);

                // then
                const { x, y } = block.point;
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
                block.left(emptyBoard);
                block.left(emptyBoard);
                block.left(emptyBoard);

                // then
                const { x, y } = block.point;
                x.should.be.eql(originX - 3);
                y.should.be.eql(originY);
            });

            it('블럭을 보드의 오른쪽 경계까지만 이동시킬 수 있다.', () => {
                // given
                const leftEdge = findLeftEdgePoint(block.props.relPoints);
                const leftBorder = 0 + Math.abs(leftEdge.x);

                // when
                block.left(emptyBoard);
                block.left(emptyBoard);
                block.left(emptyBoard);
                block.left(emptyBoard);
                block.left(emptyBoard);
                block.left(emptyBoard);

                // then
                const { x, y } = block.point;
                x.should.be.eql(leftBorder);
                y.should.be.eql(originY);
            });

            it('왼쪽에 이미 블럭이 있다면 이동 요청을 무시해야 한다.', () => {
                // given
                const leftEdge = findLeftEdgePoint(block.props.relPoints);
                const nextOnLeft = originX - Math.abs(leftEdge.x) - 1;
                const blockedBoard = emptyBoard;
                blockedBoard[originY][nextOnLeft] = true;

                // when
                block.left(blockedBoard);
                block.left(blockedBoard);
                block.left(blockedBoard);

                // then
                const { x, y } = block.point;
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
                block.right(emptyBoard);
                block.right(emptyBoard);
                block.right(emptyBoard);

                // then
                const { x, y } = block.point;
                x.should.be.eql(originX + 3);
                y.should.be.eql(originY);
            });

            it('블럭을 보드의 오른쪽 경계까지만 이동시킬 수 있다.', () => {
                // given
                const rightEdge = findRightEdgePoint(block.props.relPoints);
                const rightBorder = emptyBoard[0].length - 1 - Math.abs(rightEdge.x);

                // when
                block.right(emptyBoard);
                block.right(emptyBoard);
                block.right(emptyBoard);
                block.right(emptyBoard);
                block.right(emptyBoard);
                block.right(emptyBoard);

                // then
                const { x, y } = block.point;
                x.should.be.eql(rightBorder);
                y.should.be.eql(originY);
            });

            it('오른쪽에 이미 블럭이 있다면 이동 요청을 무시해야 한다.', () => {
                // given
                const rightEdge = findRightEdgePoint(block.props.relPoints);
                const nextOnRight = originX + Math.abs(rightEdge.x) + 1;
                const blockedBoard = emptyBoard;
                blockedBoard[originY][nextOnRight] = true;

                // when
                block.right(blockedBoard);
                block.right(blockedBoard);
                block.right(blockedBoard);

                // then
                const { x, y } = block.point;
                x.should.be.eql(originX);
                y.should.be.eql(originY);
            });
        });
    });
});
