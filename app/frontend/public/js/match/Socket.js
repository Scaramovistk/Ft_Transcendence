import { pongGame } from "./internal.js";

export class Socket {
    constructor(address) {
        this.address = address;
        this.socket = new WebSocket(address);

        // Bind event handlers
        this.socket.onopen = this.onopen.bind(this);
        this.socket.onclose = this.onclose.bind(this);
        this.socket.onmessage = this.onmessage.bind(this);
        this.socket.onerror = this.onerror.bind(this);
    }
    onopen(event) {
        const data = {
            type: 'new_player',
            name: pongGame.localUser.name,
        };
        this.socket.send(JSON.stringify(data));
    }
    onclose(event) {
        pongGame.mySocket = null;
    }
    onmessage(event) {
        const data = JSON.parse(event.data);
        //console.log(data);
        switch (data.type) {
            case 'new_player':
                break;
            case 'start_match':
                pongGame.play(data.left_name, data.right_name);
                break;
            case 'ball_reset':
                break;
            case 'ball_speed_y':
                pongGame.gameBoard.gameBall.speedY = data.random * 10 - 5;
                break;
            case 'posY':
                if (pongGame.leftPlayer !== null && data.side === 'left') {
                    pongGame.leftPlayer.posY = data.pos_y;
                } else if (pongGame.rightPlayer !== null && data.side === 'right') {
                    pongGame.rightPlayer.posY = data.pos_y;
                }
                break;
            case 'end_match':
                // this.socket.close(1000);
                this.socket = null;
                break;
            default:
                console.error("Unknown message type");
                break;
        }
    }
    onerror(event) {
        console.error('WebSocket error:', event);
    }

    sendEndMatchMessage(leftScore, rightScore) {
        const data = {
            type: 'end_match',
            left_score: leftScore,
            right_score: rightScore,
        };
        this.socket.send(JSON.stringify(data));
    }

    sendPosYMessage(side, posY) {
        const data = {
            type: 'posY',
            pos_y: posY,
            side: side,
        };
        this.socket.send(JSON.stringify(data));
    }

    sendBallResetMessage() {
        const data = {
            type: 'ball_reset',
        };
        this.socket.send(JSON.stringify(data));
    }
}