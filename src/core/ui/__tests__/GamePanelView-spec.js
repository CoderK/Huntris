import 'jsdom-global/register';
import chai from 'chai';
import sinon from 'sinon';

import GamePanelView from '../GamePanelView';
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
    let gamePanelView;

    beforeEach(() => {
        sandboxSinon = sinon.sandbox.create();

        rowCount = 15;
        colCount = 20;
        unitSize = 20;
        canvas = document.createElement('canvas');
        gamePanelView = new GamePanelView({ canvas, rowCount, colCount, unitSize });
    });

    afterEach(() => {
        sandboxSinon.restore();
        document.body.innerHTML = '';
    });

    describe('패널 생성을 생성하면 >', () => {
        it('행과 열 갯수에 유닛 크기를 곱한 값으로 캔버스의 너비와 높이를 결정해야 한다.', () => {
            // given
            // when
            // then
            const { width, height } = gamePanelView.canvas;
            width.should.be.eql(colCount * unitSize);
            height.should.be.eql(rowCount * unitSize);
        });

        it('랜덤한 타입의 컨트롤 블럭을 생성해야 한다.', () => {
            // given
            const randomBlock = Block.createBlock(I);
            sandboxSinon.stub(Block, 'createRandomBlock', () => randomBlock);

            // when
            gamePanelView = new GamePanelView({ canvas, rowCount, colCount, unitSize });

            // then
            gamePanelView.controlBlock.should.be.eql(randomBlock);
        });
    });

    describe('게임을 시작하면 >', () => {
        let clock;

        beforeEach(() => {
            clock = sandboxSinon.useFakeTimers();
            gamePanelView.play();
        });

        it('틱이 지날 때마다 제어 블럭을 한 행씩 하강시켜야 한다.', () => {
            // given
            const { controlBlock, tickInterval } = gamePanelView;
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
            const { tickInterval } = gamePanelView;
            const spyRender = sandboxSinon.spy(gamePanelView, '_render');

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
                const { controlBlock, board, tickInterval } = gamePanelView;

                sandboxSinon.spy(board, 'putBlock');
                sandboxSinon.stub(controlBlock, 'down', () => false);

                // when
                clock.tick(tickInterval);

                // then
                board.putBlock.calledOnce.should.be.true;
            });

            it('새로운 블럭을 생성하여 컨트롤 블럭으로 지정해야 한다.', () => {
                // given
                const { controlBlock, board, tickInterval } = gamePanelView;
                const expectedControlBlock = Block.createBlock(I);

                sandboxSinon.spy(board, 'putBlock');
                sandboxSinon.stub(controlBlock, 'down', () => false);
                sandboxSinon.stub(Block, 'createRandomBlock', () => expectedControlBlock);

                // when
                clock.tick(tickInterval);

                // then
                const afterControlBlock = gamePanelView.controlBlock;
                afterControlBlock.should.be.eql(expectedControlBlock);
            });
        });

        describe('더이상 블럭을 추가할 수 없다면 >', () => {
            it('틱을 멈추고 게임을 종료시켜야 한다.', () => {
                // given
                gamePanelView = new GamePanelView({ canvas, rowCount, colCount, unitSize });

                sandboxSinon.stub(gamePanelView.board, 'isNonadditive', () => true);
                sandboxSinon.spy(gamePanelView, '_tick');

                gamePanelView.play();

                // when
                clock.tick(gamePanelView.tickInterval);
                clock.tick(gamePanelView.tickInterval);
                clock.tick(gamePanelView.tickInterval);

                // then
                gamePanelView._tick.callCount.should.be.eql(0);
            });

            it('게임을 종료시킨 후에는 Game Over라는 메시지를 띄워야 한다.', () => {
                // given
                gamePanelView = new GamePanelView({ canvas, rowCount, colCount, unitSize });
                sandboxSinon.stub(gamePanelView.board, 'isNonadditive', () => true);

                const spyMessage = sandboxSinon.spy(gamePanelView.messageBoxView, 'showWithMessage');

                // when
                gamePanelView.play();
                clock.tick(gamePanelView.tickInterval);

                // then
                spyMessage.calledWith('Game Over').should.be.true;
            });
        });
    });

    describe('키 이벤트 처리 >', () => {
        describe('스페이스바를 입력해서 >', () => {
            it('블럭을 보드 바닥으로 하강시킬 수 있다.', () => {
                // given
                const { controlBlock } = gamePanelView;

                sandboxSinon.stub(controlBlock, 'drop');

                // when
                gamePanelView._actionByKeyCode(SPACE);

                // then
                controlBlock.drop.calledOnce.should.be.true;
            });

            it('블럭을 하강시킨 후에는 다음 블럭으로 제어권을 넘겨야 한다.', () => {
                // given
                const spyForNext = sandboxSinon.spy(gamePanelView, '_changeToNextBlock');

                // when
                gamePanelView._actionByKeyCode(SPACE);

                // then
                spyForNext.calledOnce.should.be.true;
            });
        });

        it('왼쪽 화살표를 입력해서 블럭을 왼쪽으로 이동시킬 수 있다.', () => {
            // given
            const { controlBlock } = gamePanelView;

            sandboxSinon.stub(controlBlock, 'left');

            // when
            gamePanelView._actionByKeyCode(LEFT);

            // then
            controlBlock.left.calledOnce.should.be.true;
        });

        it('위쪽 화살표를 입력해서 블럭을 회전시킬 수 있다.', () => {
            // given
            const { controlBlock } = gamePanelView;

            sandboxSinon.stub(controlBlock, 'rotate');

            // when
            gamePanelView._actionByKeyCode(UP);

            // then
            controlBlock.rotate.calledOnce.should.be.true;
        });

        it('오른쪽 화살표를 입력해서 블럭을 우측으로 이동시킬 수 있다.', () => {
            // given
            const { controlBlock } = gamePanelView;

            sandboxSinon.stub(controlBlock, 'right');

            // when
            gamePanelView._actionByKeyCode(RIGHT);

            // then
            controlBlock.right.calledOnce.should.be.true;
        });

        it('아래 화살표를 입력해서 블럭을 한 행 아래로 하강시킬 수 있다.', () => {
            // given
            const { controlBlock } = gamePanelView;

            sandboxSinon.stub(controlBlock, 'down');

            // when
            gamePanelView._actionByKeyCode(DOWN);

            // then
            controlBlock.down.calledOnce.should.be.true;
        });

        it('.을 입력해서 게임 속도를 100ms 빠르게 변경할 수 있다.', () => {
            // given
            const { tickInterval: beforeInterval } = gamePanelView;
            const expectedInterval = beforeInterval - 100;
            const clock = sandboxSinon.useFakeTimers();
            const spyForPlaying = sandboxSinon.spy(gamePanelView, '_dropControlBlockDown');

            gamePanelView.play();

            // when
            gamePanelView._actionByKeyCode(PERIOD);
            clock.tick(expectedInterval);
            clock.tick(expectedInterval);
            clock.tick(expectedInterval);

            // then
            spyForPlaying.calledThrice.should.be.true;
        });

        it('제어블럭을 이동시킬 때마다 화면을 다시 렌더링 해야 한다.', () => {
            // given
            sandboxSinon.spy(gamePanelView, '_render');

            // when
            gamePanelView._actionByKeyCode(SPACE);
            gamePanelView._actionByKeyCode(LEFT);
            gamePanelView._actionByKeyCode(UP);
            gamePanelView._actionByKeyCode(RIGHT);
            gamePanelView._actionByKeyCode(DOWN);

            // then
            gamePanelView._render.callCount.should.be.eql(5);
        });
    });


    /**
     * TODO:
     * 스코어 처리
     * 다음 블럭 제공
     * 키 핸들러 분리?
     * 게임 진행을 담당하는 비지니스 로직을 Board에서 분리?
     */
});
