class Scorer {
    constructor(props = {}) {
        this._animateInterval = props.animateInterval || 700;
        this._intervalUnit = props.intervalUnit || 25;
        this._timerForDrop = null;
        this._level = 0;
        this._score = 0;
    }

    addScore(lineCnt) {
        if (!lineCnt) {
            return;
        }

        this._accumulateScore(lineCnt);
        this._decideLevel();
        this._decideAnimateSpeed();
    }

    speedUp() {
        this._animateInterval = this._animateInterval - this._intervalUnit;
    }

    _decideAnimateSpeed() {
        this._animateInterval = this._animateInterval - (this._level * this._intervalUnit);
    }

    _decideLevel() {
        this._level = Math.floor(this._score / 1000);
    }

    _accumulateScore(lineCnt) {
        this._score = this._score + this.calculateScore(lineCnt);
    }

    get score() {
        return this._score;
    }

    get level() {
        return this._level;
    }

    get animateInterval() {
        return this._animateInterval;
    }

    static calculateScore(lineCnt) {
        return lineCnt * 100;
    }
}

export default Scorer;
