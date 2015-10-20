import Board from "./core/Board.js";

window.onload = function(){

    var board = new Board({
        width : 280,
        height : 500,
        unitSize : 20,
        canvasId : "gameBoard"
    });

    board.initialize();
};


