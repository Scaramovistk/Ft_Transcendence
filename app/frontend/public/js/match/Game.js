import { GameBoard, Menu, ScoreBoard, Player, User, Socket } from './internal.js';
import { handleHashChange, handleNavBarButton, handleRefreshButton } from './internal.js';
import { handleKeyDown, handleKeyUp } from './internal.js';
import { rules, maxScore } from './internal.js';

import config from '../../config.js';

const navbarButton = document.querySelector('.navbar-brand');
const canvas = document.getElementById('canvas');

export class Game {
    constructor() {}
    maxScore = maxScore;
    rules = rules;
    scoreBoard = null;
    matchId = null;
    isRunning = false;
    mySocket = null;
    menu = null;
    localUser = null;
    leftPlayer = null;
    rightPlayer = null;
    gameBoard = new GameBoard(null, null);
    matchStatus = {
        play: 'playing',
        pause: 'paused',
        finish: 'finished',
        cancel: 'cancelled',
    }

    browseEvents() {
        window.addEventListener('hashchange', handleHashChange);
        navbarButton.addEventListener('click', handleNavBarButton);
        window.addEventListener('beforeunload', handleRefreshButton);
    }

    addGameInputEvents() {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    removeGameInputEvents() {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
    }
    
    start() {
        this.gameBoard.draw();
        this.menu = new Menu('start', this.rules);
        this.menu.show();    
        this.browseEvents();
    }

    restart() {
        this.gameBoard.draw();
        this.leftPlayer = null;
        this.rightPlayer = null;
    }

    newMatch(data) {
        this.localUser = new User(data.username, data.side);
        this.matchId = data.id;
        this.mySocket = new Socket(config.WSS_BACKEND_URL + "/wss/match/" + this.matchId + "/");
    }

    play(left_name, right_name) {
        this.menu.hide('wait');
        this.leftPlayer = new Player(left_name, "left", canvas.height / 2 - this.gameBoard.paddleHeight / 2);
        this.rightPlayer = new Player(right_name, "right", canvas.height / 2 - this.gameBoard.paddleHeight / 2);
        this.scoreBoard = new ScoreBoard(this.leftPlayer, this.rightPlayer);
        this.gameBoard = new GameBoard(this.leftPlayer, this.rightPlayer);
        this.gameBoard.draw();
        this.scoreBoard.show();
        this.browseEvents();
        this.addGameInputEvents();
        this.isRunning = true;
        this.loop();
    }
    
    loop = () => {
        if (!this.isRunning)
            return;

        this.gameBoard.updateLocalPaddle();
        this.gameBoard.updateBall();
        this.checkCollisions();
        this.checkOutOfBound();
        this.checkWinner();
        this.gameBoard.draw();
        requestAnimationFrame(this.loop);
    }

    checkCollisions() {
        const gameBall = this.gameBoard.gameBall;
        // Check collision with top or bottom
        if (gameBall.posY - gameBall.radius - 10 < 0 || gameBall.posY + gameBall.radius > canvas.height - 10) {
            gameBall.speedY = -gameBall.speedY;
        }
        // Check collision with left paddle
        if (gameBall.posX - gameBall.radius < this.gameBoard.paddleWidth &&
            gameBall.posY + gameBall.radius > this.leftPlayer.posY &&
            gameBall.posY - gameBall.radius < this.leftPlayer.posY + this.gameBoard.paddleHeight) {
            gameBall.speedX = -gameBall.speedX;
        }
        // Check collision with right paddle
        if (gameBall.posX + gameBall.radius > canvas.width - this.gameBoard.paddleWidth &&
            gameBall.posY + gameBall.radius > this.rightPlayer.posY &&
            gameBall.posY - gameBall.radius < this.rightPlayer.posY + this.gameBoard.paddleHeight) {
            gameBall.speedX = -gameBall.speedX;
        }
    }
    
    checkOutOfBound() {
        const gameBall = this.gameBoard.gameBall;
        if (gameBall.posX - this.gameBoard.paddleWidth < 0) {
            this.rightPlayer.score++;
            this.scoreBoard.update(this.leftPlayer.score, this.rightPlayer.score);
            this.gameBoard.resetBall();
        } else if (gameBall.posX + this.gameBoard.paddleWidth > canvas.width) {
            this.leftPlayer.score++;
            this.gameBoard.resetBall();
            this.scoreBoard.update(this.leftPlayer.score, this.rightPlayer.score);
        }
    }
    
    checkWinner() {
        if (this.leftPlayer.score === this.maxScore || this.rightPlayer.score === this.maxScore) {
            this.removeGameInputEvents();
            let winner = this.leftPlayer.score > this.rightPlayer.score ? this.leftPlayer.name : this.rightPlayer.name;
            if (this.mySocket !== null)
                this.mySocket.sendEndMatchMessage(this.leftPlayer.score, this.rightPlayer.score);
            this.isRunning = false;
            this.matchId = null;
            this.restart();
            this.menu = new Menu('end', winner);
            this.menu.show();
        }
    }
}
