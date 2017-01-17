import { SPACE, LEFT, UP, RIGHT, DOWN, PERIOD } from '../../consts/keycode';

class BoardPanelView {

    constructor(props = { config: {} }) {
        this._board = props.board;
        this._scoreboard = props.scoreboard;

        this._unitSize = props.config.unitSize || 20;
        this._width = props.config.width || 340;
        this._height = props.config.height || 540;

        this._elCanvas = props.canvas || document.createElement('canvas');
        this._elCanvas.width = this._width;
        this._elCanvas.height = this._height;

        this._ctx = this._elCanvas.getContext('2d');

        this._timerForDrop = null;
    }

    initialize() {
        this._board.putNextBlock();
        this._attachEvents();
        this._render();
        this._play();
    }

    _attachEvents() {
        document
            .getElementsByTagName('body')[0]
            .addEventListener('keydown', this._handleKeyEvent.bind(this), false);
    }

    _handleKeyEvent(e) {
        const keyCode = e.which;

        if (keyCode > LEFT && keyCode < DOWN) {
            e.preventDefault();
        }

        this._actionByKeyCode(keyCode);
        this._render();
    }

    _actionByKeyCode(keyCode) {
        switch (keyCode) {
        case SPACE:
            this._board.dropBlock();
            break;
        case LEFT:
            this._board.moveLeft();
            break;
        case UP:
            this._board.rotateBlock();
            break;
        case RIGHT:
            this._board.moveRight();
            break;
        case DOWN:
            this._board.moveDown();
            break;
        case PERIOD:
            this._speedUp();
            break;
        default:
        }
    }

    _finish() {
        this._stop();
        alert('GAME OVER');
    }

    _stop() {
        clearInterval(this._timerForDrop);
    }

    _speedUp() {
        this._stop();
        this._play();
    }

    _addScore(lineCnt) {
        this._scoreboard.addScoreByRowCount(lineCnt);
    }

    _play() {
        this._timerForDrop = setInterval(
            this._tick.bind(this),
            700,
        );
    }

    _tick() {
        if (this._board.next() === false) {
            this._finish();
        }
        this._render();
    }

    _render() {
        this._clear();
        this._drawAll(this._board);
    }

    _clear() {
        this._ctx.fillStyle = '#000';
        this._ctx.fillRect(0, 0, this._width, this._height);
    }

    _drawAll(board) {
        this._drawControlBlock(board.currentBlock);
        this._drawBlockTables(board.blockTable);
    }

    _drawControlBlock(block) {
        const ctx = this._ctx;
        const unitSize = this._unitSize;
        const { point, color } = block;
        const { x, y, relPoints } = point;

        ctx.fillStyle = color;
        ctx.strokeStyle = '#000';

        relPoints.forEach((relPt) => {
            this._drawBlockUnit(
                (relPt.x + x) * unitSize,
                (relPt.y + y) * unitSize,
                unitSize,
            );
        });
    }

    _drawBlockTables(blockTable) {
        const ctx = this._ctx;
        const unitSize = this._unitSize;
        const NO_BLOCK = false;

        ctx.strokeStyle = '#000';

        blockTable.forEach((row, i) => {
            row.forEach((column, j) => {
                const color = blockTable[i][j];
                if (color === NO_BLOCK) {
                    return;
                }

                ctx.fillStyle = color;
                this._drawBlockUnit(j * unitSize, i * unitSize, unitSize);
            });
        });
    }

    _drawBlockUnit(startX, startY, unitSize) {
        this._ctx.fillRect(startX, startY, unitSize, unitSize);
        this._ctx.strokeRect(startX, startY, unitSize, unitSize);
    }
}

export default BoardPanelView;
