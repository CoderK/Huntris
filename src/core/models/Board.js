import EventEmitter from 'eventemitter3';
import Block from './Block';

class Board extends EventEmitter {
    constructor(props = {}) {
        super();

        this._topMargin = 3;
        this._rows = props.rows || 5;
        this._cols = props.cols || 5;
        this._currentBlock = null;
        this._nextBlock = Block.createRandomBlock();
        this._blockTable = [];

        this.resetTables();
        this.putNextBlock();
    }

    putNextBlock() {
        this._dequeue();
        this._moveToEntryPoint(this.currentBlock);

        this.emit('changedCurrentBlock', this.nextBlock);
    }

    _dequeue() {
        this.currentBlock = this.nextBlock;
        this.nextBlock = Block.createRandomBlock();
    }

    _moveToEntryPoint(block) {
        const entry = this._calculateEntryPoint(block);
        block.moveTo(entry);
    }

    _calculateEntryPoint(block) {
        return {
            x: Math.floor(this._cols / 2) + block.point.x,
            y: this._topMargin,
        };
    }

    fixBlockToTable(block) {
        this._addBlockToTable(block);

        const fullLines = this._findFullLines();
        this._removeLines(fullLines);
    }

    _addBlockToTable(block) {
        const blockTable = this.blockTable;
        const { point, color } = block;
        const { relPoints, x, y } = point;

        relPoints.forEach((relPt) => {
            blockTable[y + relPt.y][x + relPt.x] = color;
        });
    }

    moveLeft() {
        this.currentBlock.left(this.blockTable);
    }

    rotateBlock() {
        this.currentBlock.rotate(this.blockTable);
    }

    moveRight() {
        this.currentBlock.right(this.blockTable);
    }

    moveDown() {
        this.currentBlock.down(this.blockTable);
    }

    dropBlock() {
        this.currentBlock.drop(this.blockTable);
        this.next();
    }

    next() {
        const curBlock = this.currentBlock;
        const isMoved = curBlock.down(this.blockTable);

        if (isMoved === false) {
            this.fixBlockToTable(curBlock);
            this.putNextBlock();
        }

        return this._isAlive();
    }

    _isAlive() {
        return this._hasBlock(this.currentBlock) === false;
    }

    _hasBlock(block) {
        const { x, y } = block.point;
        return this.blockTable[y][x];
    }

    resetTables() {
        const blockTable = Array(...{ length: this._rows }).map(() => false);

        for (let y = 0; y < this._rows; y++) {
            blockTable[y] = Array(...{ length: this._cols }).map(() => false);
        }

        this.blockTable = blockTable;
    }

    _findFullLines() {
        const fullLineIndexes = [];

        this.blockTable.forEach((row, i) => {
            const columnsWithBlock = row.filter(column => column !== false);
            const isFull = columnsWithBlock.length === row.length;

            if (isFull) {
                fullLineIndexes.push(i);
            }
        });

        return fullLineIndexes;
    }

    _removeLines(fullLineIndexes) {
        fullLineIndexes.forEach((targetIndex) => {
            this._clearRow(targetIndex);
            this._pullBlocksDown(targetIndex);
        });
    }

    _clearRow(targetIndex) {
        this.blockTable[targetIndex] = this._generateEmptyRow();
    }

    _generateEmptyRow() {
        return Array(...Array(this._cols)).map(() => false);
    }

    _pullBlocksDown(targetRow) {
        const blockTables = this.blockTable;

        for (let i = targetRow - 1; i >= 0; i--) {
            const row = blockTables[i];
            row.forEach((column, j) => {
                blockTables[i + 1][j] = blockTables[i][j];
                blockTables[i][j] = false;
            });
        }
    }

    get nextBlock() {
        return this._nextBlock;
    }

    set nextBlock(block) {
        this._nextBlock = block;
    }

    get currentBlock() {
        return this._currentBlock;
    }

    set currentBlock(block) {
        this._currentBlock = block;
    }

    get blockTable() {
        return this._blockTable;
    }

    set blockTable(blockTable) {
        this._blockTable = blockTable;
    }
}

export default Board;
