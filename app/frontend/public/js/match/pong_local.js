import config from '../../config.js'

///////////////////////////////////// VARIABLES ///////////////////////////////////////

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

class Player {
    constructor(name, side) {
        this.name = name;
        this.side = side;
        let docElem;
        if (this.side === 'left') {
            docElem = document.getElementById('leftName');
        } else {
            docElem = document.getElementById('rightName');
        }
        this.displayName = this.name.length < 10 ? this.name : this.name.slice(0, 9) + "...";
        docElem.textContent = this.displayName;
    }
    score = 0;
    posY = canvas.height / 2 - paddleHeight / 2;
    inputUp = false;
    inputDown = false;
}

let leftPlayer = null;
let rightPlayer = null;

let gameIsRunning = false;
let animationId;
const maxScore = 3;

const paddleWidth = 20
const paddleHeight = 100;
const paddleSpeed = 10;

class Ball {
    constructor() {}
    radius = 10;
    posX = canvas.width / 2;
    posY = canvas.height / 2;
    speedX = 8;
    speedY = 8;
}
let gameBall = new Ball();

const controls = {
    leftUp: 'w',
    leftDown: 's',
    rightUp: 'ArrowUp',
    rightDown: 'ArrowDown',
}

const matchStatus = {
    play: 'playing',
    pause: 'paused',
    finish: 'finished',
    cancel: 'cancelled',
}

const formPlayer1 = document.getElementById('formPlayer1');
const formPlayer2 = document.getElementById('formPlayer2');

const cardPlayer1 = document.getElementById('cardPlayer1');
const cardPlayer2 = document.getElementById('cardPlayer2');


const leftDisplayScore = document.getElementById('leftScore');
const rightDisplayScore = document.getElementById('rightScore');

const playButton = document.getElementById('playButton');
document.getElementById('buttons').style.visibility = 'hidden';

document.getElementById('maxScore').textContent = "maxScore: " + maxScore;

let matchId = null;

const modalEndScore = bootstrap.Modal.getOrCreateInstance(document.getElementById('endModal'));

const navbarButton = document.querySelector('.navbar-brand');


//////////////////////////////// LISTENERS & FUNCTIONS AT START ////////////////////////

backToStart();
window.addEventListener('hashchange', handleHashChange);
navbarButton.addEventListener('click', handleNavBarButton);
window.addEventListener('beforeunload', handleRefreshButton);

///////////////////////////////////// ASYNC //////////////////////////////////////////

async function newPlayer(form, side) {
    try {
        let invalidText;
        let card;
        if (side === 'left') {
            invalidText = document.getElementById('invalid-form1');
            card = cardPlayer1;
        } else if (side === 'right') {
            invalidText = document.getElementById('invalid-form2');
            card = cardPlayer2;
        }
        const formData = new FormData(form);
        const response = await fetch(config.BACKEND_URL + '/match/new-player/', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
        });
        const data = await response.json();
        console.log(data);
        form.reset();
        if (data['success'] === true) {
            if (side === 'left') {
                leftPlayer = new Player(data['username'], side)
            } else if (side === 'right') {
                rightPlayer = new Player(data['username'], side)
            }
            form.removeEventListener('submit', handleFormSubmit);
            card.style.visibility = 'hidden';
            invalidText.textContent = '';
            if (leftPlayer !== null && rightPlayer !== null) {
                document.getElementById('buttons').style.visibility = 'visible';
                showScoreBoard();
            }
        } else {
            if (data.hasOwnProperty('non_field_errors')) {
                invalidText.textContent = data['non_field_errors'];
            } else if (data['message']) {
                invalidText.textContent = data['message'];
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updatePlayers(leftPlayer, rightPlayer) {
    try {
        const message = {
            'type': 'toggle_status',
            'left_player_name': leftPlayer === null ? null : leftPlayer.name,
            'right_player_name': rightPlayer === null ? null : rightPlayer.name,
            // 'left_player_name': leftName,
            // 'right_player_name': rightName,
            // 'type': 'local',
            'max_score': maxScore,
			'tournament_id': -1,
        };
        console.log(message);
        const response = await fetch(config.BACKEND_URL + '/match/update-players/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            body: JSON.stringify(message),
            keepalive: true,
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function newMatch(leftName, rightName) {
    try {
        const message = {
            'left_player_name': leftName,
            'right_player_name': rightName,
            'type': 'local',
            'max_score': maxScore,
            'tournament_id': -1,
        };
        console.log(message);
        const response = await fetch(config.BACKEND_URL + '/match/new-match/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            body: JSON.stringify(message),
        });
        const data = await response.json();
        console.log(data);
        matchId = data['match_id'];
    } catch (error) {
        console.error('Error:', error);
    }
}

async function updateMatch(matchId, matchStatus, leftScore, rightScore) {
    try {
        const message =
            {
                'id': matchId,
                'new_status': matchStatus,
                'left_score': leftScore,
                'right_score': rightScore,
            };
        console.log(message);
        const response = await fetch(config.BACKEND_URL + '/match/update-match/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
            },
            body: JSON.stringify(message),
            keepalive: true,
        });
        const data = await response.json();
        console.log(data);
    } catch (error) {
            console.error('Error:', error);
    }
}

///////////////////////////////////// GAME ////////////////////////////////////////////

function gameLoop() {
    if (!gameIsRunning)
        return;
    updateGame();
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

function updateGame() {
    updatePaddle(leftPlayer);
    updatePaddle(rightPlayer);
    updateBall();
    checkCollisions();
    checkOutOfBound();
    checkWinner();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw top line
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 20;
    ctx.stroke();
    ctx.closePath();

    // draw bottom line
    ctx.beginPath();
    ctx.setLineDash([]);
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 20; 
    ctx.stroke();
    ctx.closePath();

    // draw middle line
    ctx.beginPath();
    ctx.setLineDash([10, 5]);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.closePath();

    // draw paddles
    ctx.fillStyle = '#FFF';
    if (rightPlayer === null && leftPlayer === null) {
        ctx.fillRect(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight);
    } else {
        ctx.fillRect(0, leftPlayer.posY, paddleWidth, paddleHeight);
        ctx.fillRect(canvas.width - paddleWidth, rightPlayer.posY, paddleWidth, paddleHeight);
    }
    
    // draw ball
    ctx.beginPath();
    ctx.arc(gameBall.posX, gameBall.posY, gameBall.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF';
    ctx.fill();
    ctx.closePath();
}

function updatePaddle(player) {
    if (player.inputUp && player.posY > 0) {
        player.posY -= paddleSpeed;
    } else if (player.inputDown && player.posY + paddleHeight < canvas.height) {
        player.posY += paddleSpeed;
    }
}

function showScoreBoard() {
    leftDisplayScore.textContent = leftPlayer.score;
    rightDisplayScore.textContent = rightPlayer.score;
    leftDisplayScore.style.visibility = 'visible';
    rightDisplayScore.style.visibility = 'visible';
}

function hideScoreBoard() {
    leftDisplayScore.style.visibility = 'hidden';
    rightDisplayScore.style.visibility = 'hidden';
}

function updateScoreBoard() {
    leftDisplayScore.textContent = leftPlayer.score;
    rightDisplayScore.textContent = rightPlayer.score;
}

function resetNames() {
    document.getElementById('leftName').textContent = '';
    document.getElementById('rightName').textContent = '';
}


function updateBall() {
    gameBall.posX += gameBall.speedX;
    gameBall.posY += gameBall.speedY;
}

function resetBall() {
    gameBall.posX = canvas.width / 2;
    gameBall.posY = canvas.height / 2;
    gameBall.speedX = -gameBall.speedX;
    gameBall.speedY = Math.random() * 10 - 5;
}

function checkCollisions() {
    // Check collision with top or bottom
    if (gameBall.posY - gameBall.radius - 10 < 0 || gameBall.posY + gameBall.radius > canvas.height - 10) {
        gameBall.speedY = -gameBall.speedY;
    }
    // Check collision with left paddle
    if (gameBall.posX - gameBall.radius < paddleWidth &&
        gameBall.posY + gameBall.radius > leftPlayer.posY &&
        gameBall.posY - gameBall.radius < leftPlayer.posY + paddleHeight) {
        gameBall.speedX = -gameBall.speedX;
    }
    // Check collision with right paddle
    if (gameBall.posX + gameBall.radius > canvas.width - paddleWidth &&
        gameBall.posY + gameBall.radius > rightPlayer.posY &&
        gameBall.posY - gameBall.radius < rightPlayer.posY + paddleHeight) {
        gameBall.speedX = -gameBall.speedX;
    }
}

function checkOutOfBound() {
    if (gameBall.posX - paddleWidth < 0) {
        rightPlayer.score++;
        updateScoreBoard();
        resetBall();
    } else if (gameBall.posX + paddleWidth > canvas.width) {
        leftPlayer.score++;
        resetBall();
        updateScoreBoard();
    }
}

function checkWinner() {
    if (leftPlayer.score === maxScore) {
        playerWins(leftPlayer);
    } else if (rightPlayer.score === maxScore) {
        playerWins(rightPlayer);
    }
}

function playerWins(player) {
    gameIsRunning = false;
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
    document.getElementById('buttons').style.visibility = 'hidden';
    playButton.removeEventListener('click', handlePlayButton);
    updateMatch(matchId, matchStatus.finish, leftPlayer.score, rightPlayer.score);
    matchId = null;
    document.getElementById('endModalMessage').textContent = player.name + ' won! Rematch?';
    modalEndScore.show();
    let newGameButton = document.getElementById('newGameButton');
    newGameButton.addEventListener('click', backToStart);
    let rematchButton = document.getElementById('rematchButton');
    rematchButton.addEventListener('click', reMatch);
}

/////////////////////////////////// CALLBACKS /////////////////////////////////////////////

function handleFormSubmit(event) {
    event.preventDefault();
    let form = event.target;
    let side;
    if (event.target.id === 'formPlayer1') {
        side = 'left';
    } else {
        side = 'right';
    }
    newPlayer(form, side);
}

function handleOnKey(event, key, isPressedOrNot) {
    event.preventDefault();
    switch (key) {
        case controls.rightUp:
            rightPlayer.inputUp = isPressedOrNot;
            break;
        case controls.rightDown:
            rightPlayer.inputDown = isPressedOrNot;
            break;
        case controls.leftUp:
            leftPlayer.inputUp = isPressedOrNot;
            break;
        case controls.leftDown:
            leftPlayer.inputDown = isPressedOrNot;
            break;
    }
}

function handleKeyDown(event) {
    return handleOnKey(event, event.key, true);
}

function handleKeyUp(event) {
    return handleOnKey(event, event.key, false);
}

function handlePlayButton(event) {
    let button = event.target;
    let buttonState = event.target.textContent;
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    if (buttonState === 'Play' && gameIsRunning === false) {
        if (matchId == null) {
            newMatch(leftPlayer.name, rightPlayer.name);
        }
        else {
            updateMatch(matchId, matchStatus.play, leftPlayer.score, rightPlayer.score);
        }
        gameIsRunning = true;
        event.target.textContent = 'Pause';
        
    } else if (buttonState === 'Pause' && gameIsRunning === true) {
        gameIsRunning = false;
        event.target.textContent = 'Play';
        updateMatch(matchId, matchStatus.pause, leftPlayer.score, rightPlayer.score);
    }
    gameLoop();
}

function backToStart() {
    modalEndScore.hide();
    hideScoreBoard();
    resetNames();
    leftPlayer = null;
    rightPlayer = null;
    draw();
    playButton.textContent = 'Play';
    playButton.addEventListener('click', handlePlayButton);
    cardPlayer1.style.visibility = 'visible';
    formPlayer1.addEventListener('submit', handleFormSubmit);
    cardPlayer2.style.visibility = 'visible';
    formPlayer2.addEventListener('submit', handleFormSubmit);
}

function reMatch() {
    modalEndScore.hide();
    leftPlayer = new Player(leftPlayer.name, "left");
    rightPlayer = new Player(rightPlayer.name, "right");
    updateScoreBoard();
    draw();
    playButton.textContent = 'Play';
    document.getElementById('buttons').style.visibility = 'visible';
    playButton.addEventListener('click', handlePlayButton);
}

function handleLeaving(event) {
    gameIsRunning = false;
    if (matchId === null && (leftPlayer !== null | rightPlayer !== null)) {
        updatePlayers(leftPlayer, rightPlayer);
        leftPlayer = null;
        rightPlayer = null;
    }
    else if (matchId !== null) {
        updateMatch(matchId, matchStatus.cancel, leftPlayer.score, rightPlayer.score);
        matchId = null;
    }
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
}

function handleHashChange(event) {
    handleLeaving(event);
    window.removeEventListener('hashchange', handleHashChange);
}

function handleNavBarButton(event) {
    handleLeaving(event);
    window.location.href = this.getAttribute('href');
    navbarButton.removeEventListener('click', handleNavBarButton);
}

function handleRefreshButton(event) {
    handleLeaving(event);
    window.removeEventListener('beforeunload', handleRefreshButton);
}