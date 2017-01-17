import '../resources/css/style.css';

import { DEFAULT_GAME_SPEED, INTERVAL_UNIT } from './config';
import Board from './core/models/Board';
import GameRenderer from './core/ui/GameRenderer';
import Scoreboard from './core/models/Scoreboard';

class App {
    constructor(props) {
        const {
            width,
            height,
            unitSize,
            boardCanvas,
        } = props;

        this._gameRenderer = new GameRenderer({
            board: new Board({
                rows: Math.floor(height / unitSize),
                cols: Math.floor(width / unitSize),
            }),
            scoreboard: new Scoreboard({
                animateInterval: DEFAULT_GAME_SPEED,
                intervalUnit: INTERVAL_UNIT,
            }),
            unitSize,
            height,
            width,
            boardCanvas,
        });
    }

    initialize() {
        this._gameRenderer.initialize();
    }
}

module.exports = App;
