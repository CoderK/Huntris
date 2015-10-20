import KeyCode from "./../consts/KeyCode.js";
import Board from "./Board.js";

export default class Controller {

    constructor(options) {
        this._fnOnMoveDown = options.onMoveDown || function(){};
        this._dealyTime	= 700;
        this._dropTid = null;
        this._lv = 0;
        this.score	= 0;
    }

    start() {
        this._animateDownCurrentBlock();
    }

    stop() {
        clearInterval( this._dropTid );
        alert( "GAME OVER" );
    }

    speedUp() {
        clearInterval( this._dropTid );
        this._dealyTime = this._dealyTime - 25;
        this._animateDownCurrentBlock();
    }

    levelUp() {
        var lv	= Math.floor( this.score / 500 ) + 1;

        if( lv > this._lv ) {
            this._lv = lv;
            this.speedUp();
        }
    }

    addScore( lineCnt ) {
        if( lineCnt ){
            this._accumulateScore(lineCnt);
            this.levelUp();
        }
    }

    _accumulateScore(lineCnt) {
        this.score = this.score + lineCnt * 500 + ( ( lineCnt - 1 ) * 100 );
    }

    _animateDownCurrentBlock() {
        this._dropTid = setInterval( this._fnOnMoveDown, this._dealyTime );
    }
}