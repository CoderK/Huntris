import RotateType from "../consts/RotateType.js";
import Block from "./Block.js";

export default class BlockFactory {

    static createRandomBlock() {
        var type = parseInt( Math.random() * 7 );
        var relPoints;
        var color;
        var rotateType;
        var point;

        switch( type ) {
            case 0:	/* - */
                relPoints	=	[
                    { y : 0, x : -1 }, { y : 0, x : 0 }, { y : 0, x : 1 }, { y : 0, x : 2 }
                ];

                color = "#C23031";
                rotateType	= RotateType.TOGGLE;
                point = { x : -2, y : 0 };
                break;
            case 1:	/* ㄱ */
                relPoints	=	[
                    { y : 0, x : -1 }, { y : 0, x : 0 }, { y : 0, x : 1 }, { y : -1, x : 1 }
                ];

                color = "#D59430";
                rotateType = RotateType.CLOCKWISE;
                point = { x : -1, y : 0 };
                break;
            case 2:	/* ㄴㄱ */
                relPoints	=	[
                    { y : 0, x : 0 }, { y : 0, x : -1 }, { y : -1, x : 0 }, { y : -1, x : 1 }
                ];
                color = "#003BBD";
                rotateType	= RotateType.TOGGLE;
                point = { x : -1, y : 0 };
                break;
            case 3:	/* ㅁ */
                relPoints	=	[
                    { y : 0, x : 0 }, { y : 0, x : 1 }, { y : 1, x : 0 }, { y : 1, x : 1 }
                ];

                color = "#5EDBDF";
                rotateType	= RotateType.SKIP;
                point = { x : -1, y : 0 };
                break;
            case 4: /* ㄴ */
                relPoints	=	[
                    { y : -1, x : -1 }, { y : 0,  x : -1 }, { y : 0, x : 0 }, { y : 0, x : 1  }
                ];

                color = "#FCC63F";
                rotateType	 = RotateType.CLOCKWISE;
                point = { x : -1, y : 0 };
                break;
            case 5:	/* ㄱㄴ */
                relPoints = [
                    { y : 0, x : 0 }, { y : -1, x : 0 }, { y : -1, x : -1 }, { y : 0, x : 1 }
                ];

                color = "#40C77B";
                rotateType	= RotateType.TOGGLE;
                point = { x : -1, y : 0 };
                break;
            case 6:	/* ㅜ */
                relPoints	=	[
                    { y : 0, x : 0 }, { y : 0, x : -1 }, { y : 0, x : 1 }, { y : 1, x : 0 }
                ];

                color = "#A325FB";
                rotateType = RotateType.CLOCKWISE;
                point = { x : -1, y : 0 };
        }

        return new Block({
            type : type,
            relPoints : relPoints,
            point : point,
            color : color,
            rotateType : rotateType
        });
    }

}