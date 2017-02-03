import EventEmitter from 'eventemitter3';

class Board extends EventEmitter {
    constructor(props = {}) {
        super();

        this.rowCount = props.rowCount;
        this.colCount = props.colCount;
        this.blockTable = [];

        this.clear();
    }

    clear() {
        const blockTable = new Array(this.rowCount);

        for (let y = 0; y < blockTable.length; y++) {
            blockTable[y] = this._generateEmptyRow();
        }

        this.blockTable = blockTable;
        this.emit('onChanged');
    }

    putBlock(block) {
        this._addBlockToTable(block);
        this._removeRows(this._findFullRowIndexes());
        this.emit('onChanged');
    }

    _addBlockToTable(block) {
        const blockTable = this.blockTable;
        const { point, color } = block;
        const { relPoints, x, y } = point;

        relPoints.forEach((relPt) => {
            blockTable[y + relPt.y][x + relPt.x] = color;
        });
    }

    _removeRows(fullLineIndexes) {
        fullLineIndexes.forEach((targetIndex) => {
            this._clearRow(targetIndex);
            this._pullBlocksDown(targetIndex);
        });
    }

    _findFullRowIndexes() {
        return this.blockTable.reduce((acc, row, index) => {
            const columnsWithBlock = row.filter(column => column !== false);
            const isFull = columnsWithBlock.length === row.length;

            if (isFull) {
                acc.push(index);
            }

            return acc;
        }, []);
    }

    _clearRow(targetIndex) {
        this.blockTable[targetIndex] = this._generateEmptyRow();
    }

    _generateEmptyRow() {
        return [...Array(this.colCount)].map(() => false);
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
}

export default Board;
