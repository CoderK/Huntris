import KeyCode from "./../consts/KeyCode.js";
import RotateType from "./../consts/RotateType.js";

export default class Block {

    constructor(options){
        this.type =	options.type;
        this.rotateType	= options.rotateType;
        this.color = options.color;
        /* Block의 상대좌표들 */
        this.relPoints = options.relPoints;
        /* Block의 가장 중심 좌표 */
        this.point = options.point;
        this.rotateFlag	= false;
    }

    _rotateRelPoints( relPoints , nX, nY ) {
        var point	= null;
        var rotatedPoint = null;
        var rotatedRelPoints = [];

        for( let i = 0, len = relPoints.length; i < len; i++ ) {
            point = relPoints[ i ];
            rotatedPoint = {
                x : (point.y) * nX,
                y : (point.x) * nY
            };
            rotatedRelPoints[i] = rotatedPoint;
        }

        return rotatedRelPoints;
    }

    rotate(board) {
        if( this.rotateType == RotateType.SKIP ) {
            return;
        }

        var rotatedRelPoints = this._calculateRelPointsByRotateType();
        var point = this.point;
        var relPt = null;

        for( let i = 0, len = rotatedRelPoints.length; i < len; i++ ) {
            relPt =	rotatedRelPoints[ i ];

            if(board.isOutside(point.x, point.y, relPt.x, relPt.y)){
                return;
            }
        }

        this.rotateFlag = !this.rotateFlag;
        this.relPoints = rotatedRelPoints;
    }

    _calculateRelPointsByRotateType() {
        switch (this.rotateType) {
            case RotateType.TOGGLE :
                return this._toggleRotate();
            default :
                return this._rotateClockwise();
        }
    }

    _rotateClockwise() {
        return this._rotateRelPoints(this.relPoints, -1, 1);
    }

    _toggleRotate() {
        var rotatedRelPoints = null;

        if (this.rotateFlag) {
            rotatedRelPoints = this._rotateRelPoints(this.relPoints, 1, -1);
        } else {
            rotatedRelPoints = this._rotateRelPoints(this.relPoints, -1, 1);
        }

        return rotatedRelPoints;
    }

    down() {
        return ++this.point.y;
    }

    left(board) {
        if( this.canMoveTo( KeyCode.LEFT, board ) ) {
            --this.point.x;
        }
    }

    right(board) {
        if( this.canMoveTo( KeyCode.RIGHT, board ) ) {
            ++this.point.x;
        }
    }

    /* 블럭 이동 가능성 체크 */
    canMoveTo( keyCode, board ) {
        var relPoints =	this.relPoints;
        var point = this.point;
        var relPt = null;

        for( let i = 0, len = relPoints.length; i < len; i++ ) {
            relPt =	relPoints[ i ];

            if(board.isCollision(keyCode, point.x, point.y, relPt.x, relPt.y)){
                return false;
            }
        }

        return true;
    }

    /* 현재 블럭을 가장 하단까지 이동시킴. */
    dropToBottom( board ) {
        while( this.canMoveTo( KeyCode.DOWN, board ) ) {
            this.down();
        };
    }
}

