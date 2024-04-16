export class ScoreBoard {
    constructor(leftPlayer, rightPlayer) {
        this.lefPlayer = leftPlayer; 
        this.rightPlayer = rightPlayer;
        this.scoreBoardElem = document.getElementById("scoreBoard");
        this.leftNameElem = document.getElementById("leftName");
        this.leftScoreElem = document.getElementById("leftScore");
        this.rightNameElem = document.getElementById("rightName");
        this.rightScoreElem = document.getElementById("rightScore");
        this.leftNameElem.textContent = leftPlayer.displayName;
        this.rightNameElem.textContent = rightPlayer.displayName;
        this.rightScoreElem.textContent = 0;
        this.leftScoreElem.textContent = 0;
        this.hide();
    }

    clear() {
        this.leftNameElem.textContent = '';
        this.rightNameElem.textContent = '';
        this.rightScoreElem.textContent = '';
        this.leftScoreElem.textContent = '';
    }

    reset() {
        this.rightScoreElem.textContent = 0;
        this.leftScoreElem.textContent = 0;
    }

    show() {
        this.scoreBoardElem.style.visibility = 'visible';
    }

    hide() {
        this.scoreBoardElem.style.visibility = 'hidden';
    }

    update(leftScore, rightScore) {
        this.leftScoreElem.textContent = leftScore;
        this.rightScoreElem.textContent = rightScore;
    }
}