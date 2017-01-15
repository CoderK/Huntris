import '../resources/css/style.css';

import { DEFAULT_GAME_SPEED, INTERVAL_UNIT } from './config';
import Board from './core/models/Board';
import GameRenderer from './core/ui/GameRenderer';
import Scorer from './core/models/Scorer';

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
            scorer: new Scorer({
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
