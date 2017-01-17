class Scoreboard {
    constructor(props = {}) {
        this.level = 0;
        this.score = 0;
        this.pointPerRow = props.pointPerRow || 100;
        this.requiredScore = props.requiredScore || 1000;
    }

    addScore(score) {
        this.score += score;
        this.level = this._updateLevel();
    }

    addScoreByRowCount(rowCount) {
        this.score += this._calculatePoint(rowCount);
        this.level = this._updateLevel();
    }

    reset() {
        this.score = 0;
        this.level = 0;
    }

    _updateLevel() {
        return Math.floor(this.score / this.requiredScore);
    }

    _calculatePoint(rowCount) {
        return rowCount * this.pointPerRow;
    }
}

export default Scoreboard;
