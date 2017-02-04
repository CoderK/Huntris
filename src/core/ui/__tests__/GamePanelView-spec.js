import 'jsdom-global/register';
import chai from 'chai';
import sinon from 'sinon';

import BoardView from '../GamePanelView';
import Block from '../../models/Block';

import { SPACE, LEFT, UP, RIGHT, DOWN, PERIOD } from '../../../consts/keycode';
import { I } from '../../../consts/block-type';

chai.should();

describe('GamePanelView >', () => {
    let sandboxSinon;

    let canvas;
    let rowCount;
    let colCount;
    let unitSize;
    let boardView;

    beforeEach(() => {
        sandboxSinon = sinon.sandbox.create();

        rowCount = 15;
        colCount = 20;
        unitSize = 20;
        canvas = document.createElement('canvas');
        boardView = new BoardView({ canvas, rowCount, colCount, unitSize });
    });

    afterEach(() => {
        sandboxSinon.restore();
    });

    describe('패널 생성 >', () => {
        it('행과 열 갯수에 유닛 크기를 곱한 값으로 캔버스의 너비와 높이를 결정해야 한다.', () => {
            // given
            // when
            // then
            const { width, height } = boardView.canvas;
            width.should.be.eql(colCount * unitSize);
            height.should.be.eql(rowCount * unitSize);
        });

        it('패널을 생성하면 랜덤한 타입의 컨트롤 블럭을 생성해야 한다.', () => {
            // given
            const randomBlock = Block.createBlock(I);
            sandboxSinon.stub(Block, 'createRandomBlock', () => randomBlock);

            // when
            boardView = new BoardView({ canvas, rowCount, colCount, unitSize });

            // then
            boardView.controlBlock.should.be.eql(randomBlock);
        });
    });

    describe('블럭 하강 >', () => {
        describe('게임을 시작하면 >', () => {
            let clock;

            beforeEach(() => {
                clock = sandboxSinon.useFakeTimers();
                boardView.play();
            });

            it('틱이 지날 때마다 제어 블럭을 한 행씩 하강시켜야 한다.', () => {
                // given
                const { controlBlock, tickInterval } = boardView;
                const { x: beforeX, y: beforeY } = controlBlock.point;

                // when
                clock.tick(tickInterval);
                clock.tick(tickInterval);
                clock.tick(tickInterval);

                // then
                const { x: afterX, y: afterY } = controlBlock.point;
                afterX.should.be.eql(beforeX);
                afterY.should.be.eql(beforeY + 3);
            });

            it('매 틱마다 한 번씩 화면을 다시 그려야한다.', () => {
                // given
                const { tickInterval } = boardView;
                const spyRender = sandboxSinon.spy(boardView, '_render');

                // when
                clock.tick(tickInterval);
                clock.tick(tickInterval);
                clock.tick(tickInterval);

                // then
                spyRender.calledThrice.should.be.true;
            });

            describe('블럭을 더이상 하강시킬 수 없다면 >', () => {
                it('현재의 컨트를 블럭을 보드에 추가하여야 한다.', () => {
                    // given
                    const { controlBlock, board, tickInterval } = boardView;

                    sandboxSinon.spy(board, 'putBlock');
                    sandboxSinon.stub(controlBlock, 'down', () => false);

                    // when
                    clock.tick(tickInterval);

                    // then
                    board.putBlock.calledOnce.should.be.true;
                });

                it('새로운 블럭을 생성하여 컨트롤 블럭으로 지정해야 한다.', () => {
                    // given
                    const { controlBlock, board, tickInterval } = boardView;
                    const expectedControlBlock = Block.createBlock(I);

                    sandboxSinon.spy(board, 'putBlock');
                    sandboxSinon.stub(controlBlock, 'down', () => false);
                    sandboxSinon.stub(Block, 'createRandomBlock', () => expectedControlBlock);

                    // when
                    clock.tick(tickInterval);

                    // then
                    const afterControlBlock = boardView.controlBlock;
                    afterControlBlock.should.be.eql(expectedControlBlock);
                });
            });
        });
    });

    describe('키 이벤트 처리 >', () => {
        describe('스페이스바를 입력해서', () => {
            it('블럭을 보드 바닥으로 하강시킬 수 있다.', () => {
                // given
                const { controlBlock } = boardView;

                sandboxSinon.stub(controlBlock, 'drop');

                // when
                boardView._actionByKeyCode(SPACE);

                // then
                controlBlock.drop.calledOnce.should.be.true;
            });

            it('블럭을 하강시킨 후에는 다음 블럭으로 제어권을 넘겨야 한다.', () => {
                // given
                const spyForNext = sandboxSinon.spy(boardView, '_changeToNextBlock');

                // when
                boardView._actionByKeyCode(SPACE);

                // then
                spyForNext.calledOnce.should.be.true;
            });
        });

        it('왼쪽 화살표를 입력해서 블럭을 왼쪽으로 이동시킬 수 있다.', () => {
            // given
            const { controlBlock } = boardView;

            sandboxSinon.stub(controlBlock, 'left');

            // when
            boardView._actionByKeyCode(LEFT);

            // then
            controlBlock.left.calledOnce.should.be.true;
        });

        it('위쪽 화살표를 입력해서 블럭을 회전시킬 수 있다.', () => {
            // given
            const { controlBlock } = boardView;

            sandboxSinon.stub(controlBlock, 'rotate');

            // when
            boardView._actionByKeyCode(UP);

            // then
            controlBlock.rotate.calledOnce.should.be.true;
        });

        it('오른쪽 화살표를 입력해서 블럭을 우측으로 이동시킬 수 있다.', () => {
            // given
            const { controlBlock } = boardView;

            sandboxSinon.stub(controlBlock, 'right');

            // when
            boardView._actionByKeyCode(RIGHT);

            // then
            controlBlock.right.calledOnce.should.be.true;
        });

        it('아래 화살표를 입력해서 블럭을 한 행 아래로 하강시킬 수 있다.', () => {
            // given
            const { controlBlock } = boardView;

            sandboxSinon.stub(controlBlock, 'down');

            // when
            boardView._actionByKeyCode(DOWN);

            // then
            controlBlock.down.calledOnce.should.be.true;
        });

        it('.을 입력해서 게임 속도를 100ms 빠르게 변경할 수 있다.', () => {
            // given
            const { tickInterval: beforeInterval } = boardView;
            const expectedInterval = beforeInterval - 100;
            const clock = sandboxSinon.useFakeTimers();
            const spyForPlaying = sandboxSinon.spy(boardView, '_dropControlBlockDown');

            boardView.play();

            // when
            boardView._actionByKeyCode(PERIOD);
            clock.tick(expectedInterval);
            clock.tick(expectedInterval);
            clock.tick(expectedInterval);

            // then
            spyForPlaying.calledThrice.should.be.true;
        });

        it('제어블럭을 이동시킬 때마다 화면을 다시 렌더링 해야 한다.', () => {
            // given
            sandboxSinon.spy(boardView, '_render');

            // when
            boardView._actionByKeyCode(SPACE);
            boardView._actionByKeyCode(LEFT);
            boardView._actionByKeyCode(UP);
            boardView._actionByKeyCode(RIGHT);
            boardView._actionByKeyCode(DOWN);

            // then
            boardView._render.callCount.should.be.eql(5);
        });
    });
});
