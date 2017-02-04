import chai from 'chai';
import sinon from 'sinon';

import { I } from '../../../consts/block-type';
import Block from '../Block';
import Board from '../Board';

chai.should();

describe('Board > ', () => {
    let sandboxSinon;

    let rowCount;
    let colCount;
    let board;

    beforeEach(() => {
        sandboxSinon = sinon.sandbox.create();
    });

    afterEach(() => {
        sandboxSinon.restore();
    });

    function assertTrueIfBoardIsEmpty(targetBoard) {
        const empty = false;
        targetBoard.blockTable.forEach((rows) => {
            rows.forEach((col) => {
                col.should.be.eql(empty);
            });
        });
    }

    function assertTrueIfBoardHasBlock(targetBoard, block) {
        const { color, point } = block;
        const { relPoints, x, y } = point;
        const { blockTable } = targetBoard;

        relPoints.forEach((relPt) => {
            const hasBLock = blockTable[y + relPt.y][x + relPt.x];
            hasBLock.should.be.eql(color);
        });
    }

    function assertTrueIfRowIsClean(targetBoard, rowIndex) {
        const { blockTable } = targetBoard;
        const isClean = blockTable[rowIndex].every(col => col === false);

        isClean.should.be.true;
    }

    describe('보드 생성 >', () => {
        it('14 x 25 크기의 보드를 생성할 수 있다.', () => {
            // given
            rowCount = 14;
            colCount = 25;

            // when
            board = new Board({ rowCount, colCount });

            // then
            const actualRowCount = board.blockTable.length;
            const actualColCount = board.blockTable[0].length;
            rowCount.should.be.eql(actualRowCount);
            colCount.should.be.eql(actualColCount);
        });

        it('5 x 5 크기의 보드를 생성할 수 있다.', () => {
            // given
            rowCount = 5;
            colCount = 5;

            // when
            board = new Board({ rowCount, colCount });

            // then
            const actualRowCount = board.blockTable.length;
            const actualColCount = board.blockTable[0].length;
            rowCount.should.be.eql(actualRowCount);
            colCount.should.be.eql(actualColCount);
        });

        it('보드를 처음 생성하면 모든 블럭이 비어있어야 한다.', () => {
            // given
            rowCount = 5;
            colCount = 5;

            // when
            board = new Board({ rowCount, colCount });

            // then
            assertTrueIfBoardIsEmpty(board);
        });
    });

    describe('보드 청소 >', () => {
        beforeEach(() => {
            rowCount = 20;
            colCount = 20;
            board = new Board({ rowCount, colCount });
        });

        it('보드에 있는 모든 블럭을 제거할 수 있다.', () => {
            // given
            const block1 = Block.createBlock(I);
            const block2 = Block.createBlock(I);
            const block3 = Block.createBlock(I);

            block1.moveTo({ x: 5, y: 3 });
            block2.moveTo({ x: 5, y: 5 });
            block3.moveTo({ x: 5, y: 10 });

            board.putBlock(block1);
            board.putBlock(block2);
            board.putBlock(block3);

            // when
            board.clear();

            // then
            assertTrueIfBoardIsEmpty(board);
        });
    });

    describe('블럭 추가 >', () => {
        beforeEach(() => {
            rowCount = 20;
            colCount = 20;
            board = new Board({ rowCount, colCount });

            board.clear();
        });

        it('블럭을 보드에 추가할 수 있다.', () => {
            // given
            const block = Block.createBlock(I);

            // when
            block.moveTo({ x: 5, y: 5 });
            board.putBlock(block);

            // then
            assertTrueIfBoardHasBlock(board, block);
        });

        it('블럭을 보드에 여러 개 추가할 수 있다.', () => {
            // given
            const block1 = Block.createBlock(I);
            const block2 = Block.createBlock(I);
            const block3 = Block.createBlock(I);

            block1.moveTo({ x: 5, y: 3 });
            block2.moveTo({ x: 5, y: 5 });
            block3.moveTo({ x: 5, y: 10 });

            // when
            board.putBlock(block1);
            board.putBlock(block2);
            board.putBlock(block3);

            // then
            assertTrueIfBoardHasBlock(board, block1);
            assertTrueIfBoardHasBlock(board, block2);
            assertTrueIfBoardHasBlock(board, block3);
        });
    });

    describe('행 정리', () => {
        beforeEach(() => {
            rowCount = 20;
            colCount = 20;
            board = new Board({ rowCount, colCount });

            board.clear();
        });

        describe('블럭으로 가득 찬 행이 있다면 >', () => {
            let block;
            let blockTable;

            beforeEach(() => {
                block = Block.createBlock(I);
                blockTable = board.blockTable;

                blockTable[10] = blockTable[10].map(() => true);
                blockTable[15] = blockTable[15].map(() => true);
                blockTable[19] = blockTable[19].map(() => true);
            });

            it('블럭으로 가득 찬 행을 제거할 수 있다.', () => {
                // given
                // when
                block.moveTo({ x: 5, y: 5 });
                board.putBlock(block);

                // then
                assertTrueIfRowIsClean(board, 10);
                assertTrueIfRowIsClean(board, 15);
                assertTrueIfRowIsClean(board, 19);
            });

            it('제거한 행 상단에 있는 블럭들을 한 행 밑으로 떨어뜨려야 한다.', () => {
                // given
                // when
                block.moveTo({ x: 5, y: 5 });
                board.putBlock(block);

                // then
                block.moveTo({ x: 5, y: 8 });
                assertTrueIfBoardHasBlock(board, block);
            });
        });
    });
});
