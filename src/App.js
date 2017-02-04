import '../resources/css/style.css';
import GamePanelView from './core/ui/GamePanelView';

class App {
    constructor(props) {
        this.gamePanelView = new GamePanelView(props);
    }

    initialize() {
        this.gamePanelView.play();
    }
}

module.exports = App;
