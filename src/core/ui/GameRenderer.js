import BoardPanelView from '../../core/ui/BoardPanelView';

class GameRenderer {

    constructor(props) {
        this._boardPanelView = new BoardPanelView({
            board: props.board,
            scoreboard: props.scoreboard,
            canvas: props.boardCanvas,
            config: {
                unitSize: props.unitSize,
                width: props.width,
                height: props.height,
            },
        });
    }

    initialize() {
        this._boardPanelView.initialize();
    }
}

export default GameRenderer;
