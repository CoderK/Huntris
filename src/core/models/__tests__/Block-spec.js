import chai from 'chai';
import sinon from 'sinon';

import blockScheme from '../../scheme/block-scheme';
import Block from '../Block';
import { I, L, S, O, J, Z, T } from '../../../consts/block-type';

chai.should();

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

    it('블럭을 회전시킬 수 있다.', () => {
        // given
        const ANY = 0;
        const anyBlock = Block.createBlock(ANY);
        const spyForRotate = sandboxSinon.spy(anyBlock.point, 'rotate');

        // when
        anyBlock.rotate(emptyBoard);
        anyBlock.rotate(emptyBoard);
        anyBlock.rotate(emptyBoard);

        // given
        spyForRotate.calledThrice.should.be.rue;
    });

    describe('블럭 하강 >', () => {
        let anyBlock;

        beforeEach(() => {
            const ANY = 0;
            const originX = 4;
            const originY = 4;
            anyBlock = Block.createBlock(ANY);
            anyBlock.moveTo({ x: originX, y: originY });
        });

        it('블럭을 한 칸씩 하단으로 이동시킬 수 있다.', () => {
            // given
            const spyDown = sandboxSinon.spy(anyBlock.point, 'down');

            // when
            anyBlock.down(emptyBoard);
            anyBlock.down(emptyBoard);
            anyBlock.down(emptyBoard);

            // then
            spyDown.calledThrice.should.be.true;
        });

        it('블럭을 보드의 밑바닥까지 떨어뜨릴 수 있다.', () => {
            const spyDrop = sandboxSinon.spy(anyBlock.point, 'drop');

            // when
            anyBlock.drop(emptyBoard);
            anyBlock.drop(emptyBoard);
            anyBlock.drop(emptyBoard);

            // then
            spyDrop.calledThrice.should.be.true;
        });
    });

    describe('왼쪽 이동 >', () => {
        let anyBlock;

        beforeEach(() => {
            const ANY = 0;
            const originX = 4;
            const originY = 4;
            anyBlock = Block.createBlock(ANY);
            anyBlock.moveTo({ x: originX, y: originY });
        });

        it('블럭을 왼쪽으로 한 칸씩 이동시킬 수 있다.', () => {
            // given
            const spyLeft = sandboxSinon.spy(anyBlock.point, 'left');

            // when
            anyBlock.left(emptyBoard);
            anyBlock.left(emptyBoard);
            anyBlock.left(emptyBoard);

            // then
            spyLeft.calledThrice.should.be.true;
        });
    });

    describe('오른쪽 이동 >', () => {
        let anyBlock;

        beforeEach(() => {
            const ANY = 0;
            const originX = 4;
            const originY = 4;
            anyBlock = Block.createBlock(ANY);
            anyBlock.moveTo({ x: originX, y: originY });
        });

        it('블럭을 오른쪽으로 한 칸씩 이동시킬 수 있다.', () => {
            // given
            const spyRight = sandboxSinon.spy(anyBlock.point, 'right');

            // when
            anyBlock.right(emptyBoard);
            anyBlock.right(emptyBoard);
            anyBlock.right(emptyBoard);

            // then
            spyRight.calledThrice.should.be.true;
        });
    });
});
