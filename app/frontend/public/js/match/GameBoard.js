import { pongGame } from './internal.js'
let pos = 200;

class Ball {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
    radius = 10;
    speedX = 8;
    speedY = 8;
}

export class GameBoard {
    constructor(leftPlayer, rightPlayer) {
        this.leftPlayer = leftPlayer;
        this.rightPlayer = rightPlayer;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameBall = new Ball(this.canvas.width / 2, this.canvas.height / 2);
    }

    paddleWidth = 20
    paddleHeight = 100;
    paddleSpeed = 10;
    
    draw() {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        // draw top line
        this.ctx.beginPath();
        this.ctx.setLineDash([]);
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(canvas.width, 0);
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 20;
        this.ctx.stroke();
        this.ctx.closePath();
    
        // draw bottom line
        this.ctx.beginPath();
        this.ctx.setLineDash([]);
        this.ctx.moveTo(0, canvas.height);
        this.ctx.lineTo(canvas.width, canvas.height);
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 20; 
        this.ctx.stroke();
        this.ctx.closePath();
    
        // draw middle line
        this.ctx.beginPath();
        this.ctx.setLineDash([10, 5]);
        this.ctx.moveTo(canvas.width / 2, 0);
        this.ctx.lineTo(canvas.width / 2, canvas.height);
        this.ctx.strokeStyle = '#FFF';
        this.ctx.lineWidth = 10;
        this.ctx.stroke();
        this.ctx.closePath();
    
        // draw paddles
        this.ctx.fillStyle = '#FFF';
        if (this.rightPlayer === null && this.leftPlayer === null) {
            this.ctx.fillRect(0, canvas.height / 2 - this.paddleHeight / 2, this.paddleWidth, this.paddleHeight);
            this.ctx.fillRect(canvas.width - this.paddleWidth, canvas.height / 2 - this.paddleHeight / 2, this.paddleWidth, this.paddleHeight);
        } else {
            this.ctx.fillRect(0, this.leftPlayer.posY, this.paddleWidth, this.paddleHeight);
            this.ctx.fillRect(canvas.width - this.paddleWidth, this.rightPlayer.posY, this.paddleWidth, this.paddleHeight);
        }
        
        // draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.gameBall.posX, this.gameBall.posY, this.gameBall.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFF';
        this.ctx.fill();
        this.ctx.closePath();
    }

    updateLocalPaddle() {
        let player;
        if (pongGame.mySocket === null) {
            return ;
        }
        if (pongGame.leftPlayer.name === pongGame.localUser.name) {
            player = pongGame.leftPlayer;
        } else {
            player = pongGame.rightPlayer;
        }
        let pos = player.posY;
        if (player.inputUp && player.posY > 0) {
            pos = player.posY - this.paddleSpeed;
        } else if (player.inputDown && player.posY + this.paddleHeight < canvas.height) {
            pos = player.posY +  this.paddleSpeed;
        }
        if (pongGame.mySocket !== null)
            pongGame.mySocket.sendPosYMessage(player.side, pos);
    }
    
    updateBall() {
        this.gameBall.posX += this.gameBall.speedX;
        this.gameBall.posY += this.gameBall.speedY;
    }

    resetBall() {

        this.gameBall.posX = canvas.width / 2;
        this.gameBall.posY = canvas.height / 2;
        this.gameBall.speedX = -this.gameBall.speedX;
        
        this.gameBall.speedY = 10;    
        if (pongGame.mySocket !== null) {
            pongGame.mySocket.sendBallResetMessage();
        }
    
    }
}