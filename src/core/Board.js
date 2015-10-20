import KeyCode from "./../consts/KeyCode.js";
import BlockFactory from "./BlockFactory.js";
import Controller from "./Controller.js";

export default class Board {

    constructor(options){
        /* Defaut Config */
		this._width = options.width || 340;
		this._height = options.height || 540;
		this._unitSize = options._unitSize || 20;
		this._topMargin	= options.topMargin || 3;
        this._currentBlock = null;
        this._blockTables =	[];

		this._canvasId = options.ctxId || "gameBoard";
		this._elCanvas  = document.getElementById( this._canvasId );
		this._elCanvas.width = this._width;
		this._elCanvas.height = this._height;
        this._ctx =	this._elCanvas.getContext( '2d' );

		this._rows = Math.floor( this._height / this._unitSize );
		this._cols = Math.floor( this._width / this._unitSize );

        this._controller = this._createController();

        this._attachEvents();
        this._resetBlocks();
        this._putNextBlock();
        this.render();
    }

    _createController() {
        return new Controller({
            onMoveDown: () => {
                var curBlock = this.getCurrentBlock();
                if (curBlock.canMoveTo(KeyCode.DOWN, this)) {
                    curBlock.down();

                } else {
                    this._fixToTable(curBlock);

                    if (!this._putNextBlock()) {
                        this._controller.stop();
                    }
                }

                this.render();
            }
        });
    }

    initialize(){
        this._controller.start();
    }

    render() {
        this._clearBoard();
        this._drawAll();
    }

    _attachEvents() {
        var body = document.getElementsByTagName('body')[0];
        body.addEventListener('keydown', this._keyEventHandler.bind(this), false);
    }

    _keyEventHandler( e ) {
        var keyCode =	e.keyCode;

        if( keyCode > KeyCode.LEFT && keyCode < KeyCode.DOWN ) {
            e.preventDefault();
        }

        var curBlock = this.getCurrentBlock();

        switch ( keyCode ) {
            case KeyCode.LEFT:
                curBlock.left(this);
                break;
            case KeyCode.UP:
                curBlock.rotate(this);
                break;
            case KeyCode.RIGHT:
                curBlock.right(this);
                break;
            case KeyCode.DOWN:
                curBlock.dropToBottom(this);
                break;
            case KeyCode.SPEED_UP:
                this._controller.speedUp();
                break;
        }

        this.render();
    }

	_resetBlocks() {
		var blockTables	= [];
        var ylen = this._rows;
        var xlen = this._cols;

		for( let y = 0; y < ylen; y++ ) {
			blockTables[ y ] = [];

			for( let x = 0; x < xlen; x++  ) {
				blockTables[ y ][ x ] = false;
			}
		}

		this._blockTables =	blockTables;
	}

	_clearBoard() {
		var	ctx	=	this._ctx;

		ctx.fillStyle =	"#000";
		ctx.fillRect( 0, 0, this._width, this._height );
	}

	_addBlock( block ) {
		var point =	block.point;
		point.x	= Math.floor( this._cols / 2 ) + point.x;
		point.y	= this._topMargin;

		this._currentBlock = block;

		return !this._blockTables[ point.y ][ point.x ];
	}

    _putNextBlock(){
        return this._addBlock( BlockFactory.createRandomBlock() );
    }

	/* 현재 컨트롤 중인 블럭을 그림 */
	_drawControlBlock() {
		var ctx	= this._ctx;
		var curBlock =	this._currentBlock;
		var relPoints =	curBlock.relPoints;
		var point =	curBlock.point;
		var x =	point.x;
		var y =	point.y;
		var unitSize = this._unitSize;
		var relPt = null;

		ctx.fillStyle =	curBlock.color;
		ctx.strokeStyle	= "#000";

		for( let i = 0, len = relPoints.length; i < len; i++ ) {
			relPt	=	relPoints[ i ];
			ctx.fillRect( ( relPt.x + x ) * unitSize,  ( relPt.y + y ) * unitSize, unitSize, unitSize );
			ctx.strokeRect( ( relPt.x + x ) * unitSize,  ( relPt.y + y ) * unitSize, unitSize, unitSize );
		}
	}

	/* 보드에 세팅된 블럭을 그린다. */
	_drawBlockTables() {
		var blockTables	= this._blockTables;
		var ylen = blockTables.length;
		var xlen = blockTables[ 0 ].length;
		var ctx	= this._ctx;
		var unitSize = this._unitSize;

		ctx.fillStyle =	"#fff";
		ctx.strokeStyle	= "#000";

		for( var i = 0; i < ylen; i++ ) {
			for( var j = 0; j < xlen; j++ ) {
				if( blockTables[ i ][ j ] ) {
					ctx.fillRect( j * unitSize, i * unitSize, unitSize, unitSize );
					ctx.strokeRect( j * unitSize, i * unitSize, unitSize, unitSize );
				}
			}
		}
	}

	_drawAll() {
		this._drawControlBlock();
		this._drawBlockTables();
	}

	/* 현재 블럭을 해당위치에 고정시킴 */
	_fixToTable( block ) {
		var relPoints =	block.relPoints;
		var point =	this._currentBlock.point;
		var x =	point.x;
		var y =	point.y;
		var relPt = null;

		for( let i = 0, len = relPoints.length; i < len; i++ ) {
			relPt =	relPoints[ i ];
			this._blockTables[ y + relPt.y ][ x + relPt.x ] = true;
		}

        var deletedCnt = this.removeLines( this._findFullRows() );
        this._controller.addScore(deletedCnt);
	}

	_findFullRows() {
		var blockTables	= this._blockTables;
		var ylen = blockTables.length;
		var xlen = blockTables[ 0 ].length;
		var fullRows =	[];
		var flag = false;

		for( var i = 0; i < ylen; i++ ) {
			flag = true;

			for( let j = 0; j < xlen; j++ ) {
				if( !blockTables[ i ][ j ] ) {
					flag =	false;
					break;
				}
			}

			/* 블럭으로 꽉찬 라인의 인덱스를 저장함 */
			if( flag ) {
				fullRows.push( i );
			}
		}

		return fullRows;
	}

	removeLines( fullLineIdexes ) {
		var len = fullLineIdexes.length;
		if( len == 0 ) {
			return;
		}

		var blockTables	= this._blockTables,
			targetLines = null;

		for( let i = 0; i < len; i++ ) {
			targetLines = blockTables[ fullLineIdexes[ i ] ];

			for( let j = 0; j < targetLines.length; j++ ) {
				targetLines[ j ] = false;
			}

			this._dropAllAboveLine( fullLineIdexes[ i ] );
		}

		return len;
	}

	/* 해당 라인 위의 모든 블럭들을 아래로 떨어뜨림. */
	_dropAllAboveLine( targetRow ) {
		var blockTables	= this._blockTables;

		for( let i = targetRow - 1; i >= 0; i-- ) {
			for( let j = 0, len = blockTables[ i ].length; j < len; j++ ) {
				blockTables[ i + 1 ][ j ] = blockTables[ i ][ j ];
			}
		}
	}

	isOutside(x, y, relX, relY){
		var blockTables	= this.blockTables;

		if( x + relX < 0 || blockTables[y + relY][x + relX - 1] ){
			return true;
		}

		if( x + relX > this.cols - 1 || blockTables[y + relY][x + relX + 1] ){
			return true;
		}

		if( y + relY > this.rows - 1 || blockTables[y + relY + 1][x + relX] ){
			return true;
		}

		return false;
	}

	isCollision(direction, x, y, relX, relY) {
		var blockTables	= this.blockTables;

		switch (direction) {
			case KeyCode.LEFT:
				return ( x + relX < 1 ) || blockTables[y + relY][x + relX - 1];
			case KeyCode.RIGHT:
				return ( x + relX >= this.cols - 1 ) || blockTables[y + relY][x + relX + 1];
			case KeyCode.DOWN:
				/* 바닥에 블럭이 닿았는지 체크 / 떨어지는 블럭의 하단에 이미 다른 블럭이 있는지 체크 */
				return ( y + relY >= this.rows - 1 ) || blockTables[y + relY + 1][x + relX];
		}

		return false;
	}

    getCurrentBlock() {
        return this._currentBlock;
    }

	get rows(){
		return this._rows;
	}

    set rows(rows){
        this._rows = rows;
    }

	get cols(){
		return this._cols;
	}

    set cols(cols){
        this._cols = cols;
    }

    set blockTables(blockTables){
        this._blockTables = blockTables;
    }

    get blockTables(){
        return this._blockTables;
    }

}