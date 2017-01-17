import chai from 'chai';
import sinon from 'sinon';
import Scoreboard from '../Scoreboard';

chai.should();

describe('Scoreboard', () => {
    let sandboxSinon;

    beforeEach(() => {
        sandboxSinon = sinon.sandbox.create();
    });

    afterEach(() => {
        sandboxSinon.restore();
    });

    describe('점수판에 점수를 추가할 수 있다.', () => {
        it('점수판에 점수를 누적시킬 수 있다.', () => {
            // given
            const scoreBoard = new Scoreboard();

            // when
            scoreBoard.addScore(1000);
            scoreBoard.addScore(500);
            scoreBoard.addScore(200);

            // then
            scoreBoard.score.should.be.eql(1700);
        });

        it('삭제한 하나의 행을 100점으로 계산해서 점수를 추가할 수 있다.', () => {
            // given
            const scoreBoard = new Scoreboard();

            // when
            scoreBoard.addScoreByRowCount(10);

            // then
            scoreBoard.score.should.be.eql(1000);
        });

        it('삭제한 하나의 행을 200점으로 계산해서 점수를 누적시킬 수 있다.', () => {
            // given
            const scoreBoard = new Scoreboard({
                pointPerRow: 200
            });

            // when
            scoreBoard.addScoreByRowCount(10);
            scoreBoard.addScoreByRowCount(20);
            scoreBoard.addScoreByRowCount(30);

            // then
            scoreBoard.score.should.be.eql(12000);
        });
    });

    describe('레벨 판단', () => {
        it('누적 점수가 1000점을 넘을 때마다 레벨을 하나 올릴 수 있다.', () => {
            // given
            const scoreBoard = new Scoreboard({
                level: 0,
                pointPerRow: 100,
                requiredScore: 1000
            });

            // when
            scoreBoard.addScore(1000);
            scoreBoard.addScore(1000);
            scoreBoard.addScore(1000);
            scoreBoard.addScore(1);

            // then
            scoreBoard.level.should.be.eql(3);
        });

        it('누적 점수가 500점을 넘을 때마다 레벨을 하나 올릴 수 있다.', () => {
            // given
            const scoreBoard = new Scoreboard({
                level: 0,
                pointPerRow: 500,
                requiredScore: 500
            });

            // when
            scoreBoard.addScore(500);
            scoreBoard.addScore(500);
            scoreBoard.addScore(499);

            // then
            scoreBoard.level.should.be.eql(2);
        });

        it('삭제한 행을 점수로 계산하여 레벨을 올릴 수 있다.', () => {
            // given
            const scoreBoard = new Scoreboard({
                level: 0,
                pointPerRow: 1000
            });

            // when
            scoreBoard.addScoreByRowCount(1);
            scoreBoard.addScoreByRowCount(4);
            scoreBoard.addScoreByRowCount(5);

            // then
            scoreBoard.level.should.be.eql(10);
        });
    });

    describe('점수판 초기화', () => {
        it('점수와 레벨을 초기화할 수 있다.', () => {
            // given
            const scoreBoard = new Scoreboard();
            scoreBoard.addScore(1000);
            scoreBoard.addScore(500);
            scoreBoard.addScore(200);

            // when
            scoreBoard.reset();

            // then
            scoreBoard.score.should.be.eql(0);
            scoreBoard.level.should.be.eql(0);
        });
    });
});
